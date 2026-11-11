#include "Arp.h"
#if defined(__APPLE__)
#include "macOS.cxx"
#elif defined(_WIN32)
#include "win32.cxx"
#else
namespace OverTheWire::Arp {
  std::pair<std::string, arp_table_t> fromSys() {
    return {"ARP table not implemented for this platform", {}};
  }
}
#endif
