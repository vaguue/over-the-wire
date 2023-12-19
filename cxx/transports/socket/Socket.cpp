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
  checkLength(info, 3);
  Napi::Env env = info.Env();
  env.GetInstanceData<AddonData>()->GetClass(typeid(JsParent<Stream>)).Call(this->Value(), {});
  domain = info[0].As<Napi::Number>().Int32Value();
  type = info[0].As<Napi::Number>().Int32Value();
  protocol = info[0].As<Napi::Number>().Int32Value();

  Napi::Object self = this->Value().ToObject();
  emit = self.Get("emit").As<Napi::Function>();

  initSocket(env);
}

void Stream::initSocket(Napi::Env env) {
  if (pollInitialised) {
    return;
  }

  pollfd = socket(domain, type, protocol);

  if (pollfd < 0) {
    Napi::Error::New(env, "Error initializing socket: " + getSystemError()).ThrowAsJavaScriptException();
    return;
  }

#ifdef _WIN32
  unsigned long flag = 1;
  if (ioctlsocket(pollfd, FIONBIO, &flag) != 0) {
    Napi::Error::New(env, "Error setting socket to non-blocking mode: " + getSystemError()).ThrowAsJavaScriptException();
    return;
  }
#else
  int flag = 1;
  if ((flag = fcntl(pollfd, F_GETFL, 0)) == -1) {
    Napi::Error::New(env, "Error setting socket to non-blocking mode: " + getSystemError()).ThrowAsJavaScriptException();
    return;
  }
  if (fcntl(pollfd, F_SETFL, flag | O_NONBLOCK) == -1) {
    Napi::Error::New(env, "Error setting socket to non-blocking mode: " + getSystemError()).ThrowAsJavaScriptException();
    return;
  }
#endif

  pollWatcher = decltype(pollWatcher){new uv_poll_t};
  
  int initResult = uv_poll_init_socket(uv_default_loop(), pollWatcher.get(), pollfd);
  if (initResult != 0) {
    Napi::Error::New(env, "Error initializing poll watcher: " + getLibuvError(initResult)).ThrowAsJavaScriptException();
    return;
  }

  int startResult = uv_poll_start(pollWatcher.get(), UV_READABLE, IoEvent);
  if (startResult != 0) {
    Napi::Error::New(env, "Error starting poll watcher: " + getLibuvError(startResult)).ThrowAsJavaScriptException();
    return;
  }
  pollInitialised = true;
}

void Stream::handleIOEvent(int status, int revents) {
  if (status < 0) {
    emit.MakeCallback(this->Value(), { Napi::String::New(emit.Env(), "error"), Napi::String::New(emit.Env(), getLibuvError(status)) }, nullptr);
    return;
  } 

  if (revents & UV_READABLE) {

  }
  else if (revents & UV_WRITABLE) {

  }
}

Stream::~Stream() {

}

Napi::Value Stream::_write(const Napi::CallbackInfo& info) {
  return info.Env().Undefined();
}


};
