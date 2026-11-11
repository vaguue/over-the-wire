#include "common.h" 

#include "example/Example.h"
#include "transports/pcap/PcapDevice.h"
#include "transports/socket/Socket.h"
#include "enums/Enums.h"
#include "bpf-filter/BpfFilter.h"
#include "checksums/Checksums.h"
#include "converters/Converters.h"
#include "arp/Arp.h"
#include "routing/Routing.h"

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
