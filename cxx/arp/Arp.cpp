#include "Arp.hpp"

namespace OverTheWire::Arp {

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set("getArpTable", Napi::Function::New(env, getArpTable));
  return exports;
}

ArpWorker::ArpWorker(Napi::Function& callback) : AsyncWorker{callback}, callback{callback} {}

ArpWorker::~ArpWorker() {}

void ArpWorker::Execute() {
  DEBUG_OUTPUT("ArpWorker::Execute");
  std::string err;
  std::tie(err, res) = fromSys();
  if (err.size() > 0) {
    SetError(err);
  }
}

void ArpWorker::OnOK() {
  Napi::HandleScope scope(Env());

  Napi::Object obj = Napi::Object::New(Env());

  for (auto& [k, v] : res) {
    Napi::Array arr = Napi::Array::New(Env(), v.size());
    for (size_t i{}; i < v.size(); ++i) {
      Napi::Object rec = Napi::Object::New(Env());

      rec.Set("ipAddr", Napi::String::New(Env(), v[i].ipAddr));
      rec.Set("hwAddr", Napi::String::New(Env(), v[i].hwAddr));
      rec.Set("hwType", Napi::Number::New(Env(), v[i].hwType));

      auto flags = Napi::Array::New(Env(), v[i].flags.size());
      rec.Set("flags", flags);
      for (size_t j{}; j < v[i].flags.size(); ++j) {
        flags.Set(j, Napi::String::New(Env(), v[i].flags[j]));
      }

      arr.Set(i, rec);
    }

    obj.Set(k, arr);
  }

  Callback().Call({ obj });
}

Napi::Value getArpTable(const Napi::CallbackInfo& info) {
  checkLength(info, 1);
  Napi::Function callback = info[0].As<Napi::Function>();
  ArpWorker* w = new ArpWorker(callback);
  w->Queue();
  return info.Env().Undefined();
}

}
