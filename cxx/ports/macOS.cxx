#include <libproc.h>
#include <sys/proc_info.h>
#include <netinet/in.h>
#include <netinet/tcp_fsm.h>

namespace OverTheWire::Ports {

static std::vector<pid_t> everyPid() {
  int bytes = proc_listpids(PROC_ALL_PIDS, 0, NULL, 0);

  if (bytes <= 0) {
    return {};
  }

  std::vector<pid_t> pids(bytes / sizeof(pid_t) + 16);
  bytes = proc_listpids(PROC_ALL_PIDS, 0, pids.data(), static_cast<int>(pids.size() * sizeof(pid_t)));

  if (bytes <= 0) {
    return {};
  }

  pids.resize(bytes / sizeof(pid_t));
  return pids;
}

static std::vector<proc_fdinfo> descriptorsOf(pid_t pid) {
  int bytes = proc_pidinfo(pid, PROC_PIDLISTFDS, 0, NULL, 0);

  if (bytes <= 0) {
    return {};
  }

  std::vector<proc_fdinfo> descriptors(bytes / sizeof(proc_fdinfo) + 8);
  bytes = proc_pidinfo(pid, PROC_PIDLISTFDS, 0, descriptors.data(), static_cast<int>(descriptors.size() * sizeof(proc_fdinfo)));

  if (bytes <= 0) {
    return {};
  }

  descriptors.resize(bytes / sizeof(proc_fdinfo));
  return descriptors;
}

static std::string nameOf(pid_t pid) {
  char name[2 * MAXCOMLEN + 1] = {0};
  proc_name(pid, name, sizeof(name));
  return name;
}

static bool describe(const socket_fdinfo& info, OpenPort& found) {
  const socket_info& socket = info.psi;
  const in_sockinfo* endpoint = nullptr;

  if (socket.soi_family != AF_INET && socket.soi_family != AF_INET6) {
    return false;
  }

  if (socket.soi_kind == SOCKINFO_TCP) {
    if (socket.soi_proto.pri_tcp.tcpsi_state != TSI_S_LISTEN) {
      return false;
    }

    endpoint = &socket.soi_proto.pri_tcp.tcpsi_ini;
    found.protocol = "tcp";
  }
  else if (socket.soi_kind == SOCKINFO_IN && socket.soi_protocol == IPPROTO_UDP) {
    endpoint = &socket.soi_proto.pri_in;
    found.protocol = "udp";
  }
  else {
    return false;
  }

  found.port = ntohs(static_cast<uint16_t>(endpoint->insi_lport));

  if (found.port == 0) {
    return false;
  }

  char address[INET6_ADDRSTRLEN] = {0};

  if (socket.soi_family == AF_INET) {
    uv_inet_ntop(AF_INET, &endpoint->insi_laddr.ina_46.i46a_addr4, address, sizeof(address));
    found.family = "IPv4";
  }
  else {
    uv_inet_ntop(AF_INET6, &endpoint->insi_laddr.ina_6, address, sizeof(address));
    found.family = "IPv6";
  }

  found.address = address;
  return true;
}

std::pair<std::string, open_ports_t> fromSys() {
  open_ports_t res{};

  for (pid_t pid : everyPid()) {
    if (pid <= 0) {
      continue;
    }

    std::string name;

    for (const proc_fdinfo& descriptor : descriptorsOf(pid)) {
      if (descriptor.proc_fdtype != PROX_FDTYPE_SOCKET) {
        continue;
      }

      socket_fdinfo info;
      int bytes = proc_pidfdinfo(pid, descriptor.proc_fd, PROC_PIDFDSOCKETINFO, &info, sizeof(info));

      if (bytes < static_cast<int>(sizeof(info))) {
        continue;
      }

      OpenPort found;

      if (!describe(info, found)) {
        continue;
      }

      if (name.empty()) {
        name = nameOf(pid);
      }

      found.pid = pid;
      found.process = name;
      res.push_back(std::move(found));
    }
  }

  return {"", res};
}

}
