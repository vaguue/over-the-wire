#pragma once

#include <uv.h>

#include "common.hpp"
#include "error/Error.hpp"

/* 
 * Container for sockaddr struct. Some of the useful info below.
 * from https://docs.libuv.org/en/v1.x/misc.html#c.uv_ip4_addr 
 * int uv_ip4_addr(const char *ip, int port, struct sockaddr_in *addr)
 * Convert a string containing an IPv4 addresses to a binary structure.
 * int uv_ip6_addr(const char *ip, int port, struct sockaddr_in6 *addr)
 * Convert a string containing an IPv6 addresses to a binary structure.
 * int uv_ip_name(const struct sockaddr *src, char *dst, size_t size)
 * Convert a binary structure containing an IPv4 address or an IPv6 address to a string.
 * int uv_inet_ntop(int af, const void *src, char *dst, size_t size)
 * int uv_inet_pton(int af, const char *src, void *dst)
 * Cross-platform IPv6-capable implementation of inet_ntop(3) and inet_pton(3). On success they return 0. In case of error the target dst pointer is unmodified.
*/

namespace OverTheWire::Transports::Socket {

  using sockaddr_ptr_t = std::unique_ptr<sockaddr>;
  using addr_t = std::pair<sockaddr_ptr_t, size_t>;

  int ip_name(const struct sockaddr*, char*, size_t);

  struct SockAddr : public Napi::ObjectWrap<SockAddr> {
    static Napi::Object Init(Napi::Env, Napi::Object);
    static Napi::Value fromRaw(Napi::Env, addr_t&&);
    static Napi::FunctionReference*& ctor() {
      static Napi::FunctionReference* _ctor;
      return _ctor;
    };
    SockAddr(const Napi::CallbackInfo& info);
    ~SockAddr();
    bool genName(Napi::Env, bool);
    std::pair<std::string, addr_t> addr();

    Napi::Value toString(const Napi::CallbackInfo&);
    Napi::Value toBuffer(const Napi::CallbackInfo&);
    Napi::Value toHuman(const Napi::CallbackInfo&);

    Napi::Value getPort(const Napi::CallbackInfo&);
    void setPort(const Napi::CallbackInfo&, const Napi::Value&);

    Napi::Value getIp(const Napi::CallbackInfo&);
    void setIp(const Napi::CallbackInfo&, const Napi::Value&);

    Napi::Value getDomain(const Napi::CallbackInfo&);
    void setDomain(const Napi::CallbackInfo&, const Napi::Value&);

    std::string ip;
    int port = 0;
    int domain = -1;

    char name[INET6_ADDRSTRLEN];
  };

}
