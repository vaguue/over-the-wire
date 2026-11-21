#include <tcpmib.h>
#include <udpmib.h>

namespace OverTheWire::Ports {

static std::string nameOf(DWORD pid) {
  HANDLE process = OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION, FALSE, pid);

  if (process == NULL) {
    return "";
  }

  char path[MAX_PATH] = {0};
  DWORD length = MAX_PATH;
  std::string name;

  if (QueryFullProcessImageNameA(process, 0, path, &length)) {
    name = std::string(path, length);
    size_t separator = name.find_last_of("\\/");

    if (separator != std::string::npos) {
      name = name.substr(separator + 1);
    }
  }

  CloseHandle(process);
  return name;
}

static OpenPort describe(const char* protocol, int family, const void* address, DWORD port, DWORD pid) {
  char text[INET6_ADDRSTRLEN] = {0};
  uv_inet_ntop(family, address, text, sizeof(text));

  OpenPort found;
  found.protocol = protocol;
  found.family = family == AF_INET ? "IPv4" : "IPv6";
  found.address = text;
  found.port = ntohs(static_cast<u_short>(port));
  found.pid = pid;
  found.process = nameOf(pid);
  return found;
}

template <typename Table, typename Fetch>
static bool fetchTable(std::vector<char>& buffer, Fetch fetch) {
  DWORD size = 0;
  DWORD status = fetch(nullptr, &size);

  while (status == ERROR_INSUFFICIENT_BUFFER) {
    buffer.resize(size);
    status = fetch(reinterpret_cast<Table*>(buffer.data()), &size);
  }

  return status == NO_ERROR && buffer.size() >= sizeof(Table);
}

std::pair<std::string, open_ports_t> fromSys() {
  open_ports_t res{};
  std::vector<char> buffer;

  bool fetched = fetchTable<MIB_TCPTABLE_OWNER_PID>(buffer, [](MIB_TCPTABLE_OWNER_PID* table, DWORD* size) {
    return GetExtendedTcpTable(table, size, FALSE, AF_INET, TCP_TABLE_OWNER_PID_LISTENER, 0);
  });

  if (fetched) {
    auto table = reinterpret_cast<MIB_TCPTABLE_OWNER_PID*>(buffer.data());

    for (DWORD i = 0; i < table->dwNumEntries; ++i) {
      const auto& row = table->table[i];
      res.push_back(describe("tcp", AF_INET, &row.dwLocalAddr, row.dwLocalPort, row.dwOwningPid));
    }
  }

  buffer.clear();

  fetched = fetchTable<MIB_TCP6TABLE_OWNER_PID>(buffer, [](MIB_TCP6TABLE_OWNER_PID* table, DWORD* size) {
    return GetExtendedTcpTable(table, size, FALSE, AF_INET6, TCP_TABLE_OWNER_PID_LISTENER, 0);
  });

  if (fetched) {
    auto table = reinterpret_cast<MIB_TCP6TABLE_OWNER_PID*>(buffer.data());

    for (DWORD i = 0; i < table->dwNumEntries; ++i) {
      const auto& row = table->table[i];
      res.push_back(describe("tcp", AF_INET6, row.ucLocalAddr, row.dwLocalPort, row.dwOwningPid));
    }
  }

  buffer.clear();

  fetched = fetchTable<MIB_UDPTABLE_OWNER_PID>(buffer, [](MIB_UDPTABLE_OWNER_PID* table, DWORD* size) {
    return GetExtendedUdpTable(table, size, FALSE, AF_INET, UDP_TABLE_OWNER_PID, 0);
  });

  if (fetched) {
    auto table = reinterpret_cast<MIB_UDPTABLE_OWNER_PID*>(buffer.data());

    for (DWORD i = 0; i < table->dwNumEntries; ++i) {
      const auto& row = table->table[i];
      res.push_back(describe("udp", AF_INET, &row.dwLocalAddr, row.dwLocalPort, row.dwOwningPid));
    }
  }

  buffer.clear();

  fetched = fetchTable<MIB_UDP6TABLE_OWNER_PID>(buffer, [](MIB_UDP6TABLE_OWNER_PID* table, DWORD* size) {
    return GetExtendedUdpTable(table, size, FALSE, AF_INET6, UDP_TABLE_OWNER_PID, 0);
  });

  if (fetched) {
    auto table = reinterpret_cast<MIB_UDP6TABLE_OWNER_PID*>(buffer.data());

    for (DWORD i = 0; i < table->dwNumEntries; ++i) {
      const auto& row = table->table[i];
      res.push_back(describe("udp", AF_INET6, row.ucLocalAddr, row.dwLocalPort, row.dwOwningPid));
    }
  }

  return {"", res};
}

}
