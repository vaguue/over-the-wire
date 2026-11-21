#include <dirent.h>
#include <fstream>
#include <unordered_map>

namespace OverTheWire::Ports {

static const char* TCP_LISTEN_STATE = "0A";

struct SocketOwner {
  int64_t pid = -1;
  std::string process;
};

using owners_t = std::unordered_map<std::string, SocketOwner>;

static bool isNumber(const char* text) {
  if (*text == '\0') {
    return false;
  }

  for (const char* cur = text; *cur != '\0'; ++cur) {
    if (*cur < '0' || *cur > '9') {
      return false;
    }
  }

  return true;
}

static std::string nameOf(const std::string& pid) {
  std::ifstream comm("/proc/" + pid + "/comm");
  std::string name;
  std::getline(comm, name);
  return name;
}

static owners_t ownersByInode() {
  owners_t owners;
  DIR* proc = opendir("/proc");

  if (proc == NULL) {
    return owners;
  }

  for (dirent* process = readdir(proc); process != NULL; process = readdir(proc)) {
    if (!isNumber(process->d_name)) {
      continue;
    }

    std::string pid = process->d_name;
    std::string descriptorsPath = "/proc/" + pid + "/fd";
    DIR* descriptors = opendir(descriptorsPath.c_str());

    if (descriptors == NULL) {
      continue;
    }

    std::string name;

    for (dirent* descriptor = readdir(descriptors); descriptor != NULL; descriptor = readdir(descriptors)) {
      std::string linkPath = descriptorsPath + "/" + descriptor->d_name;
      char target[64] = {0};
      ssize_t length = readlink(linkPath.c_str(), target, sizeof(target) - 1);

      if (length <= 0) {
        continue;
      }

      std::string link(target, length);

      if (link.rfind("socket:[", 0) != 0) {
        continue;
      }

      std::string inode = link.substr(8, link.size() - 9);

      if (owners.count(inode) > 0) {
        continue;
      }

      if (name.empty()) {
        name = nameOf(pid);
      }

      owners[inode] = SocketOwner{std::stoll(pid), name};
    }

    closedir(descriptors);
  }

  closedir(proc);
  return owners;
}

static std::string addressFromHex(const std::string& hex, int family) {
  char address[INET6_ADDRSTRLEN] = {0};

  if (family == AF_INET) {
    uint32_t raw = static_cast<uint32_t>(std::stoul(hex, nullptr, 16));
    uv_inet_ntop(AF_INET, &raw, address, sizeof(address));
    return address;
  }

  uint32_t words[4] = {0};

  for (size_t i{}; i < 4; ++i) {
    words[i] = static_cast<uint32_t>(std::stoul(hex.substr(i * 8, 8), nullptr, 16));
  }

  uv_inet_ntop(AF_INET6, words, address, sizeof(address));
  return address;
}

static void readTable(const std::string& path, const std::string& protocol, int family, const owners_t& owners, open_ports_t& res) {
  std::ifstream table(path);
  std::string line;
  std::getline(table, line);

  while (std::getline(table, line)) {
    std::istringstream fields(line);
    std::string slot, local, remote, state, queues, timer, retransmits, uid, timeout, inode;

    if (!(fields >> slot >> local >> remote >> state >> queues >> timer >> retransmits >> uid >> timeout >> inode)) {
      continue;
    }

    if (protocol == "tcp" && state != TCP_LISTEN_STATE) {
      continue;
    }

    size_t separator = local.rfind(':');

    if (separator == std::string::npos) {
      continue;
    }

    std::string addressHex = local.substr(0, separator);

    if (addressHex.size() != (family == AF_INET ? 8u : 32u)) {
      continue;
    }

    OpenPort found;
    found.protocol = protocol;
    found.family = family == AF_INET ? "IPv4" : "IPv6";
    found.port = static_cast<uint32_t>(std::stoul(local.substr(separator + 1), nullptr, 16));

    if (found.port == 0) {
      continue;
    }

    found.address = addressFromHex(addressHex, family);

    auto owner = owners.find(inode);

    if (owner != owners.end()) {
      found.pid = owner->second.pid;
      found.process = owner->second.process;
    }

    res.push_back(std::move(found));
  }
}

std::pair<std::string, open_ports_t> fromSys() {
  open_ports_t res{};
  owners_t owners = ownersByInode();

  readTable("/proc/net/tcp", "tcp", AF_INET, owners, res);
  readTable("/proc/net/tcp6", "tcp", AF_INET6, owners, res);
  readTable("/proc/net/udp", "udp", AF_INET, owners, res);
  readTable("/proc/net/udp6", "udp", AF_INET6, owners, res);

  return {"", res};
}

}
