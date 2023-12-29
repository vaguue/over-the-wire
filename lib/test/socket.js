const { socket } = require('..');

const addr = new socket.SockAddr({
  ip: '192.168.1.1',
});

console.log(addr.domain == socket.AF_INET);
console.log(addr.toBuffer(), addr.toString(), addr);
addr.port = 123;
console.log(addr.toBuffer(), addr.toString(), addr);
console.log(socket.inetNtop(2, socket.inetPton(2, '192.168.1.1')));
