//https://learn.microsoft.com/en-us/windows/win32/api/netioapi/nf-netioapi-getipnettable2

#include "Sys.hpp"
#include <stdio.h>
#include <stdlib.h>

#include "Routing.hpp"

namespace OverTheWire::Routing {

std::pair<std::string, routing_table_t> fromSys() {
  routing_table_t res{};

  DWORD retval;
  MIB_IPFORWARD_TABLE2 *routes = NULL;
  MIB_IPFORWARD_ROW2 *route;

  retval = GetIpForwardTable2(AF_INET, &routes);
  if (retval != ERROR_SUCCESS) {
    return {"GetIpForwardTable2 failed", res};
  }

  for (int idx = 0; idx < routes->NumEntries; idx++) {
    route = routes->Table + idx;

    std::string iface;
    iface.resize(IF_MAX_STRING_SIZE + 1);

    DWORD dwSize = IF_MAX_STRING_SIZE + 1;
    DWORD dwRetVal = ConvertInterfaceLuidToNameW(&route->InterfaceLuid, (PWSTR)iface.data(), iface.size());

    auto& vec = res[iface];

    RoutingRecord rec;

    char str[INET6_ADDRSTRLEN];
    auto& ipPrefix = route->DestinationPrefix;

    uv_inet_ntop(
        ipPrefix.Prefix.si_family, 
        ipPrefix.Prefix.si_family == AF_INET6 ? 
          (const void*)(&ipPrefix.Prefix.Ipv6) : 
          (const void*)(&ipPrefix.Prefix.Ipv4), 
        str, INET6_ADDRSTRLEN);

    rec.destination = str;

    auto& nextHop = route->NextHop;

    uv_inet_ntop(
        nextHop.si_family, 
        nextHop.si_family == AF_INET6 ? 
          (const void*)(&nextHop.Ipv6) : 
          (const void*)(&nextHop.Ipv4), 
        str, INET6_ADDRSTRLEN);

    rec.gateway = str;

    vec.push_back(rec);
  }

  return {"", res};
}

}
