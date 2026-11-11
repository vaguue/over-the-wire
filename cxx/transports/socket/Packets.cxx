#include "Packets.h"

namespace OverTheWire::Transports::Socket {

Packets::Packets(int& flags, bool& connected) : flags{flags}, connected{connected} {}

#ifndef _WIN32
std::pair<bool, msghdr> createMsghdr(uint8_t* buf, size_t size, sockaddr* addr, size_t addrSize, iovec* msgIov, bool connected) {
  auto res = std::make_pair(true, msghdr{});
  if (connected || addr == nullptr || addr->sa_family == AF_UNSPEC) {
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
  sockaddr* addrRaw = nullptr;
  size_t addrSize = 0;

  if (!connected) {
    if (target == nullptr) {
      return false;
    }

    std::string err;
    addr_t addr;
    std::tie(err, addr) = target->addr();

    if (err.size() > 0) {
      return false;
    }

    addrRaw = addr.first.get();
    addrSize = addr.second;
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
  std::tie(ok, msg) = createMsghdr(buf, size, addrRaw, addrSize, iovec, connected);
  if (!ok) return false;
#if defined(__linux__) || defined(__FreeBSD__)
  mmsghdr p{};
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
  if (!connected) {
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
      delete[] reinterpret_cast<uint8_t*>(pkt->buf);
      packets.pop_front();

      if (!addrs.empty()) {
        addrs.pop_front();
      }

      continue;
    }

    if (GetLastError() == ERROR_IO_PENDING) {
      return SendStatus::again;
    }

    return SendStatus::fail;
  }

  return SendStatus::ok;

#elif defined(__linux__) || defined(__FreeBSD__)
  if (packets.empty()) {
    return SendStatus::ok;
  }

  for (size_t i{}; i < packets.size(); ++i) {
    packets[i].msg_hdr.msg_iov = &iovecs[i];
  }

  int npkts;

  do {
    npkts = sendmmsg(fd, packets.data(), packets.size(), flags);
  } while (npkts == -1 && errno == EINTR);

  if (npkts < 1) {
    if (errno == EAGAIN || errno == EWOULDBLOCK || errno == ENOBUFS) {
      return SendStatus::again;
    }

    int sendError = errno;
    discardFront();
    errno = sendError;
    return SendStatus::fail;
  }

  for (int i{}; i < npkts; ++i) {
    discardFront();
  }

  return packets.empty() ? SendStatus::ok : SendStatus::again;
#else
  assert(packets.size() == iovecs.size());

  while (!packets.empty()) {
    auto& pkt = packets.front();
    int size;

    do {
      size = sendmsg(fd, &pkt, flags);
    } while (size == -1 && errno == EINTR);
    DEBUG_OUTPUT(size);

    if (size < 1) {
      DEBUG_OUTPUT(getSystemError());
      if (errno == EAGAIN || errno == EWOULDBLOCK || errno == ENOBUFS) {
        return SendStatus::again;
      }

      int sendError = errno;
      discardFront();
      errno = sendError;
      return SendStatus::fail;
    }

    discardFront();
  }

  return SendStatus::ok;
#endif
}

#ifndef _WIN32
void Packets::discardFront() {
  if (packets.empty()) {
    return;
  }

  delete[] static_cast<uint8_t*>(iovecs.front().iov_base);
  packets.erase(packets.begin());
  iovecs.erase(iovecs.begin());

  if (!addrs.empty()) {
    addrs.erase(addrs.begin());
  }
}
#endif

Packets::~Packets() {
#ifdef _WIN32
  for (auto& pkt : packets) {
    delete[] reinterpret_cast<uint8_t*>(pkt.buf);
  }
#else
  for (auto& queued : iovecs) {
    delete[] static_cast<uint8_t*>(queued.iov_base);
  }
#endif
}

size_t Packets::size() {
  return packets.size();
}

};
