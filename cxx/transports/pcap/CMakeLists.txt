set(PCAP_SRC
  "${CMAKE_CURRENT_SOURCE_DIR}/Pcap.cpp"
)

set(PCAP_HDR
  "${CMAKE_CURRENT_SOURCE_DIR}/Pcap.hpp"
)

source_group("Source Files\\Pcap" FILES ${PCAP_SRC})
source_group("Header Files\\Pcap" FILES ${PCAP_HDR})

target_sources(${PROJECT_NAME} PRIVATE ${PCAP_SRC} ${PCAP_HDR})
