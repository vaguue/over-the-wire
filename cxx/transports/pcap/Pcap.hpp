#pragma once

#include <iostream>
#include "common.hpp"
#include "stdlib.h"
#include "PcapLiveDeviceList.h"
#include "IpUtils.h"
#include "SystemUtils.h"
#include "pcap.h"

/* PcapLiveDevice bindings that are specifically designed for 
 * the Duplex stream wrapper. Btw, the only way to send L2 packets
 * on all platforms. Nice. Here we don't utilize the .pcap parsing
 * functions, because they are not stream-friendly for Node.
 * Streams are cool.
 */

namespace OverTheWire::Transports::Pcap {
  using device_t = pcpp::PcapLiveDevice;
  using device_ptr_t = std::shared_ptr<device_t>;
  using Context = std::nullptr_t;
  using DataType = pcpp::RawPacket;
  void CallJs(Napi::Env, Napi::Function, Context*, DataType*);
  using TSFN = Napi::TypedThreadSafeFunction<Context, DataType, CallJs>;
  using FinalizerDataType = void;
  using packets_t = std::vector<pcpp::RawPacket>;

  Napi::Object Init(Napi::Env env, Napi::Object exports);
  void onPacketArrivesRaw(pcpp::RawPacket*, pcpp::PcapLiveDevice*, void*);
  pcpp::RawPacket bufToPacket(js_buffer_t&&, timeval&);
  timeval getTime();

  struct SendWorker : public Napi::AsyncWorker {
    SendWorker(device_ptr_t, Napi::Function&, packets_t&&);
    ~SendWorker();
    void Execute() override;

    device_ptr_t dev;
    Napi::Function& callback;
    packets_t packets;
  };

  struct PcapDevice : public Napi::ObjectWrap<PcapDevice> {
    static Napi::Object Init(Napi::Env, Napi::Object);
    PcapDevice(const Napi::CallbackInfo& info);
    ~PcapDevice();
    Napi::Value _write(const Napi::CallbackInfo&);
    Napi::Value interfaceInfo(const Napi::CallbackInfo& info);
    Napi::Value stats(const Napi::CallbackInfo& info);
    Napi::Value setFilter(const Napi::CallbackInfo& info);
    Napi::Value setConfig(const Napi::CallbackInfo& info);
    Napi::Value open(const Napi::CallbackInfo& info);
    Napi::Value startCapture(const Napi::CallbackInfo& info);
    Napi::Value stopCapture(const Napi::CallbackInfo& info);
    Napi::Value _destroy(const Napi::CallbackInfo&);

    bool destroyed = false;
    void _destroy_impl();

    pcpp::PcapLiveDevice::DeviceConfiguration config;
    device_ptr_t dev;
    TSFN push;
  };
}
