cmake_minimum_required(VERSION 3.9)
cmake_policy(SET CMP0042 NEW)
set (CMAKE_CXX_STANDARD 17)

execute_process(COMMAND node -p "require('node-addon-api').include"
        WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
        OUTPUT_VARIABLE NODE_ADDON_API_DIR
        )

string(REGEX REPLACE "[\r\n\"]" "" NODE_ADDON_API_DIR ${NODE_ADDON_API_DIR})

Message("NODE_ADDON_API_DIR: " ${NODE_ADDON_API_DIR})

include_directories(${CMAKE_JS_INC})

project (over-the-wire)

add_library(${PROJECT_NAME} SHARED ${CMAKE_JS_SRC})
target_include_directories(${PROJECT_NAME} PRIVATE "${NODE_ADDON_API_DIR}")
target_include_directories(${PROJECT_NAME} PRIVATE "${CMAKE_CURRENT_SOURCE_DIR}/cxx")

# PcapPlusPlus
add_subdirectory(cxx_modules/PcapPlusPlus)
add_dependencies(${PROJECT_NAME} Pcap++)
include_directories(cxx_modules/PcapPlusPlus/Pcap++/header)
include_directories(cxx_modules/PcapPlusPlus/Packet++/header)
include_directories(cxx_modules/PcapPlusPlus/Common++/header)
target_link_libraries(${PROJECT_NAME} PUBLIC Pcap++)

add_subdirectory(cxx/)
add_subdirectory(cxx/example)
add_subdirectory(cxx/transports/pcap)
add_subdirectory(cxx/transports/socket)
add_subdirectory(cxx/bpf-filter)
add_subdirectory(cxx/enums)
add_subdirectory(cxx/checksums)
add_subdirectory(cxx/arp)

set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")

target_link_libraries(${PROJECT_NAME} ${CMAKE_JS_LIB})

# define NPI_VERSION
add_definitions(-DNAPI_VERSION=6)

if(MSVC AND CMAKE_JS_NODELIB_DEF AND CMAKE_JS_NODELIB_TARGET)
  # Generate node.lib
  execute_process(COMMAND ${CMAKE_AR} /def:${CMAKE_JS_NODELIB_DEF} /out:${CMAKE_JS_NODELIB_TARGET} ${CMAKE_STATIC_LINKER_FLAGS})
endif()
