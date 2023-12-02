set(EXAMPLE_SRC
  "${CMAKE_CURRENT_SOURCE_DIR}/Example.cpp"
)

set(EXAMPLE_HDR
  "${CMAKE_CURRENT_SOURCE_DIR}/Example.hpp"
)

source_group("Source Files\\Example" FILES ${EXAMPLE_SRC})
source_group("Header Files\\Example" FILES ${EXAMPLE_HDR})

target_sources(${PROJECT_NAME} PRIVATE ${EXAMPLE_SRC} ${EXAMPLE_HDR})
