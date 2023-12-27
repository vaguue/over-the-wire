#pragma once

#include <iostream>
#include <uv.h>

#include "common.hpp"
#include "Packet.hpp"
#include "Error.hpp"
#include "SockAddr.hpp"

namespace OverTheWire::Transports::Socket {

  Napi::Object init(Napi::Env env, Napi::Object exports);

  struct Socket : public Napi::ObjectWrap<Socket> {
    static Napi::Object Init(Napi::Env, Napi::Object);
    Socket(const Napi::CallbackInfo& info);
    ~Socket();
    Napi::Value _write(const Napi::CallbackInfo&);
    void createSocket(Napi::Env);
    void initSocket(Napi::Env);
    void pollStart();
    void handleIOEvent(int, int);
    void setFlag(int, bool);
    bool getFlag(int);

    Napi::Value startReading(const Napi::CallbackInfo&);
    Napi::Value stopReading(const Napi::CallbackInfo&);
    Napi::Value bind(const Napi::CallbackInfo&);
    Napi::Value setsockopt(const Napi::CallbackInfo&);
    Napi::Value getsockopt(const Napi::CallbackInfo&);
    Napi::Value ioctl(const Napi::CallbackInfo&);

    bool connected = false;
    int flags = 0;
    int domain;
    int type;
    int protocol;
    int pollFlags = 0;
    SOCKET pollfd;
    std::unique_ptr<uv_poll_t> pollWatcher;
    Napi::FunctionReference push;
    Napi::FunctionReference callback;
    Napi::FunctionReference onError;
    Packets packets;
  };

  static void IoEvent(uv_poll_t*, int, int);

}
