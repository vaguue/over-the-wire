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
    InstanceMethod<&Socket::write>("write", static_cast<napi_property_attributes>(napi_writable | napi_configurable)),
    InstanceMethod<&Socket::bind>("bind", static_cast<napi_property_attributes>(napi_writable | napi_configurable)),
    InstanceMethod<&Socket::connect>("connect", static_cast<napi_property_attributes>(napi_writable | napi_configurable)),
    InstanceMethod<&Socket::setsockopt>("setsockopt", static_cast<napi_property_attributes>(napi_writable | napi_configurable)),
    InstanceMethod<&Socket::getsockopt>("getsockopt", static_cast<napi_property_attributes>(napi_writable | napi_configurable)),
    InstanceAccessor<&Socket::getBufferSize, &Socket::setBufferSize>("bufferSize"),
    //InstanceMethod<&Socket::ioctl>("ioctl", static_cast<napi_property_attributes>(napi_writable | napi_configurable)),
    InstanceMethod<&Socket::toHuman>(Napi::Symbol::For(env, "nodejs.util.inspect.custom"), static_cast<napi_property_attributes>(napi_writable | napi_configurable)),
    InstanceMethod<&Socket::close>("close", static_cast<napi_property_attributes>(napi_writable | napi_configurable)),
    InstanceMethod<&Socket::resume>("resume", static_cast<napi_property_attributes>(napi_writable | napi_configurable)),
    InstanceMethod<&Socket::pause>("pause", static_cast<napi_property_attributes>(napi_writable | napi_configurable)),
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

    if (obj.Has("bufferSize")) {
      bufferSize = obj.Get("bufferSize").As<Napi::Number>().Uint32Value();
    }
  }
  else {
    checkLength(info, 3);
    domain = info[0].As<Napi::Number>().Int32Value();
    type = info[1].As<Napi::Number>().Int32Value();
    protocol = info[2].As<Napi::Number>().Int32Value();
  }

  env.GetInstanceData<AddonData>()->GetClass(typeid(JsParent<Socket>)).Call(this->Value(), {});

  createSocket(env);
  initSocket(env);
}

void Socket::createSocket(Napi::Env env) {
  pollfd = ::socket(domain, type, protocol);

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
    Napi::Error::New(Env(), getLibuvError(startResult)).ThrowAsJavaScriptException();
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
  addrObj->genName(info.Env(), false);
  boundTo = std::string{addrObj->name};
  int port = addrObj->port;
  if (port > 0) {
    boundTo += ":";
    boundTo += std::to_string(port);
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
  target->genName(info.Env(), false);
  connectedTo = std::string{target->name};
  int port = target->port;
  if (port > 0) {
    connectedTo += ":";
    connectedTo += std::to_string(port);
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

Napi::Value Socket::resume(const Napi::CallbackInfo& info) {
  setFlag(UV_READABLE, true);
  pollStart();
  refForRead();
  return info.Env().Undefined();
}

Napi::Value Socket::pause(const Napi::CallbackInfo& info) {
  setFlag(UV_READABLE, false);
  pollStart();
  unrefForRead();
  return info.Env().Undefined();
}

Napi::Value Socket::toHuman(const Napi::CallbackInfo& info) {
  std::stringstream ss;
  ss << "<Socket";
  if (boundTo.size() > 0) {
    ss << " | bound to " << boundTo;
  }
  if (connectedTo.size() > 0) {
    ss << " | connected to " << connectedTo;
  }
  if (flags & UV_READABLE) {
    ss << " | reading";
  }
  if (flags & UV_WRITABLE) {
    ss << " | pending write";
  }
  ss << ">";
  return Napi::String::New(info.Env(), ss.str());
}

void Socket::handleIOEvent(int status, int revents) {
  Napi::HandleScope scope{Env()};

  Napi::Object self = this->Value().ToObject();
  Napi::Function emit = self.Get("emit").As<Napi::Function>();

  if (status < 0) {
    emit.MakeCallback(Value(), { Napi::String::New(Env(), "error"), Napi::String::New(emit.Env(), getLibuvError(status)) }, nullptr);
    return;
  }

  if (revents & UV_READABLE) {
    InputPacketReader reader{pollfd, bufferSize, !connected};
    for (auto& packet : reader) {
      if (packet.pErr.size() > 0) {
        emit.MakeCallback(Value(), { Napi::String::New(Env(), "error"), Napi::String::New(emit.Env(), packet.pErr) }, nullptr);
        break;
      }

      if (!packet.pData.pBuf.first.get()) {
        break;
      }

      auto buf = js_buffer_t::NewOrCopy(Env(), (uint8_t*)packet.pData.pBuf.first.release(), packet.pData.pBuf.second, [](Napi::Env env, uint8_t* data) { 
        DEBUG_OUTPUT("Deleting packet buffer");
        delete data; 
      });

      Napi::Value addr;
      if (packet.pData.pAddr.first.get()) {
        addr = SockAddr::fromRaw(Env(), std::move(packet.pData.pAddr));
      }
      else {
        addr = Env().Undefined();
      }

      emit.MakeCallback(Value(), { Napi::String::New(Env(), "data"), buf, addr }, nullptr);
    }
  }
  else if (revents & UV_WRITABLE) {
    DEBUG_OUTPUT("Writable");
    auto result = packets.send(pollfd);
    switch(result) {
      case SendStatus::ok:
        DEBUG_OUTPUT("SendStatus is ok");
        setFlag(UV_WRITABLE, false);
        pollStart();
        unrefForWrite();
        emit.MakeCallback(Value(), { Napi::String::New(Env(), "drain") }, nullptr);
        break;
      case SendStatus::fail:
        DEBUG_OUTPUT("SendStatus is fail");
        unrefForWrite();
        emit.MakeCallback(Value(), { Napi::String::New(Env(), "error"), Napi::String::New(emit.Env(), getSystemError()) }, nullptr);
        break;
      case SendStatus::again:
        DEBUG_OUTPUT("SendStatus is again");
        break;
    }
  }

}

bool Socket::processReq(Napi::Env& env, const Napi::Value&& inputBuf, const Napi::Object&& inputAddr) {
  size_t size;
  uint8_t* buf;

  std::tie(buf, size) = toCxx(inputBuf);
  SockAddr* addr = Napi::ObjectWrap<SockAddr>::Unwrap(inputAddr);

  if (!packets.add(buf, size, addr)) {
    Napi::Error::New(env, "Error queueing packet").ThrowAsJavaScriptException();
    return false;
  }
  
  return true;
}

Napi::Value Socket::write(const Napi::CallbackInfo& info) {
  checkLength(info, 1);
  Napi::Env env = info.Env();
  if (info[0].IsArray()) {
    Napi::Array ar = info[0].As<Napi::Array>();
    size_t n = ar.Length();
    for (size_t i{}; i < n; ++i) {
      Napi::Array nestedAr = ar.Get(i).As<Napi::Array>();

      if (nestedAr.Length() < 2) {
        Napi::Error::New(env, "Error queueing packet").ThrowAsJavaScriptException();
        return env.Undefined();
      }

      bool ok = processReq(env, nestedAr.Get("0").As<Napi::Object>(), nestedAr.Get("1").As<Napi::Object>());
      if (!ok) {
        return env.Undefined();
      }
    }
  }
  else {
    bool ok = processReq(env, info[0], info[1].As<Napi::Object>());
    if (!ok) {
      return env.Undefined();
    }
  }

  if (!getFlag(UV_WRITABLE)) {
    setFlag(UV_WRITABLE, true);
    pollStart();
  }

  refForWrite();
  DEBUG_OUTPUT((std::stringstream{} << "writeRefsCount is " << writeRefsCount).str());

  return env.Undefined();
}

void Socket::refForRead() {
  if (readRefsCount == 0) {
    Ref();
    readRefsCount++;
  }
}

void Socket::refForWrite() {
  if (writeRefsCount == 0) {
    Ref();
    writeRefsCount++;
  }
}

void Socket::unrefForRead() {
  if (readRefsCount > 0) {
    Unref();
    readRefsCount--;
  }
}

void Socket::unrefForWrite() {
  if (writeRefsCount > 0) {
    Unref();
    writeRefsCount--;
  }
}

void Socket::close() {
  if (pollWatcher.get()) {
    uv_poll_stop(pollWatcher.get());
  }
  if (pollfd > 0) {
    ::closesocket(pollfd);
  }
}

Napi::Value Socket::getBufferSize(const Napi::CallbackInfo& info) {
  return Napi::Number::New(info.Env(), bufferSize);
}

void Socket::setBufferSize(const Napi::CallbackInfo&, const Napi::Value& val) {
  bufferSize = val.As<Napi::Number>().Uint32Value();
}

Napi::Value Socket::close(const Napi::CallbackInfo& info) {
  close();
  return info.Env().Undefined();
}

Socket::~Socket() {
  DEBUG_OUTPUT("~Socket");
  close();}

};
