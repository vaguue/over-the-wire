const { socket } = require('..');

const addr = new socket.SockAddr();
addr.domain = socket.AF_INET;
addr.ip = '192.168.1.1';
addr.port = 123;

console.log(addr.toString());
console.log(addr.toBuffer());
console.log(addr);
console.log(socket.inetNtop(2, socket.inetPton(2, '192.168.1.1')));
