#pragma once

#include "common.h"
#include <uv.h>

namespace OverTheWire::Ports {
  struct OpenPort {
    std::string protocol;
    std::string family;
    std::string address;
    uint32_t port = 0;
    int64_t pid = -1;
    std::string process;
  };

  using open_ports_t = std::vector<OpenPort>;

  Napi::Object Init(Napi::Env env, Napi::Object exports);

  struct PortsWorker : public Napi::AsyncWorker {
    PortsWorker(Napi::Function&);
    ~PortsWorker();
    void Execute() override;
    void OnOK() override;

    Napi::Function& callback;
    open_ports_t res;
  };

  std::pair<std::string, open_ports_t> fromSys();

  Napi::Value getOpenPorts(const Napi::CallbackInfo& info);
}
