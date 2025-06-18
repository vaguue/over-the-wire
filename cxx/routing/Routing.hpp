#pragma once

#include "common.hpp"
#include <uv.h>

/* 
 * Get ARP table for an interface
*/

namespace OverTheWire::Routing {
  struct RoutingRecord {
    std::string destination;
    uint32_t prefixLength;
    uint32_t metric = 0;
    std::string gateway;
    std::vector<std::string> flags;
  };

  using routing_table_t = std::map<std::string, std::vector<RoutingRecord>>;

  Napi::Object Init(Napi::Env env, Napi::Object exports);

  struct RoutingWorker : public Napi::AsyncWorker {
    RoutingWorker(Napi::Function&);
    ~RoutingWorker();
    void Execute() override;
    void OnOK() override;

    Napi::Function& callback;
    routing_table_t res;
  };

  std::pair<std::string, routing_table_t> fromSys();

  Napi::Value getRoutingTable(const Napi::CallbackInfo& info);
}
