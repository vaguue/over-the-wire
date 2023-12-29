#pragma once

#ifdef _WIN32
#include <winsock2.h>
#include <Ws2tcpip.h>
#define SOCKET_OPT_TYPE char *
#define SOCKET_LEN_TYPE int
#else
#include <errno.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <sys/un.h>
#include <fcntl.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#define SOCKET int
#define closesocket close
#define SOCKET_OPT_TYPE void *
#define SOCKET_LEN_TYPE socklen_t
#endif

//from https://github.com/libuv/libuv/blob/v1.x/src/unix/internal.h
#if defined(_AIX) || \
    defined(__APPLE__) || \
    defined(__DragonFly__) || \
    defined(__FreeBSD__) || \
    defined(__linux__) || \
    defined(__OpenBSD__) || \
    defined(__NetBSD__)
#define USE_IOCTL 1
#else
#define USE_IOCTL 0
#endif
