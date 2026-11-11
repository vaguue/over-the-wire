#include "Routing.h"
#if defined(__APPLE__)
#include "macOS.cxx"
#elif defined(_WIN32)
#include "win32.cxx"
#else
namespace OverTheWire::Routing {
  std::pair<std::string, routing_table_t> fromSys() {
    return {"Routing table not implemented for this platform", {}};
  }
}
#endif
