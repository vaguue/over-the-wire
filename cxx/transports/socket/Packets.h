#pragma once

#include <deque>
#include <cassert>

#include "common.h"
#include "Sys.h"
#include "error/Error.h"
#include "SockAddr.h"

/*
 * The Packets class is intended to abstract away 
 * the differences between OS's in terms of packet storage format
 * and sending methods, but introduces more problems than it solves.
 * On Linux we can send multiple packets to multiple destinations with
 * a single call (Linux superiority as always), on Windows we can send multiple packets to a single
 * destination, while on MacOS we can send only one packet at a time @_@
 */

namespace OverTheWire::Transports::Socket {

  enum class SendStatus { again, ok, fail };

  struct Packets {
    Packets(int& flags, bool& connected);
    ~Packets();
#ifndef _WIN32
    void discardFront();
#endif
    bool add(uint8_t*, size_t, SockAddr*);
    size_t size();
    SendStatus send(SOCKET);

    int& flags;
    bool& connected;
#ifdef _WIN32
    std::deque<addr_t> addrs;
    std::deque<WSABUF> packets;
#elif defined(__linux__) || defined(__FreeBSD__)
    std::vector<addr_t> addrs;
    std::vector<iovec> iovecs;
    std::vector<mmsghdr> packets;
#else
    std::deque<addr_t> addrs;
    std::deque<iovec> iovecs;
    std::deque<msghdr> packets;
#endif
  };

}
