#pragma once

#include <deque>

#include "common.hpp"
#include "Sys.hpp"
#include "error/Error.hpp"
#include "SockAddr.hpp"

/*
 * This is the class that tries to abstract away
 * the process of reading from socket with C++ iterators.
 */

namespace OverTheWire::Transports::Socket {

#define pErr first
#define pData second
#define pBuf first
#define pAddr second

  const size_t defaultBufferSize = 65'535;

  struct InputPacketReader;

  using read_res_t = std::pair<cxx_buffer_t, addr_t>;
  read_res_t&& emptyRes();

  struct InputPacketsIterator {
    using iterator_category = std::input_iterator_tag;
    using difference_type = size_t;
    using value_type = std::pair<std::string, read_res_t>;
    using pointer = value_type*;
    using reference = value_type&;

    InputPacketsIterator(InputPacketReader&, size_t idx, bool isNull);
    InputPacketsIterator(const InputPacketsIterator&);

    reference operator*();
    pointer operator->();

    InputPacketsIterator& operator++();
    InputPacketsIterator operator++(int);

    friend bool operator==(const InputPacketsIterator& a, const InputPacketsIterator& b);
    friend bool operator!=(const InputPacketsIterator& a, const InputPacketsIterator& b);

    void read();
    void incr();

    value_type value;
    bool was = false;
    InputPacketReader& parent;
    size_t idx;
    bool isNull;
  };

  struct InputPacketReader {
    InputPacketReader(SOCKET, size_t, bool);
    InputPacketsIterator begin();
    InputPacketsIterator end();

    SOCKET fd;
    size_t maxRead = 32;
    size_t bufSize;
    bool queryAddr = true;
  };

}
