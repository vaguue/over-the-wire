#include "Pcap.hpp"

namespace OverTheWire::Transports::Pcap {

void init(Napi::Env env, Napi::Object exports) {
  Stream::Init(env, exports);
}

SendWorker::SendWorker(device_ptr_t dev, Napi::Function& callback, js_buffer_t inputBuf) :
  AsyncWorker{callback}, dev{dev}, callback{callback} {
  size = inputBuf.Length();
  if (size > 0) {
    buf = new uint8_t[size + 1];
    std::memcpy(buf, inputBuf.Data(), size);
  }
}

SendWorker::~SendWorker() {}

void SendWorker::Execute() {
  if (size > 0) {
    auto res = dev->sendPacket(buf, size);
    if (!res) {
      SetError("Error sending packet");
    }
    delete buf;
  }
}

void SendWorker::OnOK() {
  Callback().Call({});
}

Napi::Object Stream::Init(Napi::Env env, Napi::Object exports) {
  Napi::Function func = DefineClass(env, "PcapDevice", {
    InstanceMethod<&Stream::_write>("_write", static_cast<napi_property_attributes>(napi_writable | napi_configurable)),
    InstanceAccessor<&Stream::stats>("stats"),
  });

  env.GetInstanceData<AddonData>()->SetClass(typeid(Stream), func);
  exports.Set("PcapDeviceStream", func);
  return exports;
}

void onPacketArrivesRaw(pcpp::RawPacket* packet, pcpp::PcapLiveDevice* dev, void* cookie) {
  auto* push = reinterpret_cast<Napi::ThreadSafeFunction*>(cookie);
  auto callback = [](Napi::Env env, Napi::Function jsCallback, pcpp::RawPacket* packet) {
    Napi::Object res = Napi::Object::New(env);
    jsCallback.Call({ js_buffer_t::Copy(env, packet->getRawData(), packet->getRawDataLen()) });
  };

  push->BlockingCall(packet, callback);
}

Stream::Stream(const Napi::CallbackInfo& info) : Napi::ObjectWrap<Stream>{info} {
  checkLength(info, 1);
  Napi::Object obj = info[0].As<Napi::Object>();
  capture = obj.Has("capture") ? obj.Get("capture").As<Napi::Boolean>() : true;
  parse = obj.Has("parse") ? obj.Get("parse").As<Napi::Boolean>() : true;

  pcpp::PcapLiveDevice::DeviceConfiguration config;
  if (obj.Has("mode")) {
    std::string mode = obj.Get("mode").As<Napi::String>().Utf8Value();
    if (mode == "promiscuous") {
      config.mode = pcpp::PcapLiveDevice::DeviceMode::Promiscuous;
    }
    else if (mode == "normal") {
      config.mode = pcpp::PcapLiveDevice::DeviceMode::Normal;
    }
    else {
      Napi::Error::New(info.Env(), "Unknown mode").ThrowAsJavaScriptException();
      return;
    }
  }
  if (obj.Has("direction")) {
    std::string direction = obj.Get("direction").As<Napi::String>().Utf8Value();
    if (direction == "inout") {
      config.direction = pcpp::PcapLiveDevice::PcapDirection::PCPP_INOUT;
    }
    else if (direction == "in") {
      config.direction = pcpp::PcapLiveDevice::PcapDirection::PCPP_IN;
    }
    else if (direction == "out") {
      config.direction = pcpp::PcapLiveDevice::PcapDirection::PCPP_OUT;
    }
    else {
      Napi::Error::New(info.Env(), "Unknown direction").ThrowAsJavaScriptException();
      return;
    }
  }

  if (obj.Has("packetBufferTimeoutMs")) {
    config.packetBufferTimeoutMs = obj.Get("packetBufferTimeoutMs").As<Napi::Number>().Int32Value();
  }
  if (obj.Has("packetBufferSize")) {
    config.packetBufferSize = obj.Get("packetBufferSize").As<Napi::Number>().Int32Value();
  }
  if (obj.Has("snapshotLength")) {
    config.snapshotLength = obj.Get("snapshotLength").As<Napi::Number>().Int32Value();
  }
  if (obj.Has("nflogGroup")) {
    config.nflogGroup = obj.Get("nflogGroup").As<Napi::Number>().Uint32Value();
  }

  if (obj.Has("iface")) {
    dev = device_ptr_t{pcpp::PcapLiveDeviceList::getInstance().getPcapLiveDeviceByName(obj.Get("iface").As<Napi::String>().Utf8Value()), nop<device_t*>};
    if (!dev.get()) {
      Napi::Error::New(info.Env(), "Could not get device").ThrowAsJavaScriptException();
      return;
    }
    if (!dev->open(config)) {
      Napi::Error::New(info.Env(), "Could not open device").ThrowAsJavaScriptException();
      return;
    }
  }
  else {
    Napi::Error::New(info.Env(), "Interface name is required").ThrowAsJavaScriptException();
    return;
  }

  if (capture) {
    push = Napi::ThreadSafeFunction::New(
      info.Env(),
      obj.Get("push").As<Napi::Function>(),
      "push",
      0,
      1,
      [this](Napi::Env env) {
#ifdef DEBUG
        std::cout << "TSFN destructor" << std::endl;
#endif
      }
    );

    dev->startCapture(onPacketArrivesRaw, &push);
  }
}

Stream::~Stream() {
  if (dev && dev.get()) {
    if (dev->captureActive()) {
      dev->stopCapture();
    }
    dev->close();
  }
}

Napi::Value Stream::_write(const Napi::CallbackInfo& info) {
  checkLength(info, 2);
  js_buffer_t buf = info[0].As<js_buffer_t>();
  Napi::Function callback = info[1].As<Napi::Function>();
  SendWorker* w = new SendWorker(dev, callback, buf);
  w->Queue();
  return info.Env().Undefined();
}

Napi::Value Stream::stats(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  Napi::Object res = Napi::Object::New(env);
  res.Set("name", Napi::String::New(env, dev->getName()));
  res.Set("description", Napi::String::New(env, dev->getDesc()));
  res.Set("mac", Napi::String::New(env, dev->getMacAddress().toString()));
  res.Set("gateway", Napi::String::New(env, dev->getDefaultGateway().toString()));
  res.Set("mtu", Napi::Number::New(env, dev->getMtu()));

  auto& dnsServers = dev->getDnsServers();
  Napi::Array dnsServersJs = Napi::Array::New(env, dnsServers.size());
  for (size_t i{}; i < dnsServers.size(); ++i) {
    dnsServersJs[i] = Napi::String::New(env, dnsServers[i].toString());
  }
  res.Set("dnsServers", dnsServersJs);

  auto& addresses = dev->getAddresses();
  Napi::Array addressesJs = Napi::Array::New(env, addresses.size());

  for(size_t i{}; i < addresses.size(); ++i) {
    Napi::Object res = Napi::Object::New(env);
    auto family = addresses[i].addr->sa_family;
    if (family == AF_INET) {
      res.Set("type", Napi::String::New(env, "IPv4"));
    }
    else if (family == AF_INET6) {
      res.Set("type", Napi::String::New(env, "IPv6"));
    }
    else {
      res.Set("type", Napi::String::New(env, "Unknown"));
    }
    char addrAsString[INET6_ADDRSTRLEN];
    pcpp::internal::sockaddr2string(addresses[i].addr, addrAsString);
    res.Set("value", Napi::String::New(env, addrAsString));
    addressesJs[i] = res;
  }

  res.Set("addresses", addressesJs);

  return res;
}

}
