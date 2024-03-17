set(Converters_SRC
  "${CMAKE_CURRENT_SOURCE_DIR}/Converters.cpp"
)

set(Converters_HDR
  "${CMAKE_CURRENT_SOURCE_DIR}/Converters.hpp"
)

source_group("Source Files\\Converters" FILES ${Converters_SRC})
source_group("Header Files\\Converters" FILES ${Converters_HDR})

target_sources(${PROJECT_NAME} PRIVATE ${Converters_SRC} ${Converters_HDR})
