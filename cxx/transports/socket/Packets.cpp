#include "Packets.hpp"

namespace OverTheWire::Transports::Socket {

Packets::Packets(int& flags, bool& connected) : flags{flags}, connected{connected} {}

#ifndef _WIN32
std::pair<bool, msghdr> createMsghdr(uint8_t* buf, size_t size, sockaddr* addr, size_t addrSize, iovec* msgIov, bool connected) {
  auto res = std::make_pair(true, msghdr{});
  if (addr->sa_family == AF_UNSPEC || connected) {
    res.second.msg_name = NULL;
    res.second.msg_namelen = 0;
  } 
  else {
    res.second.msg_name = addr;
    res.second.msg_namelen = addrSize;
  }
  msgIov->iov_base = buf;
  msgIov->iov_len = size;
  res.second.msg_iov = msgIov;
  res.second.msg_iovlen = 1;

  return res;
}
#endif

bool Packets::add(uint8_t* buf, size_t size, SockAddr* target) {
  addr_t addr;
  sockaddr* addrRaw = nullptr;
  if (!connected || addrs.size() == 0) {
    std::string err;
    std::tie(err, addr) = target->addr();
    if (err.size() > 0 && !connected) {
      return false;
    }
    addrRaw = addr.first.get();
    addrs.push_back(std::move(addr));
  }
#ifdef _WIN32
  WSABUF pkt;
  pkt.len = size;
  pkt.buf = (char*)buf;
  packets.push_back(pkt);
#else
  iovecs.emplace_back();
  iovec* iovec = &iovecs.back();
  bool ok;
  msghdr msg;
  std::tie(ok, msg) = createMsghdr(buf, size, addrRaw, addr.second, iovec, connected);
  if (!ok) return false;
#if defined(__linux__) || defined(__FreeBSD__)
  mmsghdr p;
  p.msg_hdr = std::move(msg);
  packets.emplace_back(std::move(p));
#else
  packets.emplace_back(std::move(msg));
#endif
#endif
  return true;
}

SendStatus Packets::send(SOCKET fd) {
#ifdef _WIN32
  int result;
  DWORD bytes;
  WSAOVERLAPPED ioOverlapped = { 0 };
  if (connected) {
    assert(packets.size() == addrs.size());
  }
  while (!packets.empty()) {
    auto* pkt = &packets.front();

    if (connected) {
        result = WSASend(fd,
                       pkt,
                       1,
                       &bytes,
                       0,
                       &ioOverlapped,
                       NULL);

    }
    else {
      auto& addr = addrs.front();
      result = WSASendTo(fd,
                       pkt,
                       1,
                       &bytes,
                       0,
                       addr.first.get(),
                       addr.second,
                       &ioOverlapped,
                       NULL);
    }

    if (result == 0) {
      packets.pop_front();
      if (!connected) {
        addrs.pop_front();
      }
    }

    if (GetLastError() == ERROR_IO_PENDING) {
      return SendStatus::again;
    }

    return SendStatus::fail;
  }

  return SendStatus::ok;

#elif defined(__linux__) || defined(__FreeBSD__)
  int npkts;
  do {
    npkts = sendmmsg(fd, packets.data(), packets.size(), flags);
  } while (npkts == -1 && errno == EINTR);

  if (npkts < 1) {
    if (errno == EAGAIN || errno == EWOULDBLOCK || errno == ENOBUFS) {
      return SendStatus::again;
    }
    return SendStatus::fail;
  }
  addrs.clear();
  packets.clear();
  iovecs.clear();
  return SendStatus::ok;
#else
  assert(packets.size() == iovecs.size());
  if (!connected) {
    assert(packets.size() == addrs.size());
  }
  int npkts;
  while (!packets.empty()) {
    auto& pkt = packets.front();
    int size;
    do {
      size = sendmsg(fd, &pkt, flags);
    } while (npkts == -1 && errno == EINTR);
    DEBUG_OUTPUT(size);

    if (size < 1) {
      DEBUG_OUTPUT(getSystemError());
      if (errno == EAGAIN || errno == EWOULDBLOCK || errno == ENOBUFS) {
        return SendStatus::again;
      }
      return SendStatus::fail;
    }

    packets.pop_front();
    iovecs.pop_front();
    addrs.pop_front();
  }
  return SendStatus::ok;
#endif
}

size_t Packets::size() {
  return packets.size();
}

};
