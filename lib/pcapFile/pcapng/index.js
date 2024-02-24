//TODO more block types
const { Transform } = require('stream');
const { alignOffset } = require('struct-compile');

const {
  PCAP_NG_VERSION_MAJOR,
  PCAP_NG_VERSION_MINOR,
  BYTE_ORDER_MAGIC,
  BYTE_ORDER_MAGIC_SWAP,
  structs,
  BT_SHB,
  BT_IDB,
  BT_EPB,
  BT_SPB,
  constants,
} = require('#lib/pcapFile/structs').pcapng;

const defaults = require('#lib/defaults');

const { PcapNGReader } = require('./readers');

const { additionalLength } = require('./const');

const Tsresol = require('./tsresol');

const { Packet } = require('#lib/packet');

class PcapNGInputStream extends Transform {
  constructor(opts) {
    super({ ...opts, objectMode: true });
    this.structsIdx = 0;

    this._defaultReaders();
    this.hdr = null;
    this.block = null;
    this.trailer = null;

    this.blockReader = null;
    this.blockLength = null;
    this.interfaces = [];

    this.reader = new PcapNGReader(this);

    this.on('interface-description', hdr => {
      const { linktype, options = [] } = hdr;

      const tsresol = options.find(e => e.option_code == constants.OPT_IF_TSRESOL)?.buffer;

      const name = options
        .find(e => e.option_code == constants.OPT_IF_NAME)
        ?.buffer?.toString()?.replaceAll('\0', '') ?? '';

      this.interfaces.push({
        tsresol,
        linktype,
        name,
      });
    });
  }

  _toggleEndianness() {
    this.structsIdx ^= 1;
  }

  get _structs() {
    return structs[this.structsIdx];
  }

  _defaultReaders() {
    this.hdrReader = this._structs.BlockHeader.createSingleReader({ toObject: false });
    this.trailerReader = this._structs.BlockTrailer.createSingleReader({ toObject: true });
  }

  _transform(chunk, encoding, callback) {
    try {
      this.reader.write(chunk);
    } catch(err) {
      return callback(err);
    }

    return callback();
  }
};

const {
  BlockHeader,
  BlockTrailer,
  SectionHeaderBlock,
  OptionHeader,
  InterfaceDescriptionBlock,
  EnhancedPacketBlock,
  SimplePacketBlock
} = structs[0];

function alignedBuf(src) {
  const res = Buffer.alloc(alignOffset(src.length, 4));
  if (Buffer.isBuffer(src)) {
    src.copy(res);
  }
  else if (typeof src == 'string') {
    res.write(src);
  }
  else {
    throw new Error(`Invalid alignedBuf argument ${src}`);
  }

  return res;
}

function getOpt({ option_code, option_length, buffer }) {
  const optHdr = new OptionHeader({
    option_code,
    option_length,
  });

  const optBuf = alignedBuf(buffer);
  return Buffer.concat([optHdr.buffer, optBuf]);
}

const appName = 'https://github.com/vaguue/over-the-wire';

class PcapNGOutputStream extends Transform {
  constructor(opts) {
    super({ ...opts, writableObjectMode: true });
    this._initHdr();
    this.interfaces = [];

    if (this.interfaces?.length > 0) {
      this.interfaces.forEach(iface => {
        this.iface(iface);
      });
    }
  }

  _initHdr() {
    const appOpt = getOpt({
      option_code: constants.OPT_SHB_USERAPPL,
      option_length: appName.length,
      buffer: appName,
    });

    const endOpt = getOpt({
      option_code: 0,
      option_length: 0,
      buffer: '',
    });

    const section_length = SectionHeaderBlock.prototype.config.length + appOpt.length + endOpt.length;

    const hdr = new SectionHeaderBlock({
      byte_order_magic: BYTE_ORDER_MAGIC,
      major_version: PCAP_NG_VERSION_MAJOR,
      minor_version: PCAP_NG_VERSION_MINOR,
      section_length,
    });

    const total_length = section_length + additionalLength;

    const blockHdr = new BlockHeader({
      block_type: BT_SHB,
      total_length,
    });

    this.push(blockHdr.buffer);
    this.push(hdr.buffer);
    this.push(appOpt);
    this.push(endOpt);
    this.push(new BlockTrailer({ total_length }).buffer);
  }

  _parseOptions(options) {
    const optSerialized = options.map(opt => getOpt(opt));
    if (options.length > 0 && options[options.length - 1].option_code != 0) {
      optSerialized.push(getOpt({ option_code: 0, option_length: 0, buffer: '' }));
    }
    const optLen = optSerialized.reduce((res, e) => res + e.length, 0);
    return { optSerialized, optLen };
  }

  iface({ linktype, snaplen = defaults.snaplen, tsresol = null, name = null }) {
    const iface = new InterfaceDescriptionBlock({
      linktype: linktype,
      reserved: 0,
      snaplen,
    });

    const options = [];

    if (name?.length > 0) {
      options.push({
        option_code: constants.OPT_IF_NAME,
        option_length: name.length,
        buffer: Buffer.from(name),
      });
    }

    options.push({
      option_code: constants.OPT_IF_TSRESOL,
      option_length: 1,
      buffer: tsresol ?? Buffer.from([0x09, 0x00, 0x00, 0x00]),
    });

    const { optSerialized, optLen } = this._parseOptions(options);
    const total_length = additionalLength + optLen + iface.length;

    this.push(new BlockHeader({
      block_type: BT_IDB,
      total_length,
    }).buffer);

    this.push(iface.buffer);

    optSerialized.forEach(optBuf => this.push(optBuf));

    this.push(new BlockTrailer({ total_length }).buffer);

    this.interfaces.push({ linktype, snaplen, options });

    return this.interfaces.length - 1;
  }

  simplePacket(buffer) {
    const simplePacketHeader = new SimplePacketBlock({ caplen: buffer.length });
    const total_length = simplePacketHeader.length + buffer.length + additionalLength;

    this.push(new BlockHeader({
      block_type: BT_SPB,
      total_length,
    }).buffer);
    this.push(simplePacketHeader.buffer);
    this.push(alignedBuf(buffer));
    this.push(new BlockTrailer({ total_length }).buffer);
  }

  _findIfaceIndex(iface) {
    return this.interfaces.findIndex(e => {
      let res = e.linktype == iface.linktype;
      if (iface.name && e.name) {
        res &&= iface.name === e.name;
      }

      return res;
    });
  }

  enhancedPacket(pkt) {
    const { buffer } = pkt;

    if (!buffer) {
      throw new Error('Expected EnhancedPacket to have buffer property');
    }

    const options = [];
    if (pkt.comment) {
      options.push({
        option_code: constants.OPT_COMMENT,
        option_length: pkt.comment.length,
        buffer: Buffer.from(pkt.comment),
      });
    }

    const { optSerialized, optLen } = this._parseOptions(options);

    let interface_id;

    if (pkt.iface) {
      interface_id = this._findIfaceIndex(pkt.iface);
      if (interface_id == -1) {
        interface_id = this.iface({
          ...pkt.iface,
          //ugly move to keep the same tsresol
          ...(pkt.timestamp.tsresol && { tsresol: pkt.timestamp.tsresol }),
        });
      }
    }
    else {
      throw new Error('Expected EnhancedPacket to have iface property');
    }

    const tsresol = this.interfaces[interface_id].options.find(e => e.option_code == constants.OPT_IF_TSRESOL)?.buffer;

    const { timestamp_high, timestamp_low } = Tsresol.serialize(tsresol, pkt.timestamp);

    const packetHeader = new EnhancedPacketBlock({
      interface_id,
      caplen: pkt.length,
      len: pkt.origLength,
      timestamp_high, timestamp_low,
    });

    const total_length = packetHeader.length + buffer.length + optLen + additionalLength;

    this.push(new BlockHeader({
      block_type: BT_EPB,
      total_length,
    }).buffer);

    this.push(packetHeader.buffer);
    this.push(alignedBuf(buffer));

    optSerialized.forEach(optBuf => this.push(optBuf));

    this.push(new BlockTrailer({ total_length }).buffer);
  }

  _transform(chunk, encoding, callback) {
    try {
      if (Buffer.isBuffer(chunk)) {
        this.simplePacket(chunk);
      }
      else if (chunk instanceof Packet) {
        this.enhancedPacket(chunk);
      }
      else {
        throw new Error(`Invalid argument: ${chunk}`);
      }
    } catch(err) {
      return callback(err);
    }

    callback();
  }
};

module.exports = { PcapNGInputStream, PcapNGOutputStream, constants };
