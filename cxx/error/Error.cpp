#include "Error.hpp"

namespace OverTheWire {

#ifdef _WIN32
static thread_local char errbuf[1024];
#endif
std::string getSystemError() {
#ifdef _WIN32
  if (FormatMessage(FORMAT_MESSAGE_FROM_SYSTEM, 0, WSAGetLastError(), 0, errbuf, 1024, NULL)) {
    return std::string(errbuf);
  } 
  else {
    strcpy(errbuf, "Unknown error");
    return std::string(errbuf);
  }
#else
  return std::string(strerror(errno));
#endif
}

std::string getLibuvError(int code) {
  return std::string(uv_strerror(code));
}

}
