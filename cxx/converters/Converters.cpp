#include "Converters.hpp"

namespace OverTheWire::Converters {

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set("inetPton", Napi::Function::New<inetPton>(env, "inetPton"));
  exports.Set("inetNtop", Napi::Function::New<inetNtop>(env, "inetNtop"));

  exports.Set("htonl", Napi::Function::New<jsHtonl>(env, "htonl"));
  exports.Set("ntohl", Napi::Function::New<jsNtohl>(env, "ntohl"));
  exports.Set("htons", Napi::Function::New<jsHtons>(env, "htons"));
  exports.Set("ntohs", Napi::Function::New<jsNtohs>(env, "ntohs"));

  return exports;
}

Napi::Value inetPton(const Napi::CallbackInfo& info) {
  checkLength(info, 2);
  Napi::Env env = info.Env();
  int domain = info[0].As<Napi::Number>().Uint32Value();
  std::string src = info[1].As<Napi::String>().Utf8Value();
  js_buffer_t res = js_buffer_t::New(env, domain == AF_INET6 ? sizeof(in6_addr) : sizeof(in_addr));

  int s = uv_inet_pton(domain, src.c_str(), res.Data());

  if (s != 0) {
    Napi::Error::New(env, getLibuvError(s)).ThrowAsJavaScriptException();
    return env.Undefined();
  }

  return res;
}

Napi::Value inetNtop(const Napi::CallbackInfo& info) {
  checkLength(info, 2);
  Napi::Env env = info.Env();
  char str[INET6_ADDRSTRLEN];
  int domain = info[0].As<Napi::Number>().Uint32Value();
  int s;

  if (info[1].IsBuffer()) {
    js_buffer_t buf = info[1].As<js_buffer_t>();
    s = uv_inet_ntop(domain, buf.Data(), str, INET6_ADDRSTRLEN);
  }
  else if (info[1].IsNumber()) {
    uint32_t val = info[1].As<Napi::Number>().Uint32Value();
    s = uv_inet_ntop(domain, &val, str, INET6_ADDRSTRLEN);
  }

  if (s != 0) {
    Napi::Error::New(env, getLibuvError(s)).ThrowAsJavaScriptException();
    return env.Undefined();
  }

  return Napi::String::New(env, str);
}

Napi::Value jsHtonl(const Napi::CallbackInfo& info) {
  checkLength(info, 1);
  return Napi::Number::New(info.Env(), htonl(info[0].As<Napi::Number>().Uint32Value()));
}

Napi::Value jsNtohl(const Napi::CallbackInfo& info) {
  checkLength(info, 1);
  return Napi::Number::New(info.Env(), ntohl(info[0].As<Napi::Number>().Uint32Value()));
}

Napi::Value jsHtons(const Napi::CallbackInfo& info) {
  checkLength(info, 1);
  return Napi::Number::New(info.Env(), htons(info[0].As<Napi::Number>().Uint32Value()));
}

Napi::Value jsNtohs(const Napi::CallbackInfo& info) {
  checkLength(info, 1);
  return Napi::Number::New(info.Env(), ntohs(info[0].As<Napi::Number>().Uint32Value()));
}

}
