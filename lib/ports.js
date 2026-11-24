import bindings from '#lib/bindings';

const { getOpenPorts: getOpenPortsCxx } = bindings;

/**
 * A socket that accepts traffic on this machine.
 * @typedef {Object} OpenPort
 * @property {string} protocol - 'tcp' for a listening TCP socket, 'udp' for a bound UDP socket.
 * @property {string} family - 'IPv4' or 'IPv6'.
 * @property {string} address - The local address the socket is bound to, '0.0.0.0' or '::' for every address.
 * @property {number} port - The local port.
 * @property {?number} pid - The process that owns the socket, null when the system does not tell.
 * @property {?string} process - The name of that process.
 */

/**
 * Lists the ports this machine listens on, like `netstat -tulpn`.
 * Sockets of other users are attributed to a process only when the caller may inspect it:
 * without root Linux lists them with a null pid, macOS leaves them out.
 *
 * @async
 * @function getOpenPorts
 * @memberof module:system
 * @param {Object} [options]
 * @param {string} [options.protocol] - Keep only 'tcp' or only 'udp'.
 * @returns {Promise<OpenPort[]>} Sorted by port, then protocol.
 *
 * @example
 * const ports = await system.getOpenPorts({ protocol: 'tcp' });
 * // [{ protocol: 'tcp', family: 'IPv4', address: '0.0.0.0', port: 22, pid: 812, process: 'sshd' }]
 */
const readOpenPortsFromNative = () => {
  return new Promise((resolve, reject) => {
    getOpenPortsCxx((res) => {
      if (res instanceof Error) {
        reject(res);
        return;
      }
      resolve(res);
    });
  });
};

const identityOf = ({ protocol, family, address, port, pid }) => {
  return `${protocol} ${family} ${address} ${port} ${pid}`;
};

const withoutRepeats = (ports) => {
  const seen = new Set();

  return ports.filter((port) => {
    const identity = identityOf(port);

    if (seen.has(identity)) {
      return false;
    }

    seen.add(identity);
    return true;
  });
};

const inListingOrder = (left, right) => {
  return left.port - right.port
    || left.protocol.localeCompare(right.protocol)
    || left.family.localeCompare(right.family)
    || left.address.localeCompare(right.address);
};

const getOpenPorts = async ({ protocol = null } = {}) => {
  const ports = withoutRepeats(await readOpenPortsFromNative());
  const wanted = protocol === null ? ports : ports.filter(port => port.protocol === protocol);

  return wanted.sort(inListingOrder);
};

export { getOpenPorts };
export default { getOpenPorts };
