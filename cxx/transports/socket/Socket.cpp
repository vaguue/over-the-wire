#include "Socket.hpp"

namespace OverTheWire::Transports::Socket {

Napi::Object init(Napi::Env env, Napi::Object exports) {
  Socket::Init(env, exports);
  SockAddr::Init(env, exports);
  return exports;
}

Napi::Object Socket::Init(Napi::Env env, Napi::Object exports) {
  Napi::Function func = DefineClass(env, "Socket", {
    InstanceMethod<&Socket::_write>("_write", static_cast<napi_property_attributes>(napi_writable | napi_configurable)),
    InstanceMethod<&Socket::_write>("bind", static_cast<napi_property_attributes>(napi_writable | napi_configurable)),
    InstanceMethod<&Socket::_write>("setsockopt", static_cast<napi_property_attributes>(napi_writable | napi_configurable)),
    InstanceMethod<&Socket::_write>("getsockopt", static_cast<napi_property_attributes>(napi_writable | napi_configurable)),
    InstanceMethod<&Socket::_write>("ioctl", static_cast<napi_property_attributes>(napi_writable | napi_configurable)),
  });

  env.GetInstanceData<AddonData>()->SetClass(typeid(Socket), func);

  exports.Set("socket", func);
  return exports;
}

static void IoEvent(uv_poll_t* watcher, int status, int revents) {
  Socket* socket = static_cast<Socket*>(watcher->data);
  socket->handleIOEvent(status, revents);
}

Socket::Socket(const Napi::CallbackInfo& info) : Napi::ObjectWrap<Socket>{info}, packets{flags, connected} {
  Napi::Env env = info.Env();
  checkLength(info, 1);
  if (info[0].IsObject()) {
    Napi::Object obj = info[0].As<Napi::Object>();
    if (!(obj.Has("domain") && obj.Has("type") && obj.Has("protocol"))) {
      Napi::Error::New(env, "You should specife domain, type and protocol").ThrowAsJavaScriptException();
      return;
    }
    domain = obj.Get("domain").As<Napi::Number>().Int32Value();
    type = obj.Get("type").As<Napi::Number>().Int32Value();
    protocol = obj.Get("protocol").As<Napi::Number>().Int32Value();
  }
  else {
    checkLength(info, 3);
    domain = info[0].As<Napi::Number>().Int32Value();
    type = info[0].As<Napi::Number>().Int32Value();
    protocol = info[0].As<Napi::Number>().Int32Value();
  }

  createSocket(env);
  initSocket(env);
}

void Socket::createSocket(Napi::Env env) {
  pollfd = socket(domain, type, protocol);

  if (pollfd < 0) {
    Napi::Error::New(env, "Error initializing socket: " + getSystemError()).ThrowAsJavaScriptException();
  }
}

void Socket::initSocket(Napi::Env env) {
  pollWatcher = decltype(pollWatcher){new uv_poll_t};
  pollWatcher->data = this;
  
  int initResult = uv_poll_init_socket(uv_default_loop(), pollWatcher.get(), pollfd);
  if (initResult != 0) {
    Napi::Error::New(env, "Error initializing poll watcher: " + getLibuvError(initResult)).ThrowAsJavaScriptException();
    return;
  }
}

void Socket::pollStart() {
  int startResult = uv_poll_start(pollWatcher.get(), flags, IoEvent);
  if (startResult != 0) {
    Napi::Error::New(push.Env(), "Error starting poll watcher: " + getLibuvError(startResult)).ThrowAsJavaScriptException();
    return;
  }
}

void Socket::setFlag(int flag, bool value) {
  if (value) {
    flags |= flag;
  }
  else {
    flags &= ~flag;
  }
}

bool Socket::getFlag(int flag) {
  return (flags & flag) != 0;
}

Napi::Value Socket::bind(const Napi::CallbackInfo& info) {
  //TODO
  return info.Env().Undefined();
}

Napi::Value Socket::setsockopt(const Napi::CallbackInfo& info) {
  //TODO
  return info.Env().Undefined();
}

Napi::Value Socket::getsockopt(const Napi::CallbackInfo& info) {
  //TODO
  return info.Env().Undefined();
}

Napi::Value Socket::ioctl(const Napi::CallbackInfo& info) {
  //TODO
  return info.Env().Undefined();
}

Napi::Value Socket::startReading(const Napi::CallbackInfo& info) {
  setFlag(UV_READABLE, true);
  pollStart();
  return info.Env().Undefined();
}

Napi::Value Socket::stopReading(const Napi::CallbackInfo& info) {
  setFlag(UV_READABLE, false);
  pollStart();
  return info.Env().Undefined();
}

void Socket::handleIOEvent(int status, int revents) {
  if (status < 0) {
    onError.MakeCallback(this->Value(), { Napi::String::New(onError.Env(), "error"), Napi::String::New(onError.Env(), getLibuvError(status)) }, nullptr);
    return;
  }

  if (revents & UV_READABLE) {
    //TODO
  }
  else if (revents & UV_WRITABLE) {
    auto result = packets.send(pollfd);
    switch(result) {
      case SendStatus::ok:
        setFlag(UV_WRITABLE, false);
        pollStart();
        return;
      case SendStatus::fail:
        Napi::Error::New(callback.Value().Env(), "Error sending packet: " + getSystemError()).ThrowAsJavaScriptException();
        return;
      case SendStatus::again:
        return;
    }
  }
}

Napi::Value Socket::_write(const Napi::CallbackInfo& info) {
  checkLength(info, 1);
  size_t size;
  uint8_t* buf;
  if (info[0].IsArray()) {
    Napi::Array ar = info[0].As<Napi::Array>();
    size_t n = ar.Length();
    for (size_t i{}; i < n; ++i) {
      std::tie(buf, size) = toCxx(ar.Get(i));
      //TODO
      /*if (!packets.add(buf, size)) {
        Napi::Error::New(info.Env(), "Error queueing packet").ThrowAsJavaScriptException();
        return info.Env().Undefined();
      }*/
    }
  }
  else {
    std::tie(buf, size) = toCxx(info[0]);
    //TODO
    /*if (!packets.add(buf, size)) {
      Napi::Error::New(info.Env(), "Error queueing packet").ThrowAsJavaScriptException();
      return info.Env().Undefined();
    }*/
  }

  if (!getFlag(UV_WRITABLE)) {
    setFlag(UV_WRITABLE, true);
    pollStart();
  }

  return info.Env().Undefined();
}

Socket::~Socket() {
  if (pollWatcher.get()) {
    uv_poll_stop(pollWatcher.get());
  }
}

};
