#pragma once
#include <napi.h>
#include <string>
#include <vector>
#include <stdint.h>
#include <typeindex>
#include <utility>
#include <iostream>
#include <map>

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
  std::cout << "[*] Deleting: " << demangle(typeid(T).name());
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
