#include "Example.hpp"

namespace OverTheWire::Example {

Napi::Value da(const Napi::CallbackInfo& info) {
  std::cout << "da" << std::endl;
  return info.Env().Undefined();
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set("da", Napi::Function::New(env, da));

  return exports;
}

}
