#include "Example.hpp"

namespace OverTheWire::Example {

Napi::Value someFunction(const Napi::CallbackInfo& info) {
  std::cout << "kek" << std::endl;
  return info.Env().Null();
}

void init(Napi::Env env, Napi::Object exports) {
  exports.Set("someFunction", Napi::Function::New(env, someFunction));
}

}
