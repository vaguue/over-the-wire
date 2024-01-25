set(CHECKSUMS_SRC
  "${CMAKE_CURRENT_SOURCE_DIR}/Checksums.cpp"
)

set(CHECKSUMS_HDR
  "${CMAKE_CURRENT_SOURCE_DIR}/Checksums.hpp"
)

source_group("Source Files\\Checksums" FILES ${CHECKSUMS_SRC})
source_group("Header Files\\Checksums" FILES ${CHECKSUMS_HDR})

target_sources(${PROJECT_NAME} PRIVATE ${CHECKSUMS_SRC} ${CHECKSUMS_HDR})
