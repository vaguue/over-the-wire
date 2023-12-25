#include "Socket.hpp"

namespace OverTheWire::Transports::Socket {

#ifdef _WIN32
static thread_local char errbuf[1024];
#endif
std::string getSystemError() {
#ifdef _WIN32
  if (FormatMessage(FORMAT_MESSAGE_FROM_SYSTEM, 0, WSAGetLastError(), 0, errbuf, 1024, NULL)) {
    return std::string(errbuf);
  } 
  else {
    strcpy(errbuf, "Unknown error");
    return std::string(errbuf);
  }
#else
  return std::string(strerror(errno));
#endif
}

std::string getLibuvError(int code) {
  return std::string(uv_strerror(code));
}

Napi::Object init(Napi::Env env, Napi::Object exports) {
  Stream::Init(env, exports);
  return exports;
}


Napi::Object Stream::Init(Napi::Env env, Napi::Object exports) {
  Napi::Function func = DefineClass(env, "Socket", {
    InstanceMethod<&Stream::_write>("_write", static_cast<napi_property_attributes>(napi_writable | napi_configurable)),
    InstanceMethod<&Stream::open>("open", static_cast<napi_property_attributes>(napi_writable | napi_configurable)),
  });

  extendJsClass<JsParent<Stream>>(env, func, "events", "EventEmitter");
  env.GetInstanceData<AddonData>()->SetClass(typeid(Stream), func);

  exports.Set("socket", func);
  return exports;
}

static void IoEvent(uv_poll_t* watcher, int status, int revents) {
  Stream* socket = static_cast<Stream*>(watcher->data);
  socket->handleIOEvent(status, revents);
}

Stream::Stream(const Napi::CallbackInfo& info) : Napi::ObjectWrap<Stream>{info} {
  Napi::Env env = info.Env();
  env.GetInstanceData<AddonData>()->GetClass(typeid(JsParent<Stream>)).Call(this->Value(), {});
  checkLength(info, 1);
  if (info[0].IsObject()) {
    Napi::Object obj = info[0].As<Napi::Object>();
    if (!(obj.Has("domain") && obj.Has("type") && obj.Has("protocol"))) {
      Napi::Error::New(env, "You should specife domain, type and protocol").ThrowAsJavaScriptException();
      return;
    }
    domain = obj.Get("domain").As<Napi::String>().Utf8Value();
    type = obj.Get("type").As<Napi::String>().Utf8Value();
    protocol = obj.Get("protocol").As<Napi::String>().Utf8Value();
  }
  else {
    checkLength(info, 3);
    domain = info[0].As<Napi::Number>().Int32Value();
    type = info[0].As<Napi::Number>().Int32Value();
    protocol = info[0].As<Napi::Number>().Int32Value();

    Napi::Object self = this->Value().ToObject();
    emit = self.Get("emit").As<Napi::Function>();
  }

  createSocket(env);
}

void Stream::createSocket(Napi::Env env) {
  pollfd = socket(domain, type, protocol);

  if (pollfd < 0) {
    Napi::Error::New(env, "Error initializing socket: " + getSystemError()).ThrowAsJavaScriptException();
  }
}

void Stream::initSocket(Napi::Env env) {
  pollWatcher = decltype(pollWatcher){new uv_poll_t};
  pollWatcher->data = this;
  
  int initResult = uv_poll_init_socket(uv_default_loop(), pollWatcher.get(), pollfd);
  if (initResult != 0) {
    Napi::Error::New(env, "Error initializing poll watcher: " + getLibuvError(initResult)).ThrowAsJavaScriptException();
    return;
  }
}

void Stream::pollStart() {
  int startResult = uv_poll_start(pollWatcher.get(), flags, IoEvent);
  if (startResult != 0) {
    Napi::Error::New(env, "Error starting poll watcher: " + getLibuvError(startResult)).ThrowAsJavaScriptException();
    return;
  }
}

void Stream::setFlag(int flag, bool value) {
  if (value) {
    flags |= flag;
  }
  else {
    flags &= ~flag;
  }
}

Napi::Value Stream::bind(const Napi::CallbackInfo& info) {
  //TODO
  return info.Env().Undefined();
}

Napi::Value Stream::setsockopt(const Napi::CallbackInfo& info) {
  //TODO
  return info.Env().Undefined();
}

Napi::Value Stream::getsockopt(const Napi::CallbackInfo& info) {
  //TODO
  return info.Env().Undefined();
}

Napi::Value Stream::ioctl(const Napi::CallbackInfo& info) {
  //TODO
  return info.Env().Undefined();
}

Napi::Value Stream::startReading(const Napi::CallbackInfo& info) {
  setFlags(UV_READABLE, true);
  pollStart();
  return info.Env().Undefined();
}

Napi::Value Stream::stopReading(const Napi::CallbackInfo& info) {
  setFlags(UV_READABLE, false);
  pollStart();
  return info.Env().Undefined();
}

void Stream::handleIOEvent(int status, int revents) {
  if (status < 0) {
    emit.MakeCallback(this->Value(), { Napi::String::New(emit.Env(), "error"), Napi::String::New(emit.Env(), getLibuvError(status)) }, nullptr);
    return;
  }

  if (revents & UV_READABLE) {
    //TODO
  }
  else if (revents & UV_WRITABLE) {
    //TODO
  }
}

Napi::Value Stream::_write(const Napi::CallbackInfo& info) {
  //TODO
  return info.Env().Undefined();
}

Stream::~Stream() {
  if (pollWatcher.get()) {
    uv_poll_stop(pollWatcher.get());
  }
}

};
