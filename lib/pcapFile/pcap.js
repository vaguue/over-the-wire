const { Transform } = require('stream');
const { compile } = require('struct-compile');

const { LinkLayerType } = require('../enums');
const pick = require('../pick');

const { PcapFileHeader, PacketHeader, PcapFileHeaderBE, PacketHeaderBE } = compile(`
  struct PcapFileHeader {
    uint32_t magic;
    uint16_t version_major;
    uint16_t version_minor;
    int32_t thiszone;
    uint32_t sigfigs;
    uint32_t snaplen;
    uint32_t linktype;
  };

  struct PacketHeader {
    uint32_t tv_sec;
    uint32_t tv_usec;
    uint32_t caplen;
    uint32_t len;
  };

  //@BE
  struct PcapFileHeaderBE {
    uint32_t magic;
    uint16_t version_major;
    uint16_t version_minor;
    int32_t thiszone;
    uint32_t sigfigs;
    uint32_t snaplen;
    uint32_t linktype;
  };

  //@BE
  struct PacketHeaderBE {
    uint32_t tv_sec;
    uint32_t tv_usec;
    uint32_t caplen;
    uint32_t len;
  };
`);

const magicNumber = {
  identical: 0xa1b2c3d4,
  swapped: 0xd4c3b2a1,
};

class PcapInputStream extends Transform {
  constructor(opts) {
    super({ ...opts, objectMode: true });
    this.hdrReader = PcapFileHeader.createSingleReader({ toObject: false });
    this.hdr = null;

    this.pktHdrReader = PacketHeader.createSingleReader({ toObject: true, selfEnd: false });
    this.pendingPkt = null;
  }

  _transform(chunk, encoding, callback) {
    let buf = chunk;
    while (buf?.length) {
      if (!this.hdr) {
        this.hdrReader.write(buf);
        if (this.hdrReader.finished) {
          this.hdr = this.hdrReader.result;
          if (this.hdr.magic == magicNumber.swapped) {
            this.pktHdrReader.end();
            this.pktHdrReader = PacketHeaderBE.createSingleReader({ toObject: true, selfEnd: false });
            this.hdr = new PcapFileHeaderBE(this.hdr.buffer).toObject();
          }
          else if (this.hdr.magic == magicNumber.identical) {
            this.hdr = this.hdr.toObject();
          }
          else {
            callback(new Error('Unknown magic number'));
          }
          buf = this.hdrReader.remaining;
          this.hdrReader = null;
          this.emit('header', this.hdr);
        }
      }
      else if (this.pendingPkt === null) {
        this.pktHdrReader.write(buf);
        if (this.pktHdrReader.finished) {
          this.pendingPkt = this.pktHdrReader.result;
          this.pendingPkt.buf = [];
          this.pendingPkt.currentSize = 0;
          buf = this.pktHdrReader.remaining;
          this.pktHdrReader.reset();
        }
      }
      else {
        this.pendingPkt.buf.push(buf);
        this.pendingPkt.currentSize += buf.length;
        if (this.pendingPkt.currentSize >= this.pendingPkt.caplen) {
          const pktBuf = Buffer.concat(this.pendingPkt.buf);
          buf = pktBuf.subarray(this.pendingPkt.caplen);
          this.pendingPkt.buf = pktBuf.subarray(0, this.pendingPkt.caplen);
          delete this.pendingPkt.currentSize;
          this.push(this.pendingPkt);
          this.pendingPkt = null;
        }
      }
    }
    
    return callback();
  }

  _final(callback) {
    if (this.hdrReader && !this.hdrReader.closed) {
      this.hdrReader.end();
    }
    if (this.pktHdrReader) {
      this.pktHdrReader.end();
    }
    callback();
  }
};

class PcapOutputStream extends Transform {
  constructor(opts) {
    super({ ...opts, objectMode: true });

    const snaplen = opts.snaplen ?? 3000;
    const linktype = opts.linktype ?? LinkLayerType.ETHERNET;

    const hdr = new PcapFileHeader({
      magic: magicNumber.identical,
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
