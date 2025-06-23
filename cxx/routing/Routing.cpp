#include "Routing.hpp"

namespace OverTheWire::Routing {

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set("getRoutingTable", Napi::Function::New(env, getRoutingTable));
  return exports;
}

RoutingWorker::RoutingWorker(Napi::Function& callback) : AsyncWorker{callback}, callback{callback} {}

RoutingWorker::~RoutingWorker() {}

void RoutingWorker::Execute() {
  DEBUG_OUTPUT("RoutingWorker::Execute");
  std::string err;
  std::tie(err, res) = fromSys();
  if (err.size() > 0) {
    SetError(err);
  }
}

void RoutingWorker::OnOK() {
  Napi::HandleScope scope(Env());

  Napi::Object obj = Napi::Object::New(Env());

  for (auto& [k, v] : res) {
    Napi::Array arr = Napi::Array::New(Env(), v.size());
    for (size_t i{}; i < v.size(); ++i) {
      Napi::Object rec = Napi::Object::New(Env());

      rec.Set("destination", Napi::String::New(Env(), v[i].destination));
      rec.Set("gateway", Napi::String::New(Env(), v[i].gateway));
      rec.Set("prefixLength", Napi::Number::New(Env(), v[i].prefixLength));
      rec.Set("family", Napi::String::New(Env(), v[i].family));

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

Napi::Value getRoutingTable(const Napi::CallbackInfo& info) {
  checkLength(info, 1);
  Napi::Function callback = info[0].As<Napi::Function>();
  RoutingWorker* w = new RoutingWorker(callback);
  w->Queue();
  return info.Env().Undefined();
}

}
