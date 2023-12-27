#include "Enums.hpp"

namespace OverTheWire::Transports::Socket::Enums {

#define ENUM_VALUE(x) exports.Set(#x, Napi::Number::New(env, x))

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  ENUM_VALUE(SOCK_STREAM);
  ENUM_VALUE(SOCK_DGRAM);
  ENUM_VALUE(SOCK_RAW);
  ENUM_VALUE(SOCK_RDM);
  ENUM_VALUE(SOCK_SEQPACKET);
#if defined(__linux__) || defined(__FreeBSD__)
  ENUM_VALUE(SOCK_PACKET);
  ENUM_VALUE(AF_AX25);
  ENUM_VALUE(AF_NETROM);
  ENUM_VALUE(AF_BRIDGE);
  ENUM_VALUE(AF_AAL5);
  ENUM_VALUE(AF_X25);
#endif
  ENUM_VALUE(AF_UNSPEC);
  ENUM_VALUE(AF_UNIX);
  ENUM_VALUE(AF_INET);
  ENUM_VALUE(AF_IPX);
  ENUM_VALUE(AF_APPLETALK);
  ENUM_VALUE(AF_INET6);
  ENUM_VALUE(AF_MAX);
  return exports;
}

#undef ENUM_VALUE

};
