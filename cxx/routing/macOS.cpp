// https://github.com/apple-oss-distributions/network_cmds/blob/main/netstat.tproj/route.c

#include "macOS.hpp"

namespace OverTheWire::Routing {

std::string routename4(uint32_t in) {
  char *cp;
  std::string line;
  line.resize(MAXHOSTNAMELEN);
  struct hostent *hp;

  cp = 0;
  if (cp) {
    strlcpy(line.data(), cp, line.size());
  } else {
    in = ntohl(in);
    return (std::stringstream{} << C(in >> 24) << "." << C(in >> 16) << "." << C(in >> 8) << "." << C(in)).str();
  }
  return (line);
}

uint32_t masklen4(uint32_t in) {
  return __builtin_popcount(ntohl(in));
}

static std::string routename6(struct sockaddr_in6 *sa6) {
  std::string line;
  line.resize(MAXHOSTNAMELEN);
  int flag = NI_WITHSCOPEID;
  /* use local variable for safety */
  struct sockaddr_in6 sa6_local = {sizeof(sa6_local), AF_INET6, };

  sa6_local.sin6_addr = sa6->sin6_addr;
  sa6_local.sin6_scope_id = sa6->sin6_scope_id;

  flag |= NI_NUMERICHOST;

  getnameinfo((struct sockaddr *)&sa6_local, sa6_local.sin6_len,
        line.data(), line.size(), NULL, 0, flag);

  return std::string{line.c_str()};
}

static uint32_t masklen6(struct sockaddr_in6 *sa6, struct sockaddr *sam) {
  u_char *lim;
  uint32_t masklen, illegal = 0, flag = NI_WITHSCOPEID;
  struct in6_addr *mask = sam ? &((struct sockaddr_in6 *)sam)->sin6_addr : 0;

  if (sam && sam->sa_len == 0) {
    masklen = 0;
  } else if (mask) {
    u_char *p = (u_char *)mask;
    for (masklen = 0, lim = p + 16; p < lim; p++) {
      switch (*p) {
       case 0xff:
         masklen += 8;
         break;
       case 0xfe:
         masklen += 7;
         break;
       case 0xfc:
         masklen += 6;
         break;
       case 0xf8:
         masklen += 5;
         break;
       case 0xf0:
         masklen += 4;
         break;
       case 0xe0:
         masklen += 3;
         break;
       case 0xc0:
         masklen += 2;
         break;
       case 0x80:
         masklen += 1;
         break;
       case 0x00:
         break;
       default:
         illegal ++;
         break;
      }
    }
    if (illegal) {
      //fprintf(stderr, "illegal prefixlen\n");
    }
  } else {
    masklen = 128;
  }
  if (masklen == 0 && IN6_IS_ADDR_UNSPECIFIED(&sa6->sin6_addr))
    return 0;

  flag |= NI_NUMERICHOST;

  return masklen;
}

static std::tuple<std::string, std::string, uint32_t> pSockaddr(struct sockaddr *sa, struct sockaddr *mask, int flags) {
  char workbuf[128]; 
  char* cplim;
  char* cp = workbuf;

  std::string str;
  std::string family = "AF_UNSPEC";

  switch(sa->sa_family) {
    case AF_INET: {
      struct sockaddr_in *sin = (struct sockaddr_in *)sa;
      struct sockaddr_in *min = (struct sockaddr_in *)mask;

      if ((sin->sin_addr.s_addr == INADDR_ANY) &&
        mask &&
        (ntohl(((struct sockaddr_in *)mask)->sin_addr.s_addr) == 0L || mask->sa_len == 0)) {
        return {"AF_INET", "default", 0};
      }
      else if (flags & RTF_HOST) {
        return {"AF_INET", routename4(sin->sin_addr.s_addr), 32};
      }
      else if (min) {
        return {"AF_INET", routename4(sin->sin_addr.s_addr), masklen4(min->sin_addr.s_addr)};
      }
      else {
        return {"AF_INET", routename4(sin->sin_addr.s_addr), 0};
      }
      break;
    }

    case AF_INET6: {
      struct sockaddr_in6 *sa6 = (struct sockaddr_in6 *)sa;
      struct in6_addr *in6 = &sa6->sin6_addr;

      /*
       * XXX: This is a special workaround for KAME kernels.
       * sin6_scope_id field of SA should be set in the future.
       */
      if (IN6_IS_ADDR_LINKLOCAL(in6) ||
          IN6_IS_ADDR_MC_NODELOCAL(in6) ||
          IN6_IS_ADDR_MC_LINKLOCAL(in6)) {
          /* XXX: override is ok? */
          sa6->sin6_scope_id = (u_int32_t)ntohs(*(u_short *)&in6->s6_addr[2]);
          *(u_short *)&in6->s6_addr[2] = 0;
      }

      if (flags & RTF_HOST) {
        return {"AF_INET6", routename6(sa6), 128};
      }
      else if (mask) {
        return {"AF_INET6", routename6(sa6), masklen6(sa6, mask)};
      }
      else {
        return {"AF_INET6", routename6(sa6), masklen6(sa6, NULL)};
      }
      break;
    }

    case AF_LINK: {
      family = "AF_LINK";
      struct sockaddr_dl *sdl = (struct sockaddr_dl *)sa;

      if (sdl->sdl_nlen == 0 && sdl->sdl_alen == 0 &&
          sdl->sdl_slen == 0) {
        (void) snprintf(workbuf, sizeof(workbuf), "link#%d", sdl->sdl_index);
      } else {
        switch (sdl->sdl_type) {

        case IFT_ETHER: {
          int i;
          u_char *lla = (u_char *)sdl->sdl_data +
              sdl->sdl_nlen;

          cplim = "";
          for (i = 0; i < sdl->sdl_alen; i++, lla++) {
            cp += snprintf(cp, sizeof(workbuf) - (cp - workbuf), "%s%x", cplim, *lla);
            cplim = ":";
          }
          cp = workbuf;
          break;
            }

        default:
          cp = link_ntoa(sdl);
          break;
        }
      }
      break;
        }

    default: {
      u_char *s = (u_char *)sa->sa_data, *slim;

      slim =  sa->sa_len + (u_char *) sa;
      cplim = cp + sizeof(workbuf) - 6;
      cp += snprintf(cp, sizeof(workbuf) - (cp - workbuf), "(%d)", sa->sa_family);
      while (s < slim && cp < cplim) {
        cp += snprintf(cp, sizeof(workbuf) - (cp - workbuf), " %02x", *s++);
        if (s < slim)
            cp += snprintf(cp, sizeof(workbuf) - (cp - workbuf), "%02x", *s++);
      }
      cp = workbuf;
    }
  }

  return {family, cp, 0};
}

static void getRtaddrs(int addrs, struct sockaddr *sa, struct sockaddr **rti_info) {
  int i;

  for (i = 0; i < RTAX_MAX; i++) {
    if (addrs & (1 << i)) {
      rti_info[i] = sa;
      sa = (struct sockaddr *)(ROUNDUP(sa->sa_len) + (char *)sa);
    } else {
      rti_info[i] = NULL;
    }
  }
}

template<typename F>
std::vector<std::string> pFlags(F f) {
  std::vector<std::string> flags;
  struct bits* p = bits;

  for (; p->b_mask; ++p) {
    if (p->b_mask & f) {
      flags.emplace_back(&p->b_val);
    }
  }
  return flags;
}

void save(routing_table_t& table, struct rt_msghdr2* rtm) {
  struct sockaddr *sa = (struct sockaddr *)(rtm + 1);
  struct sockaddr *rti_info[RTAX_MAX];
  int fam = 0;
  u_short lastindex = 0xffff;
  char ifname[IFNAMSIZ + 1];
  sa_u addr, mask;

  /*
   * Don't print protocol-cloned routes unless -a.
   */
  if ((rtm->rtm_flags & RTF_WASCLONED) && (rtm->rtm_parentflags & RTF_PRCLONING)) {
    return;
  }

  fam = sa->sa_family;
  getRtaddrs(rtm->rtm_addrs, sa, rti_info);
  bzero(&addr, sizeof(addr));
  if ((rtm->rtm_addrs & RTA_DST)) {
    bcopy(rti_info[RTAX_DST], &addr, rti_info[RTAX_DST]->sa_len);
  }

  bzero(&mask, sizeof(mask));

  if ((rtm->rtm_addrs & RTA_NETMASK)) {
    bcopy(rti_info[RTAX_NETMASK], &mask, rti_info[RTAX_NETMASK]->sa_len);
  }

  RoutingRecord rec;

  std::string tmp;

  std::tie(tmp, rec.destination, rec.prefixLength) = pSockaddr(&addr.u_sa, &mask.u_sa, rtm->rtm_flags);

  std::tie(rec.family, rec.gateway, tmp) = pSockaddr(rti_info[RTAX_GATEWAY], NULL, RTF_HOST);

  rec.flags = pFlags(rtm->rtm_flags);

  rec.metric = rtm->rtm_rmx.rmx_hopcount;

  if (rtm->rtm_index != lastindex) {
    if_indextoname(rtm->rtm_index, ifname);
    lastindex = rtm->rtm_index;
  }

  std::string iface = ifname;

  table[iface].push_back(std::move(rec));
}

std::pair<std::string, routing_table_t> fromSys() {
  routing_table_t res{};
  size_t extra_space;
  size_t needed;
  int mib[6];
  char *buf, *next, *lim;
  struct rt_msghdr2 *rtm;
  int tryN = 1;

again:
  mib[0] = CTL_NET;
  mib[1] = PF_ROUTE;
  mib[2] = 0;
  mib[3] = 0;
  mib[4] = NET_RT_DUMP2;
  mib[5] = 0;
  if (sysctl(mib, 6, NULL, &needed, NULL, 0) < 0) {
    return {"sysctl: net.route.0.0.dump estimate", res};
  }
  /* allocate extra space in case the table grows */
  extra_space = needed / 2;
  if (needed <= (SIZE_MAX - extra_space)) {
    needed += extra_space;
  }
  if ((buf = (char*)malloc(needed)) == 0) {
    return {"malloc", res};
  }
  if (sysctl(mib, 6, buf, &needed, NULL, 0) < 0) {
#define MAX_TRIES  10
    if (errno == ENOMEM && tryN < MAX_TRIES) {
      /* the buffer we provided was too small, try again */
      free(buf);
      tryN++;
      goto again;
    }
    return {"sysctl: net.route.0.0.dump", res};
  }
  lim  = buf + needed;
  for (next = buf; next < lim; next += rtm->rtm_msglen) {
    rtm = (struct rt_msghdr2 *)next;
    save(res, rtm);
  }

  return {"", res};
}

}
