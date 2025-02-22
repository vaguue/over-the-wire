#include "Routing.hpp"
#if defined(__APPLE__)
#include "macOS.cpp"
#elif defined(_WIN32)
#include "win32.cpp"
#else
namespace OverTheWire::Routing {
  std::pair<std::string, routing_table_t> fromSys() {
    return {"Routing table not implemented for this platform", {}};
  }
}
#endif
