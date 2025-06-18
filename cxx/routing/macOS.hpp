#pragma once

#include <iomanip>

#include <stdint.h>
#include <sys/param.h>
#include <sys/socket.h>
#include <sys/time.h>
#include <sys/errno.h>

#include <net/if.h>
#include <net/if_var.h>
#include <net/if_dl.h>
#include <net/if_types.h>
#include <net/route.h>

#include <netinet/in.h>

#include <sys/sysctl.h>

#include <arpa/inet.h>
#include <netdb.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <err.h>
#include <time.h>

#define ROUNDUP(a) \
       ((a) > 0 ? (1 + (((a) - 1) | (sizeof(uint32_t) - 1))) : sizeof(uint32_t))
#define ADVANCE(x, n) (x += ROUNDUP((n)->sa_len))

struct bits {
  uint32_t  b_mask;
  char  b_val;
} bits[] = {
  { RTF_UP,  'U' },
  { RTF_GATEWAY,  'G' },
  { RTF_HOST,  'H' },
  { RTF_REJECT,  'R' },
  { RTF_DYNAMIC,  'D' },
  { RTF_MODIFIED,  'M' },
  { RTF_MULTICAST,'m' },
  { RTF_DONE,  'd' }, /* Completed -- for routing messages only */
  { RTF_CLONING,  'C' },
  { RTF_XRESOLVE,  'X' },
  { RTF_LLINFO,  'L' },
  { RTF_STATIC,  'S' },
  { RTF_PROTO1,  '1' },
  { RTF_PROTO2,  '2' },
  { RTF_WASCLONED,'W' },
  { RTF_PRCLONING,'c' },
  { RTF_PROTO3,  '3' },
  { RTF_BLACKHOLE,'B' },
  { RTF_BROADCAST,'b' },
  { RTF_IFSCOPE,  'I' },
  { RTF_IFREF,  'i' },
  { RTF_PROXY,  'Y' },
  { RTF_ROUTER,  'r' },
#ifdef RTF_GLOBAL
  { RTF_GLOBAL,  'g' },
#endif /* RTF_GLOBAL */
  { 0 }
};

typedef union {
  uint32_t dummy;    /* Helps align structure. */
  struct  sockaddr u_sa;
  u_short  u_data[128];
} sa_u;

#define C(x)  ((x) & 0xff)

/* column widths; each followed by one space */
#define	WID_DST(af) \
((af) == AF_INET6 ? 39 : 18)
#define	WID_GW(af) \
	((af) == AF_INET6 ? 39 : 18)
#define	WID_RT_IFA(af) \
	((af) == AF_INET6 ? 39 : 18)
#define	WID_IF(af)	14
