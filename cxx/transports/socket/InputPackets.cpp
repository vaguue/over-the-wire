#include "InputPackets.hpp"

namespace OverTheWire::Transports::Socket {

read_res_t&& emptyRes() {
  auto res = std::make_pair<cxx_buffer_t, addr_t>(
    std::make_pair<std::unique_ptr<uint8_t>, size_t>(nullptr, 0),
    std::make_pair<std::unique_ptr<sockaddr>, size_t>(nullptr, 0)
  );
  return std::move(res);
}

InputPacketsIterator::InputPacketsIterator(InputPacketReader& parent, size_t idx, bool isNull) 
  : parent{parent}, idx{idx}, isNull{isNull} {}

InputPacketsIterator::InputPacketsIterator(const InputPacketsIterator& other) 
  : parent{other.parent}, idx{other.idx}, isNull{other.isNull}, value{std::make_pair(std::string{""}, emptyRes())} {}

void InputPacketsIterator::read() {
  if (was) return;
  was = true;

#ifdef _WIN32
  //TODO
  WSAOVERLAPPED ioOverlapped = { 0 };
  int bytes, result, flags = 0;
  WSABUF buf;
  buf.buf = new uint8_t[parent.bufSize];
  buf.len = parent.bufSize;

  if (parent.queryAddr) {
    fromPtr = sockaddr_ptr_t{new sockaddr_storage};
    int from_len;
    memset(fromPtr.get(), 0, sizeof sockaddr_storage);
    from_len = sizeof from;
    result = WSARecvFrom(parent.fd,
                (WSABUF*)&buf,
                1,
                &bytes,
                &flags,
                fromPtr.get(),
                &from_len,
                NULL,
                NULL);
    value.pData.pAddr = std::make_pair(std::move(fromPtr), from_len);
  }
  else {
    result = WSARecv(parent.fd,
                    (WSABUF*)&buf,
                    1,
                    &bytes,
                    &flags,
                    ioOverlapped,
                    NULL)
  }
  if (result == -1) {
    value.pErr = getSystemError();
    isNull = true;
    delete buf.buf;
  }
  value.pData.pBuf = std::make_pair(decltype(value.second.first.first){buf.buf}, result);
//TODO recmmsg is way too hard to implenet here, so I save it for later
#else
  msghdr h{};
  ssize_t nread = 0;
  std::unique_ptr<struct sockaddr> peer = decltype(peer){(sockaddr*)new struct sockaddr_storage};
  std::unique_ptr<uint8_t> buf = decltype(buf){new uint8_t[parent.bufSize]};
  std::unique_ptr<struct iovec> iovec = decltype(iovec){new struct iovec};

  iovec->iov_base = (void*)buf.get();
  iovec->iov_len = parent.bufSize;

  memset(&h, 0, sizeof(h));
  memset(peer.get(), 0, sizeof(*peer.get()));
  h.msg_name = peer.get();
  h.msg_namelen = sizeof(sockaddr_storage);
  h.msg_iov = iovec.get();
  h.msg_iovlen = 1;

  do {
    nread = recvmsg(parent.fd, &h, 0);
  } while (nread == -1 && errno == EINTR);

  if (nread == -1) {
    value.pErr = getSystemError();
    isNull = true;
  }
  else {
    value.pData.pBuf = std::make_pair(std::move(buf), nread);
    if (parent.queryAddr) {
      value.pData.pAddr = std::make_pair(std::move(peer), sizeof(sockaddr_storage));
    }
  }
#endif
}

void InputPacketsIterator::incr() {
  if (isNull) return;
  if (++idx == parent.maxRead) {
    isNull = true;
    idx = -1;
  }
}

InputPacketsIterator::reference InputPacketsIterator::operator*() { 
  read();
  return value;
}

InputPacketsIterator::pointer InputPacketsIterator::operator->() {
  read();
  return &value;
}

InputPacketsIterator& InputPacketsIterator::operator++() { 
  read();
  incr();
  return *this;
}

InputPacketsIterator InputPacketsIterator::operator++(int) { 
  auto tmp = *this;
  read();
  incr();
  return tmp;
}

bool operator==(const InputPacketsIterator& a, const InputPacketsIterator& b) { 
  if (a.isNull && b.isNull) return true;
  return a.parent.fd == b.parent.fd && a.idx == b.idx;
};

bool operator!=(const InputPacketsIterator& a, const InputPacketsIterator& b) { 
  if (a.isNull && b.isNull) return false;
  return a.parent.fd != b.parent.fd || a.idx != b.idx;
};


InputPacketReader::InputPacketReader(SOCKET fd, size_t bufSize = defaultBufferSize, bool queryAddr = true) : fd{fd}, queryAddr{queryAddr}, bufSize{bufSize} {}

InputPacketsIterator InputPacketReader::begin() {
  return InputPacketsIterator(*this, 0, false);
}

InputPacketsIterator InputPacketReader::end() {
  return InputPacketsIterator(*this, -1, true);
}

};
