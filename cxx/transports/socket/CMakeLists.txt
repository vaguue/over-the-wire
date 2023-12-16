set(SOCKET_SRC
  "${CMAKE_CURRENT_SOURCE_DIR}/Socket.cpp"
)

set(SOCKET_HDR
  "${CMAKE_CURRENT_SOURCE_DIR}/Socket.hpp"
)

source_group("Source Files\\Socket" FILES ${SOCKET_SRC})
source_group("Header Files\\Socket" FILES ${SOCKET_HDR})

target_sources(${PROJECT_NAME} PRIVATE ${SOCKET_SRC} ${SOCKET_HDR})
