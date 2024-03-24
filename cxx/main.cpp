#include "common.hpp" 

#include "example/Example.hpp"
#include "transports/pcap/Pcap.hpp"
#include "transports/socket/Socket.hpp"
#include "enums/Enums.hpp"
#include "bpf-filter/BpfFilter.hpp"
#include "checksums/Checksums.hpp"
#include "converters/Converters.hpp"
#include "arp/Arp.hpp"
#include "routing/Routing.hpp"

static Napi::Object Init(Napi::Env env, Napi::Object exports) {
  initAddon(env);
  OverTheWire::Example::Init(env, exports);
  OverTheWire::Transports::Pcap::Init(env, exports);
  OverTheWire::Enums::Init(env, exports);
  OverTheWire::BpfFilter::Init(env, exports);
  OverTheWire::Arp::Init(env, exports);
  OverTheWire::Routing::Init(env, exports);

  exports.Set("socket", OverTheWire::Transports::Socket::Init(env, Napi::Object::New(env)));
  exports.Set("converters", OverTheWire::Converters::Init(env, Napi::Object::New(env)));
  exports.Set("checksums", OverTheWire::Checksums::Init(env, Napi::Object::New(env)));

  return exports;
}

NODE_API_MODULE(OverTheWire, Init)
