/**
 * Main module for working with PCAP and PCAPNG streams.
 * @module pcap
 */

const { PcapInputStream, PcapOutputStream } = require('./pcap');
const { PcapNGInputStream, PcapNGOutputStream, constants } = require('./pcapng');

/**
 * Creates a readable stream for network packets from PCAP or PCAPNG formats.
 *
 * @param {Object} [options={}] - Options for creating the read stream.
 * @param {('pcap'|'pcapng')} [options.format='pcap'] - The format of the capture file.
 * @returns {PcapInputStream|PcapNGInputStream} Returns a read stream of the specified format.
 * @throws {Error} Throws an error if an unknown format is provided.
 *
 * @example
 * const fs = require('node:fs');
 * const { Pcap } = require('over-the-wire');
 *
 * // Read packets from a pcapng file
 * const reader = Pcap.createReadStream({ format: 'pcapng' });
 * fs.createReadStream('dump.pcapng').pipe(reader);
 *
 * reader.on('data', (pkt) => {
 *   console.log('Read packet:', pkt);
 * });
 */
const createReadStream = ({ format = 'pcap', ...options } = {}) => {
  if (format == 'pcap') {
    return new PcapInputStream(options);
  }
  else if (format == 'pcapng') {
    return new PcapNGInputStream(options);
  }
  else {
    throw new Error(`Unknown format ${format}`);
  }
};

/**
 * Creates a writable stream for network packets to PCAP or PCAPNG formats.
 *
 * @param {Object} [options={}] - Options for creating the write stream.
 * @param {('pcap'|'pcapng')} [options.format='pcap'] - The format of the capture file.
 * @returns {PcapOutputStream|PcapNGOutputStream} Returns a write stream of the specified format.
 * @throws {Error} Throws an error if an unknown format is provided.
 *
 * @example
 * const fs = require('node:fs');
 * const { Pcap } = require('over-the-wire');
 *
 * // Save captured packets to a pcapng file
 * const dump = Pcap.createWriteStream({ format: 'pcapng' });
 * dump.pipe(fs.createWriteStream('dump.pcapng'));
 *
 * // Later, when a packet is captured (e.g., from a LiveDevice):
 * // dump.write(pkt);
 */
const createWriteStream = ({ format = 'pcap', ...options } = {}) => {
  if (format == 'pcap') {
    return new PcapOutputStream(options);
  }
  else if (format == 'pcapng') {
    return new PcapNGOutputStream(options);
  }
  else {
    throw new Error(`Unknown format ${format}`);
  }
};

/**
 * Constants specific to the PCAPNG format.
 * @type {Object}
 */

module.exports = { createReadStream, createWriteStream, constants };
