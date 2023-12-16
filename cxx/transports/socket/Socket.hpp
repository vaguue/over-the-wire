#include <iostream>
#include "common.hpp"
#include "stdlib.h"

namespace OverTheWire::Transports::Socket {
  void init(Napi::Env env, Napi::Object exports);

  struct SendWorker : public Napi::AsyncWorker {
    SendWorker(device_ptr_t, Napi::Function&, js_buffer_t);
    ~SendWorker();
    void Execute() override;
    void OnOK() override;

    device_ptr_t dev;
    Napi::Function& callback;
    uint8_t* buf;
    int size;
  };

  struct Stream : public Napi::ObjectWrap<Stream> {
    static Napi::Object Init(Napi::Env, Napi::Object);
    Stream(const Napi::CallbackInfo& info);
    ~Stream();

    Napi::Value _write(const Napi::CallbackInfo&);

    device_ptr_t dev;
    Napi::ThreadSafeFunction push;
    bool capture;
    bool parse;
  };
}
