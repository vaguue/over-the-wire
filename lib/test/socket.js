const dgram = require('dgram');
const os = require('os');
const { EventEmitter } = require('events');
const { socket } = require('..');
require('./traceMemory');

const addr = new socket.SockAddr({
  //ip: '192.168.1.1',
  ip: '127.0.0.1',
});

console.log(addr.domain == socket.AF_INET);
console.log(addr.toBuffer(), addr.toString(), addr);
addr.port = 123;
console.log(addr.toBuffer(), addr.toString(), addr);
console.log(socket.inetNtop(2, socket.inetPton(2, '192.168.1.1')));

const sock = new socket.Socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP);
//sock.bind(new socket.SockAddr({ ip: os.networkInterfaces().en0[1].address, port: 8888 }));
sock.bind(new socket.SockAddr({ ip: '127.0.0.1', port: 8888 }));

sock.on('data', (buf, addr) => console.log(buf.toString(), addr));
sock.on('error', (err) => console.log('error', err));
sock.resume();

/*for (let i = 0; i < 100; ++i) {
  sock.write(Array.from({ length: 8 }, () => [Buffer.from('kekkekekekkekekeke'), addr]));
}*/

sock.on('drain', () => {
  console.log('[*] drain');
  //sock.write(Array.from({ length: 8 }, () => [Buffer.from('kekkekekekkekekeke'), addr]));
});

const message = Buffer.from('Some bytes');
const client = dgram.createSocket('udp4');
function produceMessage() {
  client.send(message, 8888, 'localhost', (err) => {
    if (err) console.log('error', err);
  });
}

setInterval(produceMessage, 100);
setInterval(() => sock.write(Buffer.from('kekkekekekkekekeke'), addr), 100);
