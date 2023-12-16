#include "Socket.hpp"

namespace OverTheWire::Transports::Socket {

void init(Napi::Env env, Napi::Object exports) {
  Stream::Init(env, exports);
}

SendWorker::SendWorker(device_ptr_t dev, Napi::Function& callback, js_buffer_t inputBuf) :
  AsyncWorker{callback}, dev{dev}, callback{callback} {
  size = inputBuf.Length();
  if (size > 0) {
    buf = new uint8_t[size + 1];
    std::memcpy(buf, inputBuf.Data(), size);
    std::cout << "buf: " << (void*)buf << '-' << (void*)(buf + size) << std::endl;
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
    std::cout << "Sent packet" << std::endl;
  }
}

void SendWorker::OnOK() {
  Callback().Call({});
}

Napi::Object Stream::Init(Napi::Env env, Napi::Object exports) {
  Napi::Function func = DefineClass(env, "SocketDevice", {
    InstanceMethod<&Stream::_write>("_write", static_cast<napi_property_attributes>(napi_writable | napi_configurable)),
  });

  env.GetInstanceData<AddonData>()->SetClass(typeid(Stream), func);
  exports.Set("SocketDeviceStream", func);
  return exports;
}

void onPacketArrivesRaw(pcpp::RawPacket* packet, pcpp::SocketLiveDevice* dev, void* cookie) {
  auto* push = reinterpret_cast<Napi::ThreadSafeFunction*>(cookie);
  auto callback = [](Napi::Env env, Napi::Function jsCallback, pcpp::RawPacket* packet) {
    Napi::Object res = Napi::Object::New(env);
    jsCallback.Call({ js_buffer_t::Copy(env, const_cast<uint8_t*>(packet->getRawData()), packet->getRawDataLen()) });
  };

  push->BlockingCall(packet, callback);
}

Stream::Stream(const Napi::CallbackInfo& info) : Napi::ObjectWrap<Stream>{info} {
  checkLength(info, 1);
  Napi::Object obj = info[0].As<Napi::Object>();
  capture = obj.Has("capture") ? obj.Get("capture").As<Napi::Boolean>() : true;
  parse = obj.Has("parse") ? obj.Get("parse").As<Napi::Boolean>() : true;

  std::cout << "Args " << capture << ' ' << parse << std::endl;
  if (obj.Has("iface")) {
    std::cout << "Getting device " << obj.Get("iface").As<Napi::String>().Utf8Value() << std::endl;
    dev = device_ptr_t{pcpp::SocketLiveDeviceList::getInstance().getSocketLiveDeviceByName(obj.Get("iface").As<Napi::String>().Utf8Value())};
  }
  else {
    Napi::Error::New(info.Env(), "Interface name is required").ThrowAsJavaScriptException();
    return;
  }

  if (!dev.get()) {
    Napi::Error::New(info.Env(), "Could not build device").ThrowAsJavaScriptException();
    return;
  }

  if (!dev->open()) {
    Napi::Error::New(info.Env(), "Could not open device").ThrowAsJavaScriptException();
    return;
  }

  std::cout << "Device: " << dev << std::endl;
  std::cout << "Device name: " << dev->getName() << std::endl;

  if (capture) {
    push = Napi::ThreadSafeFunction::New(
      info.Env(),
      obj.Get("push").As<Napi::Function>(),
      "push",
      0,
      1,
      [this](Napi::Env) {
        if (dev.get() && dev->captureActive()) {
          dev->stopCapture();
        }
      }
    );

    if (parse) {
      //TODO
    }
    else {
      std::cout << "tsfn " << &push << std::endl;
      dev->startCapture(onPacketArrivesRaw, &push);
      std::cout << "started capture " << &push << std::endl;
    }
  }
}

Stream::~Stream() {
  if (dev->captureActive()) {
    dev->stopCapture();
  }
  dev->close();
}

Napi::Value Stream::_write(const Napi::CallbackInfo& info) {
  checkLength(info, 2);
  js_buffer_t buf = info[0].As<js_buffer_t>();
  std::cout << "checking buffer: " << info[0].IsBuffer() << std::endl;
  Napi::Function callback = info[1].As<Napi::Function>();
  SendWorker* w = new SendWorker(dev, callback, buf);
  w->Queue();
  return info.Env().Undefined();
}

}
