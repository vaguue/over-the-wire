#include "Checksums.hpp"

namespace OverTheWire::Checksums {

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set("ip", Napi::Function::New(env, IPChecksum));
  return exports;
}

Napi::Value IPChecksum(const Napi::CallbackInfo& info) {
  checkLength(info, 1);
  Napi::Buffer<uint16_t> buf = info[0].As<Napi::Buffer<uint16_t>>();
  pcpp::ScalarBuffer<uint16_t> scalarBuf = { buf.Data(), buf.Length() };
  return Napi::Number::New(info.Env(), ntohs(computeChecksum(&scalarBuf, 1)));
}

}
