#include "Checksums.hpp"

namespace OverTheWire::Checksums {

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set("ip", Napi::Function::New(env, IPChecksum));
  return exports;
}

pcpp::ScalarBuffer<uint16_t> convertBuf(const Napi::Value& val) {
  Napi::Buffer<uint16_t> buf = val.As<Napi::Buffer<uint16_t>>();
  return { buf.Data(), buf.Length() };
}

Napi::Value IPChecksum(const Napi::CallbackInfo& info) {
  checkLength(info, 1);

  std::vector<pcpp::ScalarBuffer<uint16_t>> bufs;

  if (info[0].IsArray()) {
    Napi::Array ar = info[0].As<Napi::Array>();
    for (size_t i{}; i < ar.Length(); ++i) {
      bufs.push_back(convertBuf(ar[i]));
    }
  }
  else {
    bufs.push_back(convertBuf(info[0]));
  }

  return Napi::Number::New(info.Env(), ntohs(computeChecksum(bufs.data(), bufs.size())));
}

}
