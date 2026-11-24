#include "Ports.h"
#if defined(__APPLE__)
#include "macOS.cxx"
#elif defined(_WIN32)
#include "win32.cxx"
#elif defined(__linux__)
#include "linux.cxx"
#else
namespace OverTheWire::Ports {
  std::pair<std::string, open_ports_t> fromSys() {
    return {"Open ports are not implemented for this platform", {}};
  }
}
#endif
