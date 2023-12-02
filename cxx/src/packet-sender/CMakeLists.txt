set(PACKET_SENDER_SRC
  "${CMAKE_CURRENT_SOURCE_DIR}/PacketSender.cpp"
)

set(PACKET_SENDER_HDR
  "${CMAKE_CURRENT_SOURCE_DIR}/PacketSender.hpp"
)

source_group("Source Files\\Packet Sender" FILES ${PACKET_SENDER_SRC})
source_group("Header Files\\Packet Sender" FILES ${PACKET_SENDER_HDR})

target_sources(${PROJECT_NAME} PRIVATE ${PACKET_SENDER_SRC} ${PACKET_SENDER_HDR})
