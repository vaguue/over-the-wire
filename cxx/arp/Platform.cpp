#include "Arp.hpp"
#if defined(__APPLE__)
#include "macOS.cpp"
#elif defined(_WIN32)
#include "win32.cpp"
#else
namespace OverTheWire::Arp {
  std::pair<std::string, arp_table_t> fromSys() {
    return {"ARP table not implemented for this platform", {}};
  }
}
#endif
