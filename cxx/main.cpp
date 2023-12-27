#include "common.hpp" 

#include "example/Example.hpp"
#include "transports/pcap/Pcap.hpp"
#include "transports/socket/Socket.hpp"

static Napi::Object Init(Napi::Env env, Napi::Object exports) {
  initAddon(env);
  OverTheWire::Example::init(env, exports);
  OverTheWire::Transports::Pcap::init(env, exports);

  Napi::Object socketExports = Napi::Object::New(env);
  exports.Set("socket", socketExports);
  OverTheWire::Transports::Socket::init(env, socketExports);
  return exports;
}

NODE_API_MODULE(OverTheWire, Init)
