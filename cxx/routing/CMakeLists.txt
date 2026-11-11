set(ROUTING_SRC
  "${CMAKE_CURRENT_SOURCE_DIR}/Routing.cxx"
  "${CMAKE_CURRENT_SOURCE_DIR}/Platform.cxx"
)

set(ROUTING_HDR
  "${CMAKE_CURRENT_SOURCE_DIR}/Routing.h"
)

source_group("Source Files\\Routing" FILES ${ROUTING_SRC})
source_group("Header Files\\Routing" FILES ${ROUTING_HDR})

target_sources(${PROJECT_NAME} PRIVATE ${ROUTING_SRC} ${ROUTING_HDR})
