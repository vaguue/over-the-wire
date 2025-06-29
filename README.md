<p align='center'>
  <img src='assets/s1.svg' width='180' alt='Hacker spider'>
</p>

СЕВА ТЫ КАК ТАМ ЕПТА
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
- Node.js version 16.10.0 or higher recommended
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
const net = require('node:net');
const os = require('node:os');
const fs = require('node:fs');

const otw = require('over-the-wire');

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
  const path = [];

  let ttl = 1;

  //Send ICMP packet with a specified TTL
  let sequence = 1;
  const ping = (timeToLive) => {
    const pkt = new Packet({ iface: dev.iface })
                    .Ethernet({ dst: gatewayMac })
                    .IPv4({ src: myIp, dst: targetIp, timeToLive })
                    .ICMP({ 
                      type: 8,
                      code: 0,
                      id: Math.floor(Math.random() * 65535),
                      sequence,
                    });
    dev.write(pkt);
    sequence++;
  };

  // Print packet info
  dev.on('data', pkt => {
    try {
      // Uncomment for debugging
      //console.log(`[*] ${pkt.layers.IPv4.src} -> ${pkt.layers.IPv4.dst} (${pkt.layers.ICMP.type}), ttl: ${ttl}, [${path.join()}]`);
      if (pkt.layers.ICMP && pkt.layers.IPv4.dst == myIp) {
        const srcIp = pkt.layers.IPv4.src;

        if (pkt.layers.ICMP.type == 0) {
          path.push(targetIp);
          console.log('[*] Traced path');
          console.log([...new Set(path)].map(e => `- ${e}`).join('\n'));
          process.exit(0);
        }
        else {
          if (path[path.length - 1] != srcIp) {
            path.push(srcIp);
            ttl++;
          }
          ping(ttl);

          const fixedTtl = ttl;

          // Just in case there is no response
          let tid = setInterval(() => {
            if (ttl == fixedTtl) {
              ping(ttl);
            }
            else {
              clearInterval(tid);
            }
          }, 2e2);
        }
      }
      
      //Saving all captured traffic
      dump.write(pkt);
    } catch(err) {
      console.error(err);
      process.exit(1);
    }
  });

  setTimeout(() => ping(ttl), 1e3);
}

// google.com's IP
traceroute('172.217.168.174').catch(console.error);
```

## Documentation

[Here :)](https://vaguue.github.io/over-the-wire)

## Questions or Suggestions
Feel free to open any issue in the Issues section of this repository. Currently, there are no restrictions on the format.
