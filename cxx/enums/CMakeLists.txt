set(ENUMS_SRC
  "${CMAKE_CURRENT_SOURCE_DIR}/Enums.cpp"
)

set(ENUMS_HDR
  "${CMAKE_CURRENT_SOURCE_DIR}/Enums.hpp"
)

source_group("Source Files\\Enums" FILES ${ENUMS_SRC})
source_group("Header Files\\Enums" FILES ${ENUMS_HDR})

target_sources(${PROJECT_NAME} PRIVATE ${ENUMS_SRC} ${ENUMS_HDR})
