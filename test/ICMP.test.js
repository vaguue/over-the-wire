const { strict: assert } = require('node:assert');
const test = require('node:test');

const { ICMP } = require('#lib/layers/ICMP');
const { ICMPTypes } = require('#lib/layers/enums');

const echoReqBuf = Buffer.from('08007cda1a2b00010001000000000000', 'hex');
const echoRepBuf = Buffer.from('00007cda1a2b00010001000000000000', 'hex');
const destUnreachBuf = Buffer.from('03017cda0000000000000000', 'hex');
const timeExceededBuf = Buffer.from('0b007cda00000000', 'hex');
const paramProblemBuf = Buffer.from('0c007cda04000000', 'hex');
const tsReqBuf = Buffer.from('0d007cda1a2b000100010000000000000000000000000000', 'hex');
const tsRepBuf = Buffer.from('0e007cda1a2b000100010000000000000000000000000000', 'hex');

function roundtrip(buf, Cls = ICMP) {
  const parsed = new Cls(buf);
  const obj = parsed.toObject();
  const reparsed = new Cls(obj);
  if (Buffer.compare(parsed.buffer.slice(0, reparsed.buffer.length), reparsed.buffer)) {
    console.log('roundtrip', obj, parsed.buffer.slice(0, reparsed.buffer.length), reparsed.buffer, reparsed.toObject());
  }
  assert.equal(Buffer.compare(parsed.buffer.slice(0, reparsed.buffer.length), reparsed.buffer), 0, 'buffer -> parse -> object -> buffer roundtrip');
  assert.deepEqual(reparsed.toObject(), obj, 'object roundtrip');
}

test('ICMP Echo Request', async () => {
  const icmp = new ICMP(echoReqBuf);
  assert.equal(icmp.type, ICMPTypes.EchoRequest);
  assert.equal(icmp.code, 0);
  assert.ok(icmp.isEchoRequest);
  assert.equal(icmp.typeName, 'EchoRequest');
  const obj = icmp.toObject();
  assert.equal(obj.isEchoRequest, true);
  assert.equal(obj.typeName, 'EchoRequest');
  roundtrip(echoReqBuf);
});

test('ICMP Echo Reply', async () => {
  const icmp = new ICMP(echoRepBuf);
  assert.equal(icmp.type, ICMPTypes.EchoReply);
  assert.equal(icmp.code, 0);
  assert.ok(icmp.isEchoReply);
  assert.equal(icmp.typeName, 'EchoReply');
  const obj = icmp.toObject();
  assert.equal(obj.isEchoReply, true);
  assert.equal(obj.typeName, 'EchoReply');
  roundtrip(echoRepBuf);
});

test('ICMP Destination Unreachable', async () => {
  const icmp = new ICMP(destUnreachBuf);
  assert.equal(icmp.type, ICMPTypes.DestinationUnreachable);
  assert.equal(icmp.code, 1);
  assert.ok(icmp.isDestinationUnreachable);
  assert.equal(icmp.typeName, 'DestinationUnreachable');
  const obj = icmp.toObject();
  assert.equal(obj.isDestinationUnreachable, true);
  assert.equal(obj.typeName, 'DestinationUnreachable');
  roundtrip(destUnreachBuf);
});

test('ICMP Time Exceeded', async () => {
  const icmp = new ICMP(timeExceededBuf);
  assert.equal(icmp.type, ICMPTypes.TimeExceeded);
  assert.equal(icmp.code, 0);
  assert.ok(icmp.isTimeExceeded);
  assert.equal(icmp.typeName, 'TimeExceeded');
  const obj = icmp.toObject();
  assert.equal(obj.isTimeExceeded, true);
  assert.equal(obj.typeName, 'TimeExceeded');
  roundtrip(timeExceededBuf);
});

test('ICMP Parameter Problem', async () => {
  const icmp = new ICMP(paramProblemBuf);
  assert.equal(icmp.type, ICMPTypes.ParameterProblem);
  assert.equal(icmp.code, 0);
  assert.ok(icmp.isParameterProblem);
  assert.equal(icmp.typeName, 'ParameterProblem');
  const obj = icmp.toObject();
  assert.equal(obj.isParameterProblem, true);
  assert.equal(obj.typeName, 'ParameterProblem');
  roundtrip(paramProblemBuf);
});

test('ICMP Timestamp Request', async () => {
  const icmp = new ICMP(tsReqBuf);
  assert.equal(icmp.type, ICMPTypes.TimestampRequest);
  assert.equal(icmp.code, 0);
  assert.ok(icmp.isTimestampRequest);
  assert.equal(icmp.typeName, 'TimestampRequest');
  const obj = icmp.toObject();
  assert.equal(obj.isTimestampRequest, true);
  assert.equal(obj.typeName, 'TimestampRequest');
  roundtrip(tsReqBuf);
});

test('ICMP Timestamp Reply', async () => {
  const icmp = new ICMP(tsRepBuf);
  assert.equal(icmp.type, ICMPTypes.TimestampReply);
  assert.equal(icmp.code, 0);
  assert.ok(icmp.isTimestampReply);
  assert.equal(icmp.typeName, 'TimestampReply');
  const obj = icmp.toObject();
  assert.equal(obj.isTimestampReply, true);
  assert.equal(obj.typeName, 'TimestampReply');
  roundtrip(tsRepBuf);
});
