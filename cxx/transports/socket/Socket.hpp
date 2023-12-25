#include <iostream>
#include "common.hpp"
#include <uv.h>

#ifdef _WIN32
#pragma warning(disable:4506;disable:4530)
#endif

#ifdef _WIN32
#include <winsock2.h>
#include <Ws2tcpip.h>
#define SOCKET_OPT_TYPE char *
#define SOCKET_LEN_TYPE int
#else
#include <errno.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <fcntl.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#define SOCKET int
#define SOCKET_ERROR -1
#define closesocket close
#define SOCKET_OPT_TYPE void *
#define SOCKET_LEN_TYPE socklen_t
#endif

namespace OverTheWire::Transports::Socket {

  Napi::Object init(Napi::Env env, Napi::Object exports);

  struct Stream : public Napi::ObjectWrap<Stream> {
    static Napi::Object Init(Napi::Env, Napi::Object);
    Stream(const Napi::CallbackInfo& info);
    ~Stream();
    Napi::Value _write(const Napi::CallbackInfo&);
    void createSocket(Napi::Env);
    void startSocket(Napi::Env);
    void handleIOEvent(int status, int revents);

    Napi::Value Stream::bind(const Napi::CallbackInfo&);
    Napi::Value Stream::setsockopt(const Napi::CallbackInfo&);
    Napi::Value Stream::getsockopt(const Napi::CallbackInfo&);
    Napi::Value Stream::ioctl(const Napi::CallbackInfo&);

    bool noIpHeader;
    int domain;
    int type;
    int protocol;
    int pollFlags = 0;
    SOCKET pollfd;
    std::unique_ptr<uv_poll_t> pollWatcher;
    bool deconstructing;
    Napi::Function emit;
  };

  static void IoEvent(uv_poll_t*, int, int);
}
