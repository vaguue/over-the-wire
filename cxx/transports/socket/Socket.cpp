#include "Socket.hpp"

namespace OverTheWire::Transports::Socket {

Napi::Object init(Napi::Env env, Napi::Object exports) {
  Socket::Init(env, exports);
  SockAddr::Init(env, exports);
  Enums::Init(env, exports);
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

  extendJsClass<JsParent<Socket>>(env, func, "events", "EventEmitter"); 
  env.GetInstanceData<AddonData>()->SetClass(typeid(Socket), func);

  exports.Set("Socket", func);
  return exports;
}

static void IoEvent(uv_poll_t* watcher, int status, int revents) {
  Socket* socket = static_cast<Socket*>(watcher->data);
  socket->handleIOEvent(status, revents);
}

Socket::Socket(const Napi::CallbackInfo& info) : Napi::ObjectWrap<Socket>{info}, packets{sendFlags, connected} {
  Napi::Env env = info.Env();
  checkLength(info, 1);
  if (info[0].IsObject()) {
    Napi::Object obj = info[0].As<Napi::Object>();
    if (!(obj.Has("domain") && obj.Has("type") && obj.Has("protocol"))) {
      Napi::Error::New(env, "You should specify domain, type and protocol").ThrowAsJavaScriptException();
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

  emit = this->Value().Get("emit").As<Napi::Function>();

  createSocket(env);
  initSocket(env);
}

void Socket::createSocket(Napi::Env env) {
  pollfd = socket(domain, type, protocol);

  if (pollfd < 0) {
    Napi::Error::New(env, getSystemError()).ThrowAsJavaScriptException();
  }
}

void Socket::initSocket(Napi::Env env) {
  pollWatcher = decltype(pollWatcher){new uv_poll_t};
  pollWatcher->data = this;
  
  int initResult = uv_poll_init_socket(uv_default_loop(), pollWatcher.get(), pollfd);
  if (initResult != 0) {
    Napi::Error::New(env, getLibuvError(initResult)).ThrowAsJavaScriptException();
    return;
  }
}

void Socket::pollStart() {
  int startResult = uv_poll_start(pollWatcher.get(), flags, IoEvent);
  if (startResult != 0) {
    Napi::Error::New(emit.Env(), getLibuvError(startResult)).ThrowAsJavaScriptException();
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
  checkLength(info, 1);
  SockAddr* addrObj = Napi::ObjectWrap<SockAddr>::Unwrap(info[0].As<Napi::Object>());
  std::string err;
  addr_t addr;
  std::tie(err, addr) = addrObj->addr();
  if (err.size() > 0) {
    Napi::Error::New(info.Env(), err).ThrowAsJavaScriptException();
    return info.Env().Undefined();
  }
  int result = ::bind(pollfd, addr.first.get(), addr.second);
  if (result < 0) {
    Napi::Error::New(info.Env(), getSystemError()).ThrowAsJavaScriptException();
  }
  return info.Env().Undefined();
}

Napi::Value Socket::connect(const Napi::CallbackInfo& info) {
  checkLength(info, 1);
  SockAddr* target = Napi::ObjectWrap<SockAddr>::Unwrap(info[0].As<Napi::Object>());
  std::string err;
  addr_t addr;
  std::tie(err, addr) = target->addr();
  if (err.size() > 0) {
    Napi::Error::New(info.Env(), err).ThrowAsJavaScriptException();
    return info.Env().Undefined();
  }
  int result = ::connect(pollfd, addr.first.get(), addr.second);
  if (result < 0) {
    Napi::Error::New(info.Env(), getSystemError()).ThrowAsJavaScriptException();
  }
  return info.Env().Undefined();
}

Napi::Value Socket::setsockopt(const Napi::CallbackInfo& info) {
  checkLength(info, 3);
  int level = info[0].As<Napi::Number>().Int32Value();
  int optname = info[1].As<Napi::Number>().Int32Value();
  int result = 0;
  if (info[2].IsBuffer()) {
    js_buffer_t buf = info[2].As<js_buffer_t>();
    result = ::setsockopt(pollfd, level, optname, (SOCKET_OPT_TYPE)buf.Data(), buf.Length());
  }
  else if (info[2].IsNumber()) {
    int val = info[2].As<Napi::Number>();
    result = ::setsockopt(pollfd, level, optname, (SOCKET_OPT_TYPE)&val, 4);
  }
  else {
    Napi::Error::New(info.Env(), "Expected either Buffer or Number").ThrowAsJavaScriptException();
  }
  if (result < 0) {
    Napi::Error::New(info.Env(), getSystemError()).ThrowAsJavaScriptException();
  }
  return info.Env().Undefined();
}

Napi::Value Socket::getsockopt(const Napi::CallbackInfo& info) {
  checkLength(info, 2);
  int level = info[0].As<Napi::Number>().Int32Value();
  int optname = info[1].As<Napi::Number>().Int32Value();
  int result = 0;
  int val = 0;
  int len = 4;
  bool useBuffer = info.Length() > 2 && info[2].IsBuffer();

  if (useBuffer) {
    js_buffer_t buf = info[2].As<js_buffer_t>();
    len = buf.Length();
    result = ::getsockopt(pollfd, level, optname, (SOCKET_OPT_TYPE)buf.Data(), (SOCKET_LEN_TYPE*)&len);
  }
  else {
    result = ::getsockopt(pollfd, level, optname, (SOCKET_OPT_TYPE)&val, (SOCKET_LEN_TYPE*)&len);
  }

  if (result < 0) {
    Napi::Error::New(info.Env(), getSystemError()).ThrowAsJavaScriptException();
    return info.Env().Undefined();
  }

  if (useBuffer) {
    return Napi::Number::New(info.Env(), len);
  }
  else {
    return Napi::Number::New(info.Env(), val);
  }
}

Napi::Value Socket::ioctl(const Napi::CallbackInfo& info) {
  //TODO
  checkLength(info, 2);
  int name = info[0].As<Napi::Number>().Int32Value();
  int value = info[1].As<Napi::Number>().Int32Value();
#ifdef _WIN32
  int result = ioctlsocket(polld, name, &value);
  if (result < 0) {
    Napi::Error::New(info.Env(), getSystemError()).ThrowAsJavaScriptException();
  }
#elif USE_IOCTL

#else

#endif
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
    emit.MakeCallback(this->Value(), { Napi::String::New(emit.Env(), "error"), Napi::String::New(emit.Env(), getLibuvError(status)) }, nullptr);
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
        emit.MakeCallback(this->Value(), { Napi::String::New(emit.Env(), "drain") }, nullptr);
        return;
      case SendStatus::fail:
        Napi::Error::New(emit.Env(), "Error sending packet: " + getSystemError()).ThrowAsJavaScriptException();
        return;
      case SendStatus::again:
        return;
    }
  }
}

bool Socket::processReq(Napi::Env& env, const Napi::Value&& val) {
  Napi::Array ar = val.As<Napi::Array>();

  if (ar.Length() < 2) {
    Napi::Error::New(env, "Error queueing packet").ThrowAsJavaScriptException();
    return false;
  }

  size_t size;
  uint8_t* buf;

  std::tie(buf, size) = toCxx(ar.Get("0").As<Napi::Object>());
  SockAddr* addr = Napi::ObjectWrap<SockAddr>::Unwrap(ar.Get(1).As<Napi::Object>());

  if (!packets.add(buf, size, addr)) {
    Napi::Error::New(env, "Error queueing packet").ThrowAsJavaScriptException();
    return false;
  }
  
  return true;
}

Napi::Value Socket::_write(const Napi::CallbackInfo& info) {
  checkLength(info, 1);
  Napi::Env env = info.Env();
  if (info[0].IsArray()) {
    Napi::Array ar = info[0].As<Napi::Array>();
    size_t n = ar.Length();
    for (size_t i{}; i < n; ++i) {
      bool ok = processReq(env, ar.Get(i));
      if (!ok) {
        return env.Undefined();
      }
    }
  }
  else {
    bool ok = processReq(env, info[0]);
    if (!ok) {
      return env.Undefined();
    }
  }

  if (!getFlag(UV_WRITABLE)) {
    setFlag(UV_WRITABLE, true);
    pollStart();
  }

  return env.Undefined();
}

Socket::~Socket() {
  if (pollWatcher.get()) {
    uv_poll_stop(pollWatcher.get());
  }
}

};
