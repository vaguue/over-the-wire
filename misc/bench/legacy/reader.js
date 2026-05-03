class BlockReader {
  constructor(inputStream, blockHdr = null) {
    this.inputStream = inputStream;
    this.blockHdr = blockHdr;
    this.resetBlockReader();
  }

  resetBlockReader() {
    this.finished = false;
    this.remaining = null;
    this.stage = -1;
  }

  write(chunk) {
    if (this.finished == true) {
      throw new Error('Already finished');
    }
    if (this.stage == -1) {
      this.stage = 0;
      this.nextStage();
    }
    let buf = chunk;
    while (buf?.length > 0) {
      if (this.reader === null) {
        this.finished = true;
        this.remaining = buf;
        break;
      }

      this.reader.write(buf);

      if (this.reader.finished) {
        buf = this.reader.remaining;
        this.nextStage();
      }
      else {
        buf = null;
      }
    }
  }
}

class BufferReader {
  constructor(length) {
    this.length = length;
    this.bufs = [];
    this.readLength = 0;
  }

  write(chunk) {
    if (this.finished == true) {
      throw new Error('Already finished');
    }
    this.bufs.push(chunk);
    this.readLength += chunk.length;
    if (this.readLength >= this.length) {
      const output = Buffer.concat(this.bufs);
      this.result = output.subarray(0, this.length);
      this.remaining = output.subarray(this.length);
      this.finished = true;
    }
  }
}

module.exports = { BlockReader, BufferReader };
