#include "Ports.h"

namespace OverTheWire::Ports {

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set("getOpenPorts", Napi::Function::New(env, getOpenPorts));
  return exports;
}

PortsWorker::PortsWorker(Napi::Function& callback) : AsyncWorker{callback}, callback{callback} {}

PortsWorker::~PortsWorker() {}

void PortsWorker::Execute() {
  DEBUG_OUTPUT("PortsWorker::Execute");
  std::string err;
  std::tie(err, res) = fromSys();
  if (err.size() > 0) {
    SetError(err);
  }
}

void PortsWorker::OnOK() {
  Napi::HandleScope scope(Env());

  Napi::Array arr = Napi::Array::New(Env(), res.size());

  for (size_t i{}; i < res.size(); ++i) {
    Napi::Object rec = Napi::Object::New(Env());

    rec.Set("protocol", Napi::String::New(Env(), res[i].protocol));
    rec.Set("family", Napi::String::New(Env(), res[i].family));
    rec.Set("address", Napi::String::New(Env(), res[i].address));
    rec.Set("port", Napi::Number::New(Env(), res[i].port));

    if (res[i].pid < 0) {
      rec.Set("pid", Env().Null());
      rec.Set("process", Env().Null());
    }
    else {
      rec.Set("pid", Napi::Number::New(Env(), static_cast<double>(res[i].pid)));
      rec.Set("process", Napi::String::New(Env(), res[i].process));
    }

    arr.Set(i, rec);
  }

  Callback().Call({ arr });
}

Napi::Value getOpenPorts(const Napi::CallbackInfo& info) {
  checkLength(info, 1);
  Napi::Function callback = info[0].As<Napi::Function>();
  PortsWorker* w = new PortsWorker(callback);
  w->Queue();
  return info.Env().Undefined();
}

}
