`netstat -tulpn`: the ports this machine listens on and the processes behind them. Useful to see what a server exposes before pointing a scanner at it from outside.

```javascript
import { system } from 'over-the-wire';

const ports = await system.getOpenPorts();

for (const { protocol, address, port, pid, process: owner } of ports) {
  const reachableFromOutside = address !== '127.0.0.1' && address !== '::1';

  console.log([
    protocol.padEnd(4),
    `${address}:${port}`.padEnd(28),
    String(pid ?? '-').padEnd(8),
    (owner ?? '-').padEnd(24),
    reachableFromOutside ? 'exposed' : 'local only',
  ].join(' '));
}
```

The same listing is one command away: `otw ports`, or `.ports` in the shell.

A process is named only when the caller may inspect it. Run it as root to see the owners of every socket: without root Linux lists other users' sockets without a process and macOS leaves them out.
