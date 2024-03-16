set(ARP_SRC
  "${CMAKE_CURRENT_SOURCE_DIR}/Arp.cpp"
  "${CMAKE_CURRENT_SOURCE_DIR}/Platform.cpp"
)

set(ARP_HDR
  "${CMAKE_CURRENT_SOURCE_DIR}/Arp.hpp"
)

source_group("Source Files\\Arp" FILES ${ARP_SRC})
source_group("Header Files\\Arp" FILES ${ARP_HDR})

target_sources(${PROJECT_NAME} PRIVATE ${ARP_SRC} ${ARP_HDR})
