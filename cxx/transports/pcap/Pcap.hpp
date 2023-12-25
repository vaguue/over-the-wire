#include <iostream>
#include "common.hpp"
#include "stdlib.h"
#include "PcapLiveDeviceList.h"
#include "IpUtils.h"
#include "SystemUtils.h"
#include "pcap.h"

namespace OverTheWire::Transports::Pcap {
  using device_t = pcpp::PcapLiveDevice;
  using device_ptr_t = std::shared_ptr<device_t>;
  using Context = std::nullptr_t;
  using DataType = pcpp::RawPacket;
  void CallJs(Napi::Env, Napi::Function, Context*, DataType*);
  using TSFN = Napi::TypedThreadSafeFunction<Context, DataType, CallJs>;
  using FinalizerDataType = void;

  Napi::Object init(Napi::Env env, Napi::Object exports);
  void onPacketArrivesRaw(pcpp::RawPacket*, pcpp::PcapLiveDevice*, void*);
  pcpp::RawPacket bufToPacket(js_buffer_t&&, timeval&);
  timeval getTime();

  struct SendWorker : public Napi::AsyncWorker {
    SendWorker(device_ptr_t, Napi::Function&, std::vector<pcpp::RawPacket>&&);
    ~SendWorker();
    void Execute() override;

    device_ptr_t dev;
    Napi::Function& callback;
    std::vector<pcpp::RawPacket> packets;
  };

  struct Stream : public Napi::ObjectWrap<Stream> {
    static Napi::Object Init(Napi::Env, Napi::Object);
    Stream(const Napi::CallbackInfo& info);
    ~Stream();
    Napi::Value _write(const Napi::CallbackInfo&);
    Napi::Value devStats(const Napi::CallbackInfo& info);
    Napi::Value stats(const Napi::CallbackInfo& info);
    Napi::Value setFilter(const Napi::CallbackInfo& info);
    Napi::Value setConfig(const Napi::CallbackInfo& info);
    Napi::Value open(const Napi::CallbackInfo& info);
    Napi::Value startCapture(const Napi::CallbackInfo& info);
    Napi::Value stopCapture(const Napi::CallbackInfo& info);
    Napi::Value _destroy(const Napi::CallbackInfo&);

    void _destroy_impl();

    pcpp::PcapLiveDevice::DeviceConfiguration config;
    device_ptr_t dev;
    TSFN push;
  };
}
