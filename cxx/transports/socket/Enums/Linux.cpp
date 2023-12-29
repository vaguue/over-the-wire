Napi::Object InitSystemLocal(Napi::Env env, Napi::Object exports) {
  ENUM_VALUE(AF_UNIX);      //  Local communication                        unix(7)
  ENUM_VALUE(AF_LOCAL);     //  Synonym for AF_UNIX
  ENUM_VALUE(AF_INET);      //  IPv4 Internet protocols                    ip(7)
  ENUM_VALUE(AF_AX25);      //  Amateur radio AX.25 protocol               ax25(4)
  ENUM_VALUE(AF_IPX);       //  IPX - Novell protocols
  ENUM_VALUE(AF_APPLETALK); //  AppleTalk                                  ddp(7)
  ENUM_VALUE(AF_X25);       //  ITU-T X.25 / ISO-8208 protocol             x25(7)
  ENUM_VALUE(AF_INET6);     //  IPv6 Internet protocols                    ipv6(7)
  ENUM_VALUE(AF_DECnet);    //  DECet protocol sockets
  ENUM_VALUE(AF_KEY);       //  Key management protocol, originally
                            //  developed for usage with IPsec
  ENUM_VALUE(AF_NETLINK);   //  Kernel user interface device               netlink(7)
  ENUM_VALUE(AF_PACKET);    //  Low-level packet interface                 packet(7)
  ENUM_VALUE(AF_RDS);       //  Reliable Datagram Sockets (RDS) protocol   rds(7)

  ENUM_VALUE(AF_PPPOX);     //  Generic PPP transport layer, for setting
                            //  up L2 tunnels (L2TP and PPPoE)
  ENUM_VALUE(AF_LLC);       //  Logical link control (IEEE 802.2 LLC)
                            //  protocol
  ENUM_VALUE(AF_IB);        //  InfiniBand native addressing
  ENUM_VALUE(AF_MPLS);      //  Multiprotocol Label Switching
  ENUM_VALUE(AF_CAN);       //  Controller Area Network automotive bus
                            //  protocol
  ENUM_VALUE(AF_TIPC);      //  TIPC, "cluster domain sockets" protocol
  ENUM_VALUE(AF_BLUETOOTH); //  Bluetooth low-level socket protocol
  ENUM_VALUE(AF_ALG);       //  Interface to kernel crypto API
  ENUM_VALUE(AF_VSOCK);     //  VSOCK (originally "VMWare VSockets")       vsock(7)
                            //  protocol for hypervisor-guest
                            //  communication
  ENUM_VALUE(AF_KCM);       //  KCM (kernel connection multiplexer)
                            //  interface
  ENUM_VALUE(AF_XDP);       //  XDP (express data path) interface


  ENUM_VALUE(SOCK_STREAM);
  ENUM_VALUE(SOCK_DGRAM);
  ENUM_VALUE(SOCK_SEQPACKET);
  ENUM_VALUE(SOCK_RAW);
  ENUM_VALUE(SOCK_RDM);
  ENUM_VALUE(SOCK_PACKET);

  ENUM_VALUE(PF_UNIX);
  ENUM_VALUE(PF_LOCAL);
  ENUM_VALUE(PF_INET);
  ENUM_VALUE(PF_AX25);
  ENUM_VALUE(PF_IPX);
  ENUM_VALUE(PF_APPLETALK);
  ENUM_VALUE(PF_X25);
  ENUM_VALUE(PF_INET6);
  ENUM_VALUE(PF_DECnet);
  ENUM_VALUE(PF_KEY);

  ENUM_VALUE(PF_NETLINK);
  ENUM_VALUE(PF_PACKET);
  ENUM_VALUE(PF_RDS);

  ENUM_VALUE(PF_PPPOX);

  ENUM_VALUE(PF_LLC);

  ENUM_VALUE(PF_IB);
  ENUM_VALUE(PF_MPLS);
  ENUM_VALUE(PF_CAN);

  ENUM_VALUE(PF_TIPC);
  ENUM_VALUE(PF_BLUETOOTH);
  ENUM_VALUE(PF_ALG);
  ENUM_VALUE(PF_VSOCK);
  ENUM_VALUE(PF_RAW);


  ENUM_VALUE(PF_KCM);

  ENUM_VALUE(PF_XDP);

//setsockopt levels
  ENUM_VALUE(SOL_IP);
  ENUM_VALUE(SOL_TCP);
  ENUM_VALUE(SOL_UDP);
  ENUM_VALUE(SOL_IPV6);
  ENUM_VALUE(SOL_ICMPV6);
  ENUM_VALUE(SOL_SCTP);
  ENUM_VALUE(SOL_UDPLITE);
  ENUM_VALUE(SOL_RAW);
  ENUM_VALUE(SOL_IPX);
  ENUM_VALUE(SOL_AX25);
  ENUM_VALUE(SOL_ATALK);
  ENUM_VALUE(SOL_NETROM);
  ENUM_VALUE(SOL_ROSE);
  ENUM_VALUE(SOL_DECNET);
  ENUM_VALUE(SOL_X25);
  ENUM_VALUE(SOL_PACKET);
  ENUM_VALUE(SOL_ATM);
  ENUM_VALUE(SOL_AAL);
  ENUM_VALUE(SOL_IRDA);
  ENUM_VALUE(SOL_NETBEUI);
  ENUM_VALUE(SOL_LLC);
  ENUM_VALUE(SOL_DCCP);
  ENUM_VALUE(SOL_NETLINK);
  ENUM_VALUE(SOL_TIPC);
  ENUM_VALUE(SOL_RXRPC);
  ENUM_VALUE(SOL_PPPOL2TP);
  ENUM_VALUE(SOL_BLUETOOTH);
  ENUM_VALUE(SOL_PNPIPE);
  ENUM_VALUE(SOL_RDS);
  ENUM_VALUE(SOL_IUCV);
  ENUM_VALUE(SOL_CAIF);
  ENUM_VALUE(SOL_ALG);
  ENUM_VALUE(SOL_NFC);
  ENUM_VALUE(SOL_KCM);
  ENUM_VALUE(SOL_TLS);
  ENUM_VALUE(SOL_XDP);
  ENUM_VALUE(SOL_MPTCP);
  ENUM_VALUE(SOL_MCTP);
  ENUM_VALUE(SOL_SMC);
  ENUM_VALUE(SOL_VSOCK);

  ENUM_VALUE(IPPROTO_IP);
  ENUM_VALUE(IPPROTO_HOPOPTS);
  ENUM_VALUE(IPPROTO_ICMP);
  ENUM_VALUE(IPPROTO_IGMP);
  ENUM_VALUE(IPPROTO_IPIP);
  ENUM_VALUE(IPPROTO_TCP);
  ENUM_VALUE(IPPROTO_EGP);
  ENUM_VALUE(IPPROTO_PUP);
  ENUM_VALUE(IPPROTO_UDP);
  ENUM_VALUE(IPPROTO_IDP);
  ENUM_VALUE(IPPROTO_TP);
  ENUM_VALUE(IPPROTO_IPV6);
  ENUM_VALUE(IPPROTO_ROUTING);
  ENUM_VALUE(IPPROTO_FRAGMENT);
  ENUM_VALUE(IPPROTO_RSVP);
  ENUM_VALUE(IPPROTO_GRE);
  ENUM_VALUE(IPPROTO_ESP);
  ENUM_VALUE(IPPROTO_AH);
  ENUM_VALUE(IPPROTO_ICMPV6);
  ENUM_VALUE(IPPROTO_NONE);
  ENUM_VALUE(IPPROTO_DSTOPTS);
  ENUM_VALUE(IPPROTO_MTP);
  ENUM_VALUE(IPPROTO_ENCAP);
  ENUM_VALUE(IPPROTO_PIM);
  ENUM_VALUE(IPPROTO_COMP);
  ENUM_VALUE(IPPROTO_SCTP);
  ENUM_VALUE(IPPROTO_RAW);

  return exports;
}
