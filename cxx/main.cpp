#include "common.hpp" 

#include "example/Example.hpp"
#include "transports/pcap/Pcap.hpp"

static Napi::Object Init(Napi::Env env, Napi::Object exports) {
  initAddon(env);
  OverTheWire::Example::init(env, exports);
  OverTheWire::Transports::Pcap::init(env, exports);
  return exports;
}

NODE_API_MODULE(OverTheWire, Init)
