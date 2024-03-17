//https://github.com/apple-oss-distributions/network_cmds/blob/network_cmds-669/arp.tproj/arp.c

#include "macOS.hpp"

namespace OverTheWire::Arp {

static char* lladdr(struct sockaddr_dl *sdl) {
  static char buf[256];
  char* cp;
  int n, bufsize = sizeof (buf), p = 0;

  bzero(buf, sizeof (buf));
  cp = (char *)LLADDR(sdl);
  if ((n = sdl->sdl_alen) > 0) {
    while (--n >= 0) {
      p += snprintf(buf + p, bufsize - p, "%x%s", *cp++ & 0xff, n > 0 ? ":" : "");
    }
  }
  return (buf);
}

std::string save(arp_table_t& table, struct sockaddr_dl *sdl, struct sockaddr_inarp *addr, struct rt_msghdr *rtm) {
  const char *host;
  struct hostent *hp;
  char ifname[IF_NAMESIZE];
  if (if_indextoname(sdl->sdl_index, ifname) == NULL) {
    strcpy(ifname, "unknown");
  }

  auto& vec = table[ifname];

  ArpRecord rec;
  char str[INET6_ADDRSTRLEN];
  uv_inet_ntop(addr->sin_family, &addr->sin_addr, str, INET6_ADDRSTRLEN);
  rec.ipAddr = str;
  rec.hwAddr = sdl->sdl_alen ? lladdr(sdl) : "(incomplete)";
  rec.hwType = sdl->sdl_type;

  if ((rtm->rtm_flags & RTF_IFSCOPE)) {
    rec.flags.push_back("ifscope");
  }

  if (rtm->rtm_rmx.rmx_expire == 0) {
    rec.flags.push_back("permanent");
  }

  if (addr->sin_other & SIN_PROXY) {
    rec.flags.push_back("proxy");
  }

  if (rtm->rtm_addrs & RTA_NETMASK) {
    addr = (struct sockaddr_inarp *)(SA_SIZE(sdl) + (char *)sdl);
    if (addr->sin_addr.s_addr == 0xffffffff) {
      rec.flags.push_back("published");
    }
    if (addr->sin_len != 8) {
      rec.flags.push_back("weird");
    }
  }

  vec.push_back(std::move(rec));

  return "";
}

std::pair<std::string, arp_table_t> fromSys() {
  arp_table_t res{};

  int mib[6];
  size_t needed;

  char* buf;

  struct rt_msghdr* rtm;
  struct sockaddr_inarp* sin2;
  struct sockaddr_dl* sdl;
  char ifname[IF_NAMESIZE];
  int st;

  mib[0] = CTL_NET;
  mib[1] = PF_ROUTE;
  mib[2] = 0;
  //mib[3] = AF_INET;
  mib[3] = 0;
  mib[4] = NET_RT_FLAGS;
  mib[5] = RTF_LLINFO;

  if (sysctl(mib, 6, NULL, &needed, NULL, 0) < 0) {
    return {"Route sysctl estimate error", res};
  }
  if (needed == 0) {
    return {"", res};
  }

  buf = NULL;

  for (;;) {
    char* newbuf = static_cast<char*>(realloc(buf, needed));
    if (newbuf == NULL) {
      if (buf != NULL) {
        free(buf);
      }
      return {"Could not reallocate memory", res};
    }
    buf = newbuf;
    st = sysctl(mib, 6, buf, &needed, NULL, 0);
    if (st == 0 || errno != ENOMEM) {
      break;
    }
    needed += needed / 8;
  }
  if (st == -1) {
    return {"actual retrieval of routing table", res};
  }
  char* lim = buf + needed;
  for (char* next = buf; next < lim; next += rtm->rtm_msglen) {
    rtm = (struct rt_msghdr *)next;
    sin2 = (struct sockaddr_inarp *)(rtm + 1);
    sdl = (struct sockaddr_dl *)((char *)sin2 + SA_SIZE(sin2));
    auto err = save(res, sdl, sin2, rtm);
    if (err.size() > 0) {
      return { err, res };
    }
  }

  free(buf);

  return {"", res};
}

}
