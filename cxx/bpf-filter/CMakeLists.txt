set(BPF_FILTER_SRC
  "${CMAKE_CURRENT_SOURCE_DIR}/BpfFilter.cpp"
)

set(BPF_FILTER_HDR
  "${CMAKE_CURRENT_SOURCE_DIR}/BpfFilter.hpp"
)

source_group("Source Files\\BpfFilter" FILES ${BPF_FILTER_SRC})
source_group("Header Files\\BpfFilter" FILES ${BPF_FILTER_HDR})

target_sources(${PROJECT_NAME} PRIVATE ${BPF_FILTER_SRC} ${BPF_FILTER_HDR})
