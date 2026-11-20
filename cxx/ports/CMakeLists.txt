set(PORTS_SRC
  "${CMAKE_CURRENT_SOURCE_DIR}/Ports.cxx"
  "${CMAKE_CURRENT_SOURCE_DIR}/Platform.cxx"
)

set(PORTS_HDR
  "${CMAKE_CURRENT_SOURCE_DIR}/Ports.h"
)

source_group("Source Files\\Ports" FILES ${PORTS_SRC})
source_group("Header Files\\Ports" FILES ${PORTS_HDR})

target_sources(${PROJECT_NAME} PRIVATE ${PORTS_SRC} ${PORTS_HDR})
