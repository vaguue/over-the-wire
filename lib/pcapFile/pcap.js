const { Transform } = require('stream');

const {
  PcapFileHeader, 
  PacketHeader, 
  PcapFileHeaderBE, 
  PacketHeaderBE, 
  BYTE_ORDER_MAGIC, 
  BYTE_ORDER_MAGIC_SWAPPED 
} = require('./structs').pcap;

const defaults = require('../defaults');
const { BlockReader, BufferReader } = require('./reader');

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
      if (this.hdr.magic == BYTE_ORDER_MAGIC_SWAPPED) {
        this.pktHdrReader = PacketHeaderBE.createSingleReader({ toObject: true });
        this.hdr = new PcapFileHeaderBE(this.hdr.buffer).toObject();
      }
      else if (this.hdr.magic == BYTE_ORDER_MAGIC) {
        this.hdr = this.hdr.toObject();
      }
      else {
        throw new Error(`Unknown magic number: ${this.hdr.magic.toString(16)}`);
      }
      this.inputStream.emit('header', this.hdr);

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
      this.pendingPkt.buf = this.reader.result;
      delete this.pendingPkt.currentSize;
      this.inputStream.push(this.pendingPkt);
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
  constructor(opts) {
    super({ ...opts, writableObjectMode: true });

    const snaplen = opts.snaplen ?? defaults.snaplen;
    const linktype = opts.linktype ?? defaults.linktype;

    const hdr = new PcapFileHeader({
      magic: BYTE_ORDER_MAGIC,
      version_major: 2,
      version_minor: 4,
      thiszone: 0,
      sigfigs: 0,
      snaplen,
      linktype,
    });

    this.push(hdr.buffer);
  }

  _transform(chunk, encoding, callback) {
    if (Buffer.isBuffer(chunk)) {
      const now = Date.now();
      const pktHdr = new PacketHeader({
        tv_sec: Math.floor(now / 1000),
        tv_usec: now % 1000,
        caplen: chunk.length,
        len: chunk.length,
      });

      this.push(pktHdr.buffer);
      this.push(chunk);

      callback();
    }
    else if (
      typeof chunk == 'object' && 
      chunk.hasOwnProperty('tv_sec') &&
      chunk.hasOwnProperty('tv_usec') &&
      chunk.hasOwnProperty('caplen') &&
      chunk.hasOwnProperty('len') &&
      chunk.hasOwnProperty('buf')
    ) {
      this.push(new PacketHeader(chunk).buffer);
      this.push(chunk.buf);

      callback();
    }
    else {
      callback(new Error(`Invalid argument: ${chunk}`));
    }
  }
};

module.exports = { PcapInputStream, PcapOutputStream };
