//https://learn.microsoft.com/en-us/windows/win32/api/netioapi/nf-netioapi-getipnettable2

#include "win32.hpp"

namespace OverTheWire::Arp {

std::pair<std::string, arp_table_t> fromSys() {
  arp_table_t res{};

  PMIB_IPNET_TABLE2 pipTable = NULL;

  auto status = GetIpNetTable2(AF_UNSPEC, &pipTable);
  if (status != NO_ERROR) {
    return {"GetIpNetTable returned error" + std::to_string(status), res};
  }

  for (int i = 0; (unsigned) i < pipTable->NumEntries; ++i) {
    char ifname[IF_NAMESIZE];
    if (if_indextoname(pipTable->Table[i].InterfaceIndex, ifname) == NULL) {
      strcpy(ifname, "unknown");
    }
    auto& vec = res[ifname];

    ArpRecord rec;

    char str[INET6_ADDRSTRLEN];
    uv_inet_ntop(
        pipTable->Table[i].Address.si_family, 
        pipTable->Table[i].Address.si_family == AF_INET6 ? 
          (const void*)(&pipTable->Table[i].Address.Ipv6) : 
          (const void*)(&pipTable->Table[i].Address.Ipv4), 
        str, INET6_ADDRSTRLEN);

    rec.ipAddr = str;
    std::stringstream ss;
    ss << std::hex;
    for (int j = 0; j < pipTable->Table[i].PhysicalAddressLength; j++) {
      if (j) {
        ss << ":";
      }
      ss << (int)pipTable->Table[i].PhysicalAddress[j];
    }

    rec.hwAddr = ss.str();
    rec.hwType = pipTable->Table[i].InterfaceLuid.Info.IfType;

    switch (pipTable->Table[i].State) {
      case NlnsUnreachable:
        rec.flags.push_back("NlnsUnreachable");
        break;
      case NlnsIncomplete:
        rec.flags.push_back("NlnsIncomplete");
        break;
      case NlnsProbe:
        rec.flags.push_back("NlnsProbe");
        break;
      case NlnsDelay:
        rec.flags.push_back("NlnsDelay");
        break;
      case NlnsStale:
        rec.flags.push_back("NlnsStale");
        break;
      case NlnsReachable:
        rec.flags.push_back("NlnsReachable");
        break;
      case NlnsPermanent:
        rec.flags.push_back("NlnsPermanent");
        break;
      default:
        rec.flags.push_back("Unknown");
        break;
    }

    vec.push_back(std::move(rec));
  }

  return {"", res};
}

}
