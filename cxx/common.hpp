#pragma once

#include <napi.h>
#include <string>
#include <vector>
#include <stdint.h>
#include <typeindex>
#include <utility>
#include <iostream>
#include <map>
#include <sstream>

/* For me, utils or helpers are anti-patterns, 
 * hence I names this file common.hpp.
 * But actually this file has some commonly used C++ headers
 * and JS <=> C++ specific functions.
 */

#define DEBUG

#ifdef DEBUG
#define DEBUG_OUTPUT(x) std::cout << "[over-the-wire::cxx] " << (x) << std::endl;
#else
#define DEBUG_OUTPUT
#endif

using promise_t = std::shared_ptr<Napi::Promise::Deferred>;

struct AddonData {
  std::map<std::type_index, Napi::FunctionReference> constructors;

  std::vector<Napi::Reference<Napi::Value>> refs;

  void refToInstance(Napi::Env env, Napi::Value v) {
    refs.push_back(Napi::Reference<Napi::Value>::New(v, 1));
  };

  Napi::FunctionReference& GetClass(const std::type_index& tid) {
    return constructors[tid];
  }

  void SetClass(const std::type_index& tid, Napi::Function func) {
    constructors[tid] = std::forward<Napi::FunctionReference>(Napi::Persistent(func));
  }

  bool HasClass(const std::type_index& tid) {
    return constructors.count(tid) > 0;
  }
};

inline std::string demangle(const char* name) {
#if defined(__unix__)
  int status;
  char* demangled_name = abi::__cxa_demangle(name, 0, 0, &status);
  if (status == 0) {
    std::string realname = demangled_name;
    free(demangled_name);
    return realname;
  } else {
    return name;
  }
#else
    return name;
#endif
};

template<typename T, bool skip = false>
void deleter(Napi::Env env, T p) {
#ifdef DEBUG
  std::cout << "[over-the-wire::cxx] Deleting " << demangle(typeid(T).name());
#endif
  if constexpr (skip) {
#ifdef DEBUG
    std::cout << " (Skipping)" << std::endl;
#endif
  }
  else {
#ifdef DEBUG
    std::cout << std::endl;
#endif
    delete p;
  }
}

inline void initAddon(Napi::Env env) {
  static thread_local bool was = false;
  if (!was) {
    env.SetInstanceData<AddonData, deleter<AddonData*, false>>(new AddonData());
    was = true;
  }
}

inline void checkLength(const Napi::CallbackInfo& info, size_t n) {
  if (info.Length() < n) {
    Napi::Error::New(info.Env(), "Not enough arguments").ThrowAsJavaScriptException();
  }
}

template<typename... T>
void nop(T...) {}

template<typename CppCls>
struct JsParent {};

template<typename ClsId>
void extendJsClass(Napi::Env env, Napi::Function& cls, const char* moduleName, const char* clsName) {
  Napi::Function require = env.Global()
                          .Get("require").As<Napi::Function>();
  Napi::Function jsCls = require.Call({Napi::String::New(env, moduleName)})
                          .ToObject()
                          .Get(clsName)
                          .As<Napi::Function>();

  Napi::Function setProto = env.Global()
                                .Get("Object")
                                .ToObject()
                                .Get("setPrototypeOf")
                                .As<Napi::Function>();

  setProto.Call({cls, jsCls});
  setProto.Call({cls.Get("prototype"), jsCls.Get("prototype")});

  env.GetInstanceData<AddonData>()->SetClass(typeid(ClsId), jsCls);
}

using js_buffer_t = Napi::Buffer<uint8_t>;

std::pair<uint8_t*, size_t> toCxx(const Napi::Value&&);
std::pair<uint8_t*, size_t> toCxx(const Napi::Value&);
