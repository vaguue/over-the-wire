#include "common.hpp" 

#include "example/Example.hpp"

static Napi::Object Init(Napi::Env env, Napi::Object exports) {
  OverTheWire::Example::init(env, exports);
  return exports;
}

NODE_API_MODULE(da, Init)
