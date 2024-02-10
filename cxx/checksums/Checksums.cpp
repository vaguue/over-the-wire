#include "Checksums.hpp"

namespace OverTheWire::Checksums {

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set("ip", Napi::Function::New(env, IPChecksum));
  exports.Set("pseudo", Napi::Function::New(env, PseudoHeaderChecksum));
  return exports;
}

pcpp::ScalarBuffer<uint16_t> convertBuf(const Napi::Value& val) {
  Napi::Buffer<uint16_t> buf = val.As<Napi::Buffer<uint16_t>>();
  return { buf.Data(), buf.Length() * 2 };
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

  return Napi::Number::New(info.Env(), computeChecksum(bufs.data(), bufs.size()));
}

Napi::Value PseudoHeaderChecksum(const Napi::CallbackInfo& info) {
  checkLength(info, 1);
  Napi::Object arg = info[0].As<Napi::Object>();
  uint8_t* data = arg.Get("data").As<js_buffer_t>().Data();
  size_t dataLen = arg.Get("data").As<js_buffer_t>().Length();
  pcpp::IPAddress::AddressType ipAddrType;
  std::string addrType = arg.Get("addrType").As<Napi::String>().Utf8Value();
  if (addrType == "IPv4") {
    ipAddrType = pcpp::IPAddress::IPv4AddressType;
  }
  else if (addrType == "IPv6") {
    ipAddrType = pcpp::IPAddress::IPv6AddressType;
  }
  else {
    Napi::Error::New(info.Env(), "Invalid address type").ThrowAsJavaScriptException();
    return info.Env().Undefined();
  }

  uint8_t protocolType = arg.Get("protocolType").As<Napi::Number>().Uint32Value() & 0xff;

  std::string src = arg.Get("src").As<Napi::String>().Utf8Value();
  std::string dst = arg.Get("dst").As<Napi::String>().Utf8Value();

  pcpp::IPAddress srcIP{src};
  pcpp::IPAddress dstIP{dst};

  return Napi::Number::New(info.Env(), computePseudoHdrChecksum(data, dataLen, ipAddrType, protocolType, srcIP, dstIP));
}

}
