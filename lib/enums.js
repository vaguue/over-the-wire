const { LinkLayerType } = require('./bindings');

/*
 * @typedef LinkLayerType
 * @property {number} LINKTYPE_NULL
 * @property {number} LINKTYPE_ETHERNET
 * @property {number} LINKTYPE_AX25
 * @property {number} LINKTYPE_IEEE802_5
 * @property {number} LINKTYPE_ARCNET_BSD
 * @property {number} LINKTYPE_SLIP
 * @property {number} LINKTYPE_PPP
 * @property {number} LINKTYPE_FDDI
 * @property {number} LINKTYPE_DLT_RAW1
 * @property {number} LINKTYPE_DLT_RAW2
 * @property {number} LINKTYPE_PPP_HDLC
 * @property {number} LINKTYPE_PPP_ETHER
 * @property {number} LINKTYPE_ATM_RFC1483
 * @property {number} LINKTYPE_RAW
 * @property {number} LINKTYPE_C_HDLC
 * @property {number} LINKTYPE_IEEE802_11
 * @property {number} LINKTYPE_FRELAY
 * @property {number} LINKTYPE_LOOP
 * @property {number} LINKTYPE_LINUX_SLL
 * @property {number} LINKTYPE_LTALK
 * @property {number} LINKTYPE_PFLOG
 * @property {number} LINKTYPE_IEEE802_11_PRISM
 * @property {number} LINKTYPE_IP_OVER_FC
 * @property {number} LINKTYPE_SUNATM
 * @property {number} LINKTYPE_IEEE802_11_RADIOTAP
 * @property {number} LINKTYPE_ARCNET_LINUX
 * @property {number} LINKTYPE_APPLE_IP_OVER_IEEE1394
 * @property {number} LINKTYPE_MTP2_WITH_PHDR
 * @property {number} LINKTYPE_MTP2
 * @property {number} LINKTYPE_MTP3
 * @property {number} LINKTYPE_SCCP
 * @property {number} LINKTYPE_DOCSIS
 * @property {number} LINKTYPE_LINUX_IRDA
 * @property {number} LINKTYPE_USER0
 * @property {number} LINKTYPE_USER1
 * @property {number} LINKTYPE_USER2
 * @property {number} LINKTYPE_USER3
 * @property {number} LINKTYPE_USER4
 * @property {number} LINKTYPE_USER5
 * @property {number} LINKTYPE_USER6
 * @property {number} LINKTYPE_USER7
 * @property {number} LINKTYPE_USER8
 * @property {number} LINKTYPE_USER9
 * @property {number} LINKTYPE_USER10
 * @property {number} LINKTYPE_USER11
 * @property {number} LINKTYPE_USER12
 * @property {number} LINKTYPE_USER13
 * @property {number} LINKTYPE_USER14
 * @property {number} LINKTYPE_USER15
 * @property {number} LINKTYPE_IEEE802_11_AVS
 * @property {number} LINKTYPE_BACNET_MS_TP
 * @property {number} LINKTYPE_PPP_PPPD
 * @property {number} LINKTYPE_GPRS_LLC
 * @property {number} LINKTYPE_GPF_T
 * @property {number} LINKTYPE_GPF_F
 * @property {number} LINKTYPE_LINUX_LAPD
 * @property {number} LINKTYPE_BLUETOOTH_HCI_H4
 * @property {number} LINKTYPE_USB_LINUX
 * @property {number} LINKTYPE_PPI
 * @property {number} LINKTYPE_IEEE802_15_4
 * @property {number} LINKTYPE_SITA
 * @property {number} LINKTYPE_ERF
 * @property {number} LINKTYPE_BLUETOOTH_HCI_H4_WITH_PHDR
 * @property {number} LINKTYPE_AX25_KISS
 * @property {number} LINKTYPE_LAPD
 * @property {number} LINKTYPE_PPP_WITH_DIR
 * @property {number} LINKTYPE_C_HDLC_WITH_DIR
 * @property {number} LINKTYPE_FRELAY_WITH_DIR
 * @property {number} LINKTYPE_IPMB_LINUX
 * @property {number} LINKTYPE_IEEE802_15_4_NONASK_PHY
 * @property {number} LINKTYPE_USB_LINUX_MMAPPED
 * @property {number} LINKTYPE_FC_2
 * @property {number} LINKTYPE_FC_2_WITH_FRAME_DELIMS
 * @property {number} LINKTYPE_IPNET
 * @property {number} LINKTYPE_CAN_SOCKETCAN
 * @property {number} LINKTYPE_IPV4
 * @property {number} LINKTYPE_IPV6
 * @property {number} LINKTYPE_IEEE802_15_4_NOFCS
 * @property {number} LINKTYPE_DBUS
 * @property {number} LINKTYPE_DVB_CI
 * @property {number} LINKTYPE_MUX27010
 * @property {number} LINKTYPE_STANAG_5066_D_PDU
 * @property {number} LINKTYPE_NFLOG
 * @property {number} LINKTYPE_NETANALYZER
 * @property {number} LINKTYPE_NETANALYZER_TRANSPARENT
 * @property {number} LINKTYPE_IPOIB
 * @property {number} LINKTYPE_MPEG_2_TS
 * @property {number} LINKTYPE_NG40
 * @property {number} LINKTYPE_NFC_LLCP
 * @property {number} LINKTYPE_INFINIBAND
 * @property {number} LINKTYPE_SCTP
 * @property {number} LINKTYPE_USBPCAP
 * @property {number} LINKTYPE_RTAC_SERIAL
 * @property {number} LINKTYPE_BLUETOOTH_LE_LL
 * @property {number} LINKTYPE_NETLINK
 * @property {number} LINKTYPE_BLUETOOTH_LINUX_MONITOR
 * @property {number} LINKTYPE_BLUETOOTH_BREDR_BB
 * @property {number} LINKTYPE_BLUETOOTH_LE_LL_WITH_PHDR
 * @property {number} LINKTYPE_PROFIBUS_DL
 * @property {number} LINKTYPE_PKTAP
 * @property {number} LINKTYPE_EPON
 * @property {number} LINKTYPE_IPMI_HPM_2
 * @property {number} LINKTYPE_ZWAVE_R1_R2
 * @property {number} LINKTYPE_ZWAVE_R3
 * @property {number} LINKTYPE_WATTSTOPPER_DLM
 * @property {number} LINKTYPE_ISO_14443
 * @property {number} LINKTYPE_LINUX_SLL2
 */

/*
 * @type {LinkLayerType}
 */
LinkLayerType;

module.exports = { LinkLayerType };
