#pragma once

#include <cstring>

#include "Sys.h"

namespace OverTheWire::Transports::Socket {

  struct Address {
    sockaddr_storage storage{};
    SOCKET_LEN_TYPE length = 0;

    static Address fromRaw(const sockaddr* source, SOCKET_LEN_TYPE sourceLength) {
      Address address;

      if (source == nullptr || sourceLength <= 0) {
        return address;
      }

      address.length = sourceLength;

      if (static_cast<size_t>(address.length) > sizeof(sockaddr_storage)) {
        address.length = static_cast<SOCKET_LEN_TYPE>(sizeof(sockaddr_storage));
      }

      std::memcpy(&address.storage, source, address.length);
      return address;
    }

    bool isSet() const {
      return length > 0;
    }

    int family() const {
      return storage.ss_family;
    }

    sockaddr* raw() {
      return reinterpret_cast<sockaddr*>(&storage);
    }

    const sockaddr* raw() const {
      return reinterpret_cast<const sockaddr*>(&storage);
    }
  };

}
