#include <iostream>
#include "common.hpp"
#include "stdlib.h"
#include "PcapLiveDeviceList.h"
#include "IpUtils.h"
#include "pcap.h"

namespace OverTheWire::Transports::Pcap {
  using device_t = pcpp::PcapLiveDevice;
  using device_ptr_t = std::shared_ptr<device_t>;
  using js_buffer_t = Napi::Buffer<uint8_t>;
  void init(Napi::Env env, Napi::Object exports);

  void onPacketArrivesRaw(pcpp::RawPacket*, pcpp::PcapLiveDevice*, void*);

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
    Napi::Value stats(const Napi::CallbackInfo& info);

    device_ptr_t dev;
    Napi::ThreadSafeFunction push;
    bool capture;
    bool parse;
  };
}
