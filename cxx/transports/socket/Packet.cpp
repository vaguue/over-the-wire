#include "Packet.hpp"

namespace OverTheWire::Transports::Socket {

Packets::Packets(int& flags, bool& connected) : flags{flags}, connected{connected} {}

#ifndef _WIN32
std::pair<bool, msghdr> createMsghdr(uint8_t* buf, size_t size, sockaddr* addr, iovec* msgIov) {
  auto res = std::make_pair(true, msghdr{});
  if (addr->sa_family == AF_UNSPEC) {
    res.second.msg_name = NULL;
    res.second.msg_namelen = 0;
  } 
  else {
    res.second.msg_name = addr;
    if (addr->sa_family == AF_INET6){
      res.second.msg_namelen = sizeof(sockaddr_in6);
    }
    else if (addr->sa_family == AF_INET) {
      res.second.msg_namelen = sizeof(sockaddr_in);
    }
    else if (addr->sa_family == AF_UNIX) {
      res.second.msg_namelen = sizeof(sockaddr_un);
    }
    else {
      res.first = false;
      return res;
    }
  }
  msgIov->iov_base = buf;
  msgIov->iov_len = size;
  res.second.msg_iov = msgIov;
  res.second.msg_iovlen = 1;

  return res;
}
#endif

bool Packets::add(uint8_t* buf, size_t size, std::optional<sockaddr*> addr) {
  //TODO
  if (addr) {
    addrs.emplace_back(*addr);
  }
#ifdef _WIN32
  packets.emplace_back(size, buf);
#else
  sockaddr* addrp = addrs.back().get();
  iovecs.emplace_back();
  iovec* iovec = &iovecs.back();
  bool ok;
  msghdr msg;
  std::tie(ok, msg) = createMsghdr(buf, size, addrp, iovec);
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
  int bytes;
  WSAOVERLAPPED ioOverlapped;
  int result = WSASendTo(fd,
                     packets.data(),
                     packets.size(),
                     &bytes,
                     0,
                     addrs.data(),
                     addres.size(),
                     &ioOverlapped,
                     flags);
  
  if (result == 0) {
    addrs.clear();
    packets.clear();
    return SendStatus::ok;
  }

  if (GetLastError() == ERROR_IO_PENDING) {
    return SendStatus::again;
  }

  return SendStatus::fail;

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
  int npkts;
  while (!packets.empty()) {
    auto& pkt = packets.front();
    int size;
    do {
      size = sendmsg(fd, &pkt, flags);
    } while (npkts == -1 && errno == EINTR);

    if (size < 1) {
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

};
