const net = require('node:net');
const os = require('node:os');
const fs = require('node:fs');

const otw = require('..');

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
//traceroute('139.47.22.33').catch(console.error);
// local IP
traceroute('192.168.1.131').catch(console.error);
