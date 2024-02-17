const { Transform } = require('stream');

const {
  PcapFileHeader,
  PacketHeader,
  PcapFileHeaderBE,
  PacketHeaderBE,
  BYTE_ORDER_MAGIC,
  BYTE_ORDER_MAGIC_SWAPPED,
  BYTE_ORDER_MAGIC_NANO,
  BYTE_ORDER_MAGIC_SWAPPED_NANO,
} = require('./structs').pcap;

const { BlockReader, BufferReader } = require('./reader');

const { TimeStamp } = require('../timestamp');

const defaults = require('../defaults');

const { Packet } = require('../packet');

class PcapReader extends BlockReader {
  constructor(...args) {
    super(...args);

    this.hdrReader = PcapFileHeader.createSingleReader({ toObject: false });
    this.hdr = null;

    this.pktHdrReader = PacketHeader.createSingleReader({ toObject: true });
    this.pendingPkt = null;
  }
 
  nextStage() {
    if (this.stage == 0) {
      this.reader = this.hdrReader;
      this.stage = 1;
    }
    else if (this.stage == 1) {
      this.hdr = this.hdrReader.result;
      this.pktIface = {
        linktype: this.hdr.linktype,
      };

      if (this.hdr.magic == BYTE_ORDER_MAGIC_SWAPPED || this.hdr.magic == BYTE_ORDER_MAGIC_SWAPPED_NANO) {
        this.pktHdrReader = PacketHeaderBE.createSingleReader({ toObject: true });
        this.hdr = new PcapFileHeaderBE(this.hdr.buffer).toObject();
      }
      else if (this.hdr.magic == BYTE_ORDER_MAGIC || this.hdr.magic == BYTE_ORDER_MAGIC_NANO) {
        this.hdr = this.hdr.toObject();
      }
      else {
        throw new Error(`Unknown magic number: ${this.hdr.magic.toString(16)}`);
      }
      this.inputStream.emit('header', this.hdr);

      this.timeUnit = this.hdr.magic == BYTE_ORDER_MAGIC_NANO ? 'ns' : 'ms';

      this.reader = this.pktHdrReader;
      this.stage = 2;
    }
    else if (this.stage == 2) {
      this.pendingPkt = this.pktHdrReader.result;
      this.pendingPkt.buf = [];
      this.pendingPkt.currentSize = 0;
      this.pktHdrReader.reset();

      this.reader = new BufferReader(this.pendingPkt.caplen);
      this.stage = 3;
    }
    else if (this.stage == 3) {
      this.inputStream.push(new Packet({
        buffer: this.reader.result,
        iface: this.pktIface,
        timestamp: new TimeStamp({ 
          s: this.pendingPkt.tv_sec, 
          ...(this.timeUnit == 'ns' ? { ns: this.pendingPkt.tv_usec } : { ms: this.pendingPkt.tv_usec })
        }),
      }));

      this.pendingPkt = null;

      this.reader = this.pktHdrReader;
      this.stage = 2;
    }
  }
}

class PcapInputStream extends Transform {
  constructor(opts) {
    super({ ...opts, readableObjectMode: true });
    this.blockReader = new PcapReader(this);
  }

  _transform(chunk, encoding, callback) {
    try {
      this.blockReader.write(chunk);
    } catch(err) {
      return callback(err);
    }
    return callback();
  }
};

class PcapOutputStream extends Transform {
  constructor({ timeUnit = 'ms', iface = null, snaplen = null, ...opts } = {}) {
    super({ ...opts, writableObjectMode: true });

    this.timeUnit = timeUnit;

    this.snaplen = snaplen ?? iface?.mtu ?? defaults.snaplen;
    this.linktype = iface?.linktype ?? defaults.linktype;
    this.hdrDone = false;
  }

  _transform(chunk, encoding, callback) {
    if (!this.hdrDone) {
      let snaplen, linktype;

      if (chunk instanceof Packet && chunk.iface) {
        snaplen = chunk.iface.mtu;
        linktype = chunk.iface.linktype;
      }

      snaplen ||= this.snaplen;
      linktype ||= this.linktype;

      const hdr = new PcapFileHeader({
        magic: this.timeUnit == 'ms' ? BYTE_ORDER_MAGIC : BYTE_ORDER_MAGIC_NANO,
        version_major: 2,
        version_minor: 4,
        thiszone: 0,
        sigfigs: 0,
        snaplen,
        linktype,
      });

      this.push(hdr.buffer);
      this.hdrDone = true;
    }

    let ts, buffer;

    if (Buffer.isBuffer(chunk)) {
      ts = TimeStamp.now(this.timeUnit);
      buffer = chunk;
    }
    else if (chunk instanceof Packet) {
      ts = chunk.timestamp;
      buffer = chunk.buffer;
    }
    else {
      return callback(new Error(`Invalid argument: ${chunk}`));
    }

    let tv_usec, tv_sec;

    if (this.timeUnit == 'ns') {
      const packed = ts.packedIn({ s: true, ns: true });
      tv_sec = packed.s;
      tv_usec = packed.ns;
    }
    else {
      const packed = ts.packedIn({ s: true, ms: true });
      tv_sec = packed.s;
      tv_usec = packed.ms;
    }

    const pktHdr = new PacketHeader({
      tv_sec,
      tv_usec,
      caplen: buffer.length,
      len: buffer.length,
    });

    this.push(pktHdr.buffer);
    this.push(buffer);

    callback();
  }
};

module.exports = { PcapInputStream, PcapOutputStream };
