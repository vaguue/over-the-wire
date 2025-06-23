//https://learn.microsoft.com/en-us/windows/win32/api/netioapi/nf-netioapi-getipnettable2

#include "win32.hpp"

namespace OverTheWire::Routing {

std::pair<std::string, routing_table_t> fromSys() {
  routing_table_t res{};

  DWORD retval;
  MIB_IPFORWARD_TABLE2 *routes = NULL;
  MIB_IPFORWARD_ROW2 *route;

  retval = GetIpForwardTable2(AF_UNSPEC, &routes);
  if (retval != ERROR_SUCCESS) {
    return {"GetIpForwardTable2 failed", res};
  }

  for (int idx = 0; idx < routes->NumEntries; idx++) {
    route = routes->Table + idx;

    WCHAR wname[IF_MAX_STRING_SIZE + 1] = L"";
    ULONG wlen = IF_MAX_STRING_SIZE;
    if (ConvertInterfaceLuidToNameW(&route->InterfaceLuid, wname, wlen) != NO_ERROR)
        continue;

    char iface[IF_MAX_STRING_SIZE * 2 + 1];
    WideCharToMultiByte(CP_UTF8, 0, wname, -1, iface, sizeof(iface), NULL, NULL);

    auto& vec = res[iface];

    RoutingRecord rec;

    char str[INET6_ADDRSTRLEN];
    auto& ipPrefix = route->DestinationPrefix;

    uv_inet_ntop(
        ipPrefix.Prefix.si_family,
        ipPrefix.Prefix.si_family == AF_INET6
          ? (const void*)&ipPrefix.Prefix.Ipv6.sin6_addr
          : (const void*)&ipPrefix.Prefix.Ipv4.sin_addr,
        str, INET6_ADDRSTRLEN);

    rec.prefixLength = ipPrefix.PrefixLength;

    rec.destination = str;

    auto& nextHop = route->NextHop;

    if (nextHop.si_family == AF_INET) {
      rec.family = "AF_INET";
    }
    else if (nextHop.si_family == AF_INET6) {
      rec.family = "AF_INET6";
    }
    else if (nextHop.si_family == AF_UNSPEC) {
      rec.family = "AF_UNSPEC";
    }

    bool onLink = (nextHop.si_family == AF_UNSPEC);
    if (!onLink)
        uv_inet_ntop(nextHop.si_family,
          nextHop.si_family == AF_INET6
            ? (const void*)&nextHop.Ipv6.sin6_addr
            : (const void*)&nextHop.Ipv4.sin_addr,
        str, INET6_ADDRSTRLEN);

    rec.gateway = str;

    rec.metric = route->Metric;

    vec.push_back(rec);
  }

  FreeMibTable(routes);
  return {"", res};
}

}
