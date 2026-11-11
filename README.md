<p align='center'>
  <img src='assets/s1.svg' width='180' alt='Hacker spider'>
</p>


# Over-the-wire [![GitHub license](https://img.shields.io/github/license/vaguue/over-the-wire?style=flat)](https://github.com/vaguue/over-the-wire/blob/main/LICENSE) [![npm](https://img.shields.io/npm/v/over-the-wire)](https://www.npmjs.com/package/over-the-wire) ![Development Status](https://img.shields.io/badge/status-in_development-orange)

*The project is currently under active development.*

## Overview
`over-the-wire` is a Node.js packet manipulation library supporting:
- Packet crafting and parsing
- Capturing network traffic and sending packets in all formats
- Parsing and serializing pcap and pcapng file formats
- Creating custom non-TCP/UDP socket instances

## System Requirements
- Libpcap/WinPcap/Npcap library installed (if Wireshark is installed on your system, you are good to go)
- Node.js 18 or higher. The package is an ES module: use `import`. `require('over-the-wire')` works on Node.js versions that can load ES modules through `require` (20.19+, 22.12+) and returns the module namespace, so the callable is `require('over-the-wire').default`.
- C++ compiler, if there are no prebuilt bindings for your system

## Installation

```bash
npm install over-the-wire --save
```

## Getting started
This example shows a Node.js implementation of traceroute built with nothing but the Node.js standard library and the over-the-wire API.
The code is kind of oversimplified, it as a minimal, self-contained demo of the key abstractions in the library:
- Discover the active default gateway
- craft and send ICMP Echo packets hop-by-hop
- Capture the entire exchange to a pcap/pcapng file for later inspection.
```javascript
import net from 'node:net';
import os from 'node:os';
import fs from 'node:fs';

import otw from 'over-the-wire';

function getMyIp(iface, targetIp) {
  const family = net.isIP(targetIp) == 6 ? 'IPv6' : 'IPv4';
  return os.networkInterfaces()?.[iface]?.find(e => e.family == family)?.address;
}

async function traceroute(targetIp) {
  const { Pcap, Packet } = otw;

  // ARP and Routing info
  const [
    { iface, ip: gatewayIp, family },
    arpTable,
  ] = await Promise.all([
    otw.system.gatewayFor(targetIp),
    otw.system.getArpTable(),
  ]);

  if (family != 'AF_INET') {
    console.error('Unsupported family');
    process.exit(0);
  }

  const gatewayMac = arpTable[iface].find(e => e.ipAddr == gatewayIp).hwAddr;

  // Listen for all ICMP requests
  const dev = new Pcap.LiveDevice({
    iface,
    direction: 'inout',
    filter: 'icmp',
  });

  // Get info about interface
  console.log('[*] Using interface: ', dev.iface);

  // Save captured packets to a pcapng file
  const dump = Pcap.createWriteStream({ format: 'pcapng' });
  dump.pipe(fs.createWriteStream('dump.pcapng'));

  const myIp = getMyIp(iface, targetIp);
  const myMac = dev.iface.mac;
  const path = [];

  let ttl = 1;
  let sequence = 1;

  // Send ICMP echo request with a specified TTL
  const ping = (timeToLive) => {
    const pkt = new Packet({ iface: dev.iface })
                    .ethernet({ src: myMac, dst: gatewayMac })
                    .ipv4({ src: myIp, dst: targetIp, timeToLive })
                    .icmp({
                      type: 8,
                      code: 0,
                      id: Math.floor(Math.random() * 65535),
                      sequence,
                    });
    dev.write(pkt);
    sequence++;
  };

  // Re-ping with the same TTL if there's no progress (handles the very first
  // hop too, where no reply has been received yet).
  setInterval(() => ping(ttl), 200);

  dev.on('data', pkt => {
    try {
      if (pkt.layers.ICMP && pkt.layers.IPv4.dst == myIp) {
        const srcIp = pkt.layers.IPv4.src;

        if (pkt.layers.ICMP.type == 0) {
          path.push(targetIp);
          console.log('[*] Traced path');
          console.log([...new Set(path)].map(e => `- ${e}`).join('\n'));
          process.exit(0);
        }
        else if (path[path.length - 1] != srcIp) {
          path.push(srcIp);
          ttl++;
          ping(ttl);
        }
      }

      dump.write(pkt);
    } catch(err) {
      console.error(err);
      process.exit(1);
    }
  });

  ping(ttl);
}

// google.com's IP
traceroute('172.217.168.174').catch(console.error);
```

### Building packets the way the host would send them

`otw()` returns a context that knows the routing table, the neighbour table and the local interfaces. A packet described through it can be awaited: the interface, the source addresses and the next hop's link-layer address are filled in the way the network stack would, and the Ethernet layer is added when it's left out.

```javascript
import otw from 'over-the-wire';

const wire = otw();

const pkt = await wire.packet()
  .ipv4({ dst: '8.8.8.8' })
  .icmp({ type: 8, id: 1, sequence: 1 });

console.log(pkt.iface.name, pkt.layers.Ethernet.dst, pkt.layers.IPv4.src);
```

- Anything set explicitly is kept as written.
- Without `await`, nothing is looked up: `.build()` and `.buffer` give the packet exactly as described, and writing the un-awaited builder to a device sends that.
- `otw({ iface: 'en0' })` binds the context to one interface. Lookups are cached per context for a few seconds, `wire.flush()` drops them.
- The link layer follows the interface: Ethernet where there is one, the loopback header on tunnels and loopback interfaces, none where the interface carries bare IP.
- An unknown next hop is resolved by the host: one empty-handed datagram is sent to it so the kernel performs ARP or neighbour discovery, and the answer is read back from the neighbour table.
- When something can't be resolved the promise rejects with a `code`: `ENOROUTE`, `ENONEIGHBOUR` (the next hop did not answer) or `ENOADDRESS`.
- `otw.registerLayer(MyLayer)` adds a protocol to the builders.

### Filters, capturing and waiting for an answer

`wire.filter()` describes packets with the same layer and field names as the packet builder. A filter compiles to a capture filter expression where one exists, and matches parsed packets in process either way.

```javascript
const handshake = wire.filter()
  .ipv4({ host: '203.0.113.10' })
  .udp({ port: 51820 });

handshake.toString();
// 'ip and ip host 203.0.113.10 and udp and udp port 51820'

handshake.matches(packet);
```

- Values can be a single value, a list of alternatives, a comparison (`{ lt: 5 }`, `gt`, `lte`, `gte`, `ne`) or a function.
- `host` and `port` match either direction. TCP flags are matched by name: `.tcp({ flags: { syn: 1, ack: 0 } })`.
- `.or(other)` and `.not(other)` take a filter or a function describing one; `.raw('...')` embeds a capture filter expression.
- Fields with no capture filter equivalent still match in process; `filter.expressible` tells which kind a filter is.

Devices and socket streams can wait for a packet. `expect` resolves with the next packet matching a filter, or `null` when the timeout passes. Packets that arrive between two calls are kept, so nothing is missed in between.

```javascript
const capture = await wire.capture(handshake);

const outgoing = await capture.expect(wire.filter().ipv4({ dst: '203.0.113.10' }), { timeout: 30000 });
const incoming = await capture.expect(wire.filter().ipv4({ src: '203.0.113.10' }), { timeout: 5000 });

console.log(incoming === null ? 'no reply' : 'answered');
```

`wire.send(packet)` resolves the packet if it is still a description, writes it to the interface it routes through, and can wait for the answer:

```javascript
const reply = await wire
  .send(wire.packet().ipv4({ dst: '203.0.113.10' }).udp({ src: 40000, dst: 51820 }).payload({ data }))
  .expect(wire.filter().udp({ src: 51820 }), { timeout: 2000 });
```

`wire.close()` closes the devices opened by `send`.

## Documentation

[Here :)](https://vaguue.github.io/over-the-wire)

## Questions or Suggestions
Feel free to open any issue in the Issues section of this repository. Currently, there are no restrictions on the format.
