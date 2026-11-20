import { icmp, icmpv6, arp } from '#lib/protocols';

const ICMP_ERRORS = [icmp.DESTINATION_UNREACHABLE, icmp.TIME_EXCEEDED, icmp.PARAMETER_PROBLEM];

const sameAddress = (left, right) => {
  return String(left).toLowerCase() === String(right).toLowerCase();
};

const networkOf = (packet) => {
  return packet.layers.IPv4 ?? packet.layers.IPv6 ?? null;
};

const isAddressedToTheSender = (candidate, sent) => {
  const sentNetwork = networkOf(sent);
  const candidateNetwork = networkOf(candidate);

  return candidateNetwork !== null && candidateNetwork.name === sentNetwork.name && sameAddress(candidateNetwork.dst, sentNetwork.src);
};

const comesFromTheDestination = (candidate, sent) => {
  return isAddressedToTheSender(candidate, sent) && sameAddress(networkOf(candidate).src, networkOf(sent).dst);
};

const isAnErrorAboutIt = (candidate, sent) => {
  const report = candidate.layers.ICMP;
  return report !== undefined && ICMP_ERRORS.includes(report.type) && isAddressedToTheSender(candidate, sent);
};

const answersEcho = (EchoLayer, replyType) => {
  return (candidate, sent) => {
    const reply = candidate.layers[EchoLayer];

    if (reply === undefined || reply.type !== replyType || !comesFromTheDestination(candidate, sent)) {
      return isAnErrorAboutIt(candidate, sent);
    }

    const request = sent.layers[EchoLayer].toObject();
    const { id, sequence } = reply.toObject();

    return id === request.id && sequence === request.sequence;
  };
};

const answersTransport = (Transport) => {
  return (candidate, sent) => {
    const reply = candidate.layers[Transport];
    const request = sent.layers[Transport];

    if (reply === undefined) {
      return isAnErrorAboutIt(candidate, sent);
    }

    return comesFromTheDestination(candidate, sent) && reply.src === request.dst && reply.dst === request.src;
  };
};

const answersArp = (candidate, sent) => {
  const reply = candidate.layers.ARP;
  const request = sent.layers.ARP;

  return reply !== undefined && reply.opcode === arp.IS_AT && sameAddress(reply.protocolSrc, request.protocolDst);
};

const rules = [
  { applies: sent => sent.layers.ARP?.opcode === arp.WHO_HAS, answers: answersArp },
  { applies: sent => sent.layers.ICMP?.type === icmp.ECHO_REQUEST, answers: answersEcho('ICMP', icmp.ECHO_REPLY) },
  { applies: sent => sent.layers.ICMPv6?.type === icmpv6.ECHO_REQUEST, answers: answersEcho('ICMPv6', icmpv6.ECHO_REPLY) },
  { applies: sent => sent.layers.TCP !== undefined && networkOf(sent) !== null, answers: answersTransport('TCP') },
  { applies: sent => sent.layers.UDP !== undefined && networkOf(sent) !== null, answers: answersTransport('UDP') },
  { applies: sent => networkOf(sent) !== null, answers: (candidate, sent) => comesFromTheDestination(candidate, sent) || isAnErrorAboutIt(candidate, sent) },
];

const answerTo = (sent) => {
  const rule = rules.find(({ applies }) => applies(sent));

  if (rule === undefined) {
    return () => true;
  }

  return (candidate) => {
    return rule.answers(candidate, sent);
  };
};

export { answerTo };
export default { answerTo };
