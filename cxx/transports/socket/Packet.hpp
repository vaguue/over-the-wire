#pragma once

#include <deque>

#include "common.hpp"
#include "Sys.hpp"
#include "Error.hpp"

namespace OverTheWire::Transports::Socket {

  enum class SendStatus { again, ok, fail };

  struct Packets {
    Packets(int& flags, bool& connected);
    bool add(uint8_t*, size_t, std::optional<sockaddr*>);
    SendStatus send(SOCKET);

    int& flags;
    bool& connected;
#ifdef _WIN32
    std::vector<sockaddr> addrs;
    std::vector<WSABUF> packets;
#elif defined(__linux__) || defined(__FreeBSD__)
    std::vector<std::unique_ptr<sockaddr>> addrs;
    std::vector<iovec> iovecs;
    std::vector<mmsghdr> packets;
#else
    std::deque<std::unique_ptr<sockaddr>> addrs;
    std::deque<iovec> iovecs;
    std::deque<msghdr> packets;
#endif
  };

}
