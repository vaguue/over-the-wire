const { strict: assert } = require('node:assert');
const test = require('node:test');

const { ICMPv6 } = require('#lib/layers/ICMPv6');
const { ICMPv6Types } = require('#lib/layers/enums');

const echoReqBuf = Buffer.from('80007cda1a2b00010001000000000000', 'hex');
const echoRepBuf = Buffer.from('81007cda1a2b00010001000000000000', 'hex');
const destUnreachBuf = Buffer.from('01017cda0000000000000000', 'hex');
const timeExceededBuf = Buffer.from('03007cda00000000', 'hex');
const paramProblemBuf = Buffer.from('04007cda04000000', 'hex');

function roundtrip(buf, Cls = ICMPv6) {
  const parsed = new Cls(buf);
  const obj = parsed.toObject();
  const reparsed = new Cls(obj);
  if (Buffer.compare(parsed.buffer.slice(0, reparsed.buffer.length), reparsed.buffer)) {
    console.log('roundtrip', obj, parsed.buffer.slice(0, reparsed.buffer.length), reparsed.buffer, reparsed.toObject());
  }
  assert.equal(Buffer.compare(parsed.buffer.slice(0, reparsed.buffer.length), reparsed.buffer), 0, 'buffer -> parse -> object -> buffer roundtrip');
  assert.deepEqual(reparsed.toObject(), obj, 'object roundtrip');
}

test('ICMPv6 Echo Request', async () => {
  const icmp = new ICMPv6(echoReqBuf);
  assert.equal(icmp.type, ICMPv6Types.EchoRequest);
  assert.equal(icmp.code, 0);
  assert.ok(icmp.isEchoRequest);
  assert.equal(icmp.typeName, 'EchoRequest');
  const obj = icmp.toObject();
  assert.equal(obj.isEchoRequest, true);
  assert.equal(obj.typeName, 'EchoRequest');
  roundtrip(echoReqBuf);
});

test('ICMPv6 Echo Reply', async () => {
  const icmp = new ICMPv6(echoRepBuf);
  assert.equal(icmp.type, ICMPv6Types.EchoReply);
  assert.equal(icmp.code, 0);
  assert.ok(icmp.isEchoReply);
  assert.equal(icmp.typeName, 'EchoReply');
  const obj = icmp.toObject();
  assert.equal(obj.isEchoReply, true);
  assert.equal(obj.typeName, 'EchoReply');
  roundtrip(echoRepBuf);
});

test('ICMPv6 Destination Unreachable', async () => {
  const icmp = new ICMPv6(destUnreachBuf);
  assert.equal(icmp.type, ICMPv6Types.DestinationUnreachable);
  assert.equal(icmp.code, 1);
  assert.ok(icmp.isDestinationUnreachable);
  assert.equal(icmp.typeName, 'DestinationUnreachable');
  const obj = icmp.toObject();
  assert.equal(obj.isDestinationUnreachable, true);
  assert.equal(obj.typeName, 'DestinationUnreachable');
  roundtrip(destUnreachBuf);
});

test('ICMPv6 Time Exceeded', async () => {
  const icmp = new ICMPv6(timeExceededBuf);
  assert.equal(icmp.type, ICMPv6Types.TimeExceeded);
  assert.equal(icmp.code, 0);
  assert.ok(icmp.isTimeExceeded);
  assert.equal(icmp.typeName, 'TimeExceeded');
  const obj = icmp.toObject();
  assert.equal(obj.isTimeExceeded, true);
  assert.equal(obj.typeName, 'TimeExceeded');
  roundtrip(timeExceededBuf);
});

test('ICMPv6 Parameter Problem', async () => {
  const icmp = new ICMPv6(paramProblemBuf);
  assert.equal(icmp.type, ICMPv6Types.ParameterProblem);
  assert.equal(icmp.code, 0);
  assert.ok(icmp.isParameterProblem);
  assert.equal(icmp.typeName, 'ParameterProblem');
  const obj = icmp.toObject();
  assert.equal(obj.isParameterProblem, true);
  assert.equal(obj.typeName, 'ParameterProblem');
  roundtrip(paramProblemBuf);
}); 