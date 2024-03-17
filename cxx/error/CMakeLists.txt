set(ERROR_SRC
  "${CMAKE_CURRENT_SOURCE_DIR}/Error.cpp"
)

set(ERROR_HDR
  "${CMAKE_CURRENT_SOURCE_DIR}/Error.hpp"
)

source_group("Source Files\\Error" FILES ${ERROR_SRC})
source_group("Header Files\\Error" FILES ${ERROR_HDR})

target_sources(${PROJECT_NAME} PRIVATE ${ERROR_SRC} ${ERROR_HDR})
