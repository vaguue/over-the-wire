#include "common.hpp" 

#include "example/Example.hpp"
#include "transports/pcap/Pcap.hpp"
#include "transports/socket/Socket.hpp"
#include "enums/Enums.hpp"
#include "bpf-filter/BpfFilter.hpp"

static Napi::Object Init(Napi::Env env, Napi::Object exports) {
  initAddon(env);
  OverTheWire::Example::Init(env, exports);
  OverTheWire::Transports::Pcap::Init(env, exports);
  OverTheWire::Enums::Init(env, exports);
  OverTheWire::BpfFilter::Init(env, exports);

  Napi::Object socketExports = Napi::Object::New(env);
  exports.Set("socket", socketExports);
  OverTheWire::Transports::Socket::Init(env, socketExports);
  return exports;
}

NODE_API_MODULE(OverTheWire, Init)
