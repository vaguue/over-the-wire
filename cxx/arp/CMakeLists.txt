set(ARP_SRC
  "${CMAKE_CURRENT_SOURCE_DIR}/Arp.cxx"
  "${CMAKE_CURRENT_SOURCE_DIR}/Platform.cxx"
)

set(ARP_HDR
  "${CMAKE_CURRENT_SOURCE_DIR}/Arp.h"
)

source_group("Source Files\\Arp" FILES ${ARP_SRC})
source_group("Header Files\\Arp" FILES ${ARP_HDR})

target_sources(${PROJECT_NAME} PRIVATE ${ARP_SRC} ${ARP_HDR})
