set(SOCKET_SRC
  "${CMAKE_CURRENT_SOURCE_DIR}/Socket.cpp"
  "${CMAKE_CURRENT_SOURCE_DIR}/Error.cpp"
  "${CMAKE_CURRENT_SOURCE_DIR}/Packets.cpp"
  "${CMAKE_CURRENT_SOURCE_DIR}/SockAddr.cpp"
  "${CMAKE_CURRENT_SOURCE_DIR}/Enums/Enums.cpp"
)

set(SOCKET_HDR
  "${CMAKE_CURRENT_SOURCE_DIR}/Socket.hpp"
  "${CMAKE_CURRENT_SOURCE_DIR}/Error.hpp"
  "${CMAKE_CURRENT_SOURCE_DIR}/Packets.hpp"
  "${CMAKE_CURRENT_SOURCE_DIR}/Sys.hpp"
  "${CMAKE_CURRENT_SOURCE_DIR}/SockAddr.hpp"
  "${CMAKE_CURRENT_SOURCE_DIR}/SockAddr.hpp"
  "${CMAKE_CURRENT_SOURCE_DIR}/Enums/Enums.hpp"
)

source_group("Source Files\\Socket" FILES ${SOCKET_SRC})
source_group("Header Files\\Socket" FILES ${SOCKET_HDR})

target_sources(${PROJECT_NAME} PRIVATE ${SOCKET_SRC} ${SOCKET_HDR})
