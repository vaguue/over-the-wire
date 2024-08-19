cmake_minimum_required(VERSION 3.9)
cmake_policy(SET CMP0042 NEW)
set (CMAKE_CXX_STANDARD 17)

execute_process(COMMAND node -p "require('node-addon-api').include"
        WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
        OUTPUT_VARIABLE NODE_ADDON_API_DIR
        )

execute_process(COMMAND node -p "require('os').arch()"
        WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
        OUTPUT_VARIABLE _CURRENT_ARCH
        )

string(REGEX REPLACE "[\r\n\"]" "" NODE_ADDON_API_DIR ${NODE_ADDON_API_DIR})
string(REGEX REPLACE "[\r\n\"]" "" _CURRENT_ARCH ${_CURRENT_ARCH})

Message("NODE_ADDON_API_DIR: " ${NODE_ADDON_API_DIR})
Message("_CURRENT_ARCH: " ${_CURRENT_ARCH})

include_directories(${CMAKE_JS_INC})

project (over-the-wire)

if (WIN32)
  add_compile_options(/WX-)
  add_definitions(-D_SILENCE_ALL_MS_EXT_DEPRECATION_WARNINGS=1)
  message("Silencing MS warnings")
endif()

add_library(${PROJECT_NAME} SHARED ${CMAKE_JS_SRC})
target_include_directories(${PROJECT_NAME} PRIVATE "${NODE_ADDON_API_DIR}")
target_include_directories(${PROJECT_NAME} PRIVATE "${CMAKE_CURRENT_SOURCE_DIR}/cxx")

if(DEFINED ENV{PCAP_ROOT})
    set(PCAP_ROOT $ENV{PCAP_ROOT})
    message("PCAP_ROOT: ${PCAP_ROOT}")
    add_definitions(-DPCAP_ROOT="${PCAP_ROOT}")
else()
    message(WARNING "PCAP_ROOT is not set in the environment. Default paths will be used.")
endif()

if(PCAP_ROOT)
    target_include_directories(${PROJECT_NAME} PRIVATE "${PCAP_ROOT}/Include")

    set(PACKET_LIB "${PCAP_ROOT}/Lib/${_CURRENT_ARCH}/Packet.lib")
    set(WPCAP_LIB "${PCAP_ROOT}/Lib/${_CURRENT_ARCH}/wpcap.lib")

    file(TO_NATIVE_PATH "${PACKET_LIB}" PACKET_LIB)
    file(TO_NATIVE_PATH "${WPCAP_LIB}" WPCAP_LIB)

    message("PACKET_LIB: " ${PACKET_LIB})
    message("WPCAP_LIB: " ${WPCAP_LIB})

    if(EXISTS ${PACKET_LIB} AND EXISTS ${WPCAP_LIB})
        message("LINKING WITH: ${PACKET_LIB} ${WPCAP_LIB}")
        #target_link_libraries(${PROJECT_NAME} PUBLIC "${PACKET_LIB}" "${WPCAP_LIB}")
    else()
        message(FATAL_ERROR "Required libraries not found. Ensure that PCAP_ROOT is set correctly.")
    endif()

endif()

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
add_subdirectory(cxx/routing)
add_subdirectory(cxx/error)
add_subdirectory(cxx/converters)

set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")

target_link_libraries(${PROJECT_NAME} PUBLIC ${CMAKE_JS_LIB})

# define NPI_VERSION
add_definitions(-DNAPI_VERSION=6)

if(MSVC AND CMAKE_JS_NODELIB_DEF AND CMAKE_JS_NODELIB_TARGET)
  # Generate node.lib
  execute_process(COMMAND ${CMAKE_AR} /def:${CMAKE_JS_NODELIB_DEF} /out:${CMAKE_JS_NODELIB_TARGET} ${CMAKE_STATIC_LINKER_FLAGS})
endif()
