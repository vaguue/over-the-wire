#include "Pcap.hpp"

namespace OverTheWire::Transports::Pcap {

Napi::Object init(Napi::Env env, Napi::Object exports) {
  PcapDevice::Init(env, exports);
  return exports;
}

SendWorker::SendWorker(device_ptr_t dev, Napi::Function& callback, packets_t&& packets) :
  AsyncWorker{callback}, dev{dev}, callback{callback}, packets{packets} {}

SendWorker::~SendWorker() {}

void SendWorker::Execute() {
  DEBUG_OUTPUT("SendWorker::Execute");
  auto res = dev->sendPackets(packets.data(), packets.size());
  if (!res) {
    SetError("Error sending packet");
  }
}

Napi::Object PcapDevice::Init(Napi::Env env, Napi::Object exports) {
  Napi::Function func = DefineClass(env, "PcapDevice", {
    InstanceMethod<&PcapDevice::_write>("_write", static_cast<napi_property_attributes>(napi_writable | napi_configurable)),
    InstanceMethod<&PcapDevice::setFilter>("setFilter", static_cast<napi_property_attributes>(napi_writable | napi_configurable)),
    InstanceMethod<&PcapDevice::setConfig>("setConfig", static_cast<napi_property_attributes>(napi_writable | napi_configurable)),
    InstanceMethod<&PcapDevice::open>("open", static_cast<napi_property_attributes>(napi_writable | napi_configurable)),
    InstanceMethod<&PcapDevice::startCapture>("startCapture", static_cast<napi_property_attributes>(napi_writable | napi_configurable)),
    InstanceMethod<&PcapDevice::stopCapture>("stopCapture", static_cast<napi_property_attributes>(napi_writable | napi_configurable)),
    InstanceMethod<&PcapDevice::_destroy>("_destroy", static_cast<napi_property_attributes>(napi_writable | napi_configurable)),
    InstanceAccessor<&PcapDevice::devStats>("devStats"),
    InstanceAccessor<&PcapDevice::stats>("stats"),
  });

  env.GetInstanceData<AddonData>()->SetClass(typeid(PcapDevice), func);
  exports.Set("PcapDevice", func);
  return exports;
}

void CallJs(Napi::Env env, Napi::Function jsCallback, Context* context, pcpp::RawPacket* packet) {
  DEBUG_OUTPUT((std::stringstream{} << "CallJs: " << (void*)packet->getRawData() << packet->getRawDataLen()).str().c_str());
  if (env != nullptr && jsCallback != nullptr) {
    jsCallback.Call({ js_buffer_t::Copy(env, packet->getRawData(), packet->getRawDataLen()) });
  }
}

void onPacketArrivesRaw(pcpp::RawPacket* packet, pcpp::PcapLiveDevice* dev, void* cookie) {
  DEBUG_OUTPUT("onPacketArrivesRaw");
  auto* push = reinterpret_cast<TSFN*>(cookie);
  push->BlockingCall(packet);
}

PcapDevice::PcapDevice(const Napi::CallbackInfo& info) : Napi::ObjectWrap<PcapDevice>{info} {
  setConfig(info);
  Napi::Object obj = info[0].As<Napi::Object>();

  if (obj.Has("iface")) {
    dev = device_ptr_t{pcpp::PcapLiveDeviceList::getInstance().getPcapLiveDeviceByName(obj.Get("iface").As<Napi::String>().Utf8Value())->clone()};
    if (!dev.get()) {
      Napi::Error::New(info.Env(), "Could not get device").ThrowAsJavaScriptException();
      return;
    }
  }
  else {
    Napi::Error::New(info.Env(), "Interface name is required").ThrowAsJavaScriptException();
    return;
  }

  push = TSFN::New(
    info.Env(),
    obj.Get("push").As<Napi::Function>(),
    "push",
    0,
    1,
    nullptr,
    [](Napi::Env, FinalizerDataType*, Context*) {
      DEBUG_OUTPUT("TSFN destructor");
    }
  );
}

Napi::Value PcapDevice::open(const Napi::CallbackInfo& info) {
  DEBUG_OUTPUT("open");
  if (!dev->open(config)) {
    Napi::Error::New(info.Env(), "Could not open device").ThrowAsJavaScriptException();
  }

  return info.Env().Undefined();
}

Napi::Value PcapDevice::startCapture(const Napi::CallbackInfo& info) {
  DEBUG_OUTPUT("startCapture");
  dev->startCapture(onPacketArrivesRaw, &push);
  return info.Env().Undefined();
}

Napi::Value PcapDevice::stopCapture(const Napi::CallbackInfo& info) {
  DEBUG_OUTPUT("stopCapture");
  dev->stopCapture();
  return info.Env().Undefined();
}

Napi::Value PcapDevice::setConfig(const Napi::CallbackInfo& info) {
  DEBUG_OUTPUT("setConfig");
  checkLength(info, 1);
  Napi::Object obj = info[0].As<Napi::Object>();
  Napi::Env env = info.Env();
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
      return info.Env().Undefined();
    }
  }
  else {
    obj.Set("mode", Napi::String::New(env, config.mode == pcpp::PcapLiveDevice::DeviceMode::Normal ? "normal" : "promiscuous"));
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
      return info.Env().Undefined();
    }
  }
  else {
    obj.Set("direction", Napi::String::New(env, 
      config.direction == pcpp::PcapLiveDevice::PcapDirection::PCPP_INOUT ? "inout" : 
      config.direction == pcpp::PcapLiveDevice::PcapDirection::PCPP_IN ? "in" :
      "out")
    );
  }

  if (obj.Has("packetBufferTimeoutMs")) {
    config.packetBufferTimeoutMs = obj.Get("packetBufferTimeoutMs").As<Napi::Number>().Int32Value();
  }
  else {
    obj.Set("packetBufferTimeoutMs", Napi::Number::New(env, config.packetBufferTimeoutMs));
  }

  if (obj.Has("packetBufferSize")) {
    config.packetBufferSize = obj.Get("packetBufferSize").As<Napi::Number>().Int32Value();
  }
  else {
    obj.Set("packetBufferSize", Napi::Number::New(env, config.packetBufferSize));
  }

  if (obj.Has("snapshotLength")) {
    config.snapshotLength = obj.Get("snapshotLength").As<Napi::Number>().Int32Value();
  }
  else {
    obj.Set("snapshotLength", Napi::Number::New(env, config.snapshotLength));
  }

  if (obj.Has("nflogGroup")) {
    config.nflogGroup = obj.Get("nflogGroup").As<Napi::Number>().Uint32Value();
  }
  else {
    obj.Set("nflogGroup", Napi::Number::New(env, config.nflogGroup));
  }

  return info.Env().Undefined();
}

void PcapDevice::_destroy_impl() {
  if (dev && dev.get()) {
    if (dev->captureActive()) {
      dev->stopCapture();
    }
    dev->close();
  }
}

Napi::Value PcapDevice::_destroy(const Napi::CallbackInfo& info) {
  _destroy_impl();
  return info.Env().Undefined();
}

PcapDevice::~PcapDevice() {
  DEBUG_OUTPUT("~PcapDevice");
  _destroy_impl();
  push.Release();
}

pcpp::RawPacket bufToPacket(Napi::Value&& input, timeval& tv, pcpp::LinkLayerType linkType) {
  int size;
  uint8_t* buf;
  std::tie(buf, size) = toCxx(input);
  return pcpp::RawPacket{ buf, size, tv, true, linkType };
}

timeval getTime() {
  struct timeval tv;
  gettimeofday(&tv, NULL);
  return tv;
}

Napi::Value PcapDevice::_write(const Napi::CallbackInfo& info) {
  DEBUG_OUTPUT("_write");
  checkLength(info, 2);
  packets_t packets;

  auto tv = getTime();
  auto linkType = dev->getLinkType();

  if (info[0].IsArray()) {
    Napi::Array ar = info[0].As<Napi::Array>();
    size_t n = ar.Length();
    packets.resize(n);
    for (size_t i{}; i < n; ++i) {
      packets[i] = bufToPacket(ar.Get(i), tv, linkType);
    }
  }
  else {
    packets.push_back(bufToPacket(info[0].As<Napi::Value>(), tv, linkType));
  }
  Napi::Function callback = info[1].As<Napi::Function>();
  SendWorker* w = new SendWorker(dev, callback, std::move(packets));
  w->Queue();
  return info.Env().Undefined();
}

Napi::Value PcapDevice::devStats(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if (!dev || !dev.get()) {
    Napi::Error::New(env, "No device").ThrowAsJavaScriptException();
    return info.Env().Undefined();
  }
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

Napi::Value PcapDevice::stats(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if (!dev || !dev.get()) {
    Napi::Error::New(env, "No device").ThrowAsJavaScriptException();
    return info.Env().Undefined();
  }
  pcpp::IPcapDevice::PcapStats stats;
  dev->getStatistics(stats);

  Napi::Object res = Napi::Object::New(env);
  res.Set("packetsDrop", Napi::Number::New(env, stats.packetsDrop));
  res.Set("packetsDropByInterface", Napi::Number::New(env, stats.packetsDropByInterface));
  res.Set("packetsRecv", Napi::Number::New(env, stats.packetsRecv));

  return res;
}

Napi::Value PcapDevice::setFilter(const Napi::CallbackInfo& info) {
  DEBUG_OUTPUT("setFilter");
  checkLength(info, 1);
  if (dev && dev.get()) {
    if (!dev->setFilter(info[0].As<Napi::String>().Utf8Value())) {
      Napi::Error::New(info.Env(), "Could not set filter").ThrowAsJavaScriptException();
    }
  }
  else {
    Napi::Error::New(info.Env(), "Could not set filter (no device)").ThrowAsJavaScriptException();
  }
  return info.Env().Undefined();
}

}
