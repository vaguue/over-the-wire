set(SOCKET_SRC
  "${CMAKE_CURRENT_SOURCE_DIR}/Socket.cxx"
  "${CMAKE_CURRENT_SOURCE_DIR}/Packets.cxx"
  "${CMAKE_CURRENT_SOURCE_DIR}/InputPackets.cxx"
  "${CMAKE_CURRENT_SOURCE_DIR}/SockAddr.cxx"
  "${CMAKE_CURRENT_SOURCE_DIR}/Enums/Enums.cxx"
)

set(SOCKET_HDR
  "${CMAKE_CURRENT_SOURCE_DIR}/Socket.h"
  "${CMAKE_CURRENT_SOURCE_DIR}/Backend.h"
  "${CMAKE_CURRENT_SOURCE_DIR}/Address.h"
  "${CMAKE_CURRENT_SOURCE_DIR}/Packets.h"
  "${CMAKE_CURRENT_SOURCE_DIR}/InputPackets.h"
  "${CMAKE_CURRENT_SOURCE_DIR}/SockAddr.h"
  "${CMAKE_CURRENT_SOURCE_DIR}/SockAddr.h"
  "${CMAKE_CURRENT_SOURCE_DIR}/Enums/Enums.h"
)

source_group("Source Files\\Socket" FILES ${SOCKET_SRC})
source_group("Header Files\\Socket" FILES ${SOCKET_HDR})

target_sources(${PROJECT_NAME} PRIVATE ${SOCKET_SRC} ${SOCKET_HDR})
