cmake_minimum_required(VERSION 3.13)
cmake_policy(SET CMP0042 NEW)

project(otw C CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

if(NOT CMAKE_BUILD_TYPE)
  set(CMAKE_BUILD_TYPE Release)
endif()

get_filename_component(PACKAGE_ROOT "${CMAKE_CURRENT_SOURCE_DIR}/.." ABSOLUTE)

set(NODE_SOURCE_DIR "" CACHE PATH "A Node.js source tree built with --enable-static: the binary carries Node.js inside")
set(NODE_INCLUDE_DIR "" CACHE STRING "Directories with the Node.js and libuv headers, when linking against a shared libnode")
set(NODE_LIBRARY "" CACHE STRING "A shared libnode, and libuv when it is a library of its own, when not linking statically")
set(BUNDLE_DIR "${PACKAGE_ROOT}/build-standalone" CACHE PATH "Where scripts/standalone-bundle.js wrote bundle.cxx")

execute_process(COMMAND node -p "require('node-addon-api').include"
        WORKING_DIRECTORY ${PACKAGE_ROOT}
        OUTPUT_VARIABLE NODE_ADDON_API_DIR
        )

string(REGEX REPLACE "[\r\n\"]" "" NODE_ADDON_API_DIR ${NODE_ADDON_API_DIR})

add_executable(${PROJECT_NAME}
  "${CMAKE_CURRENT_SOURCE_DIR}/main.cxx"
  "${BUNDLE_DIR}/bundle.cxx"
)

target_include_directories(${PROJECT_NAME} PRIVATE "${NODE_ADDON_API_DIR}")
target_include_directories(${PROJECT_NAME} PRIVATE "${PACKAGE_ROOT}/cxx")
target_compile_definitions(${PROJECT_NAME} PRIVATE NAPI_VERSION=6)

if(NOT MSVC)
  add_compile_options(-Wno-error=vla)
  add_compile_options(-Wno-error=deprecated)
endif()

if(NODE_SOURCE_DIR)
  target_include_directories(${PROJECT_NAME} PRIVATE
    "${NODE_SOURCE_DIR}/src"
    "${NODE_SOURCE_DIR}/deps/v8/include"
    "${NODE_SOURCE_DIR}/deps/uv/include"
  )

  file(GLOB_RECURSE NODE_ARCHIVES "${NODE_SOURCE_DIR}/out/Release/*.a")
  list(FILTER NODE_ARCHIVES EXCLUDE REGEX "gtest|torque|icutools|libv8_init\\.a")
  file(GLOB_RECURSE NODE_SNAPSHOT "${NODE_SOURCE_DIR}/out/Release/*/node_snapshot.o")

  if(NOT NODE_ARCHIVES OR NOT NODE_SNAPSHOT)
    message(FATAL_ERROR "${NODE_SOURCE_DIR} is not a Node.js tree built with --enable-static: run standalone/libnode.sh first")
  endif()

  target_sources(${PROJECT_NAME} PRIVATE ${NODE_SNAPSHOT})
  set_source_files_properties(${NODE_SNAPSHOT} PROPERTIES EXTERNAL_OBJECT TRUE GENERATED TRUE)

  if(APPLE)
    target_link_libraries(${PROJECT_NAME} PRIVATE ${NODE_ARCHIVES} ${NODE_ARCHIVES} "-framework CoreFoundation" "-framework Security")
  else()
    target_link_libraries(${PROJECT_NAME} PRIVATE -Wl,--start-group ${NODE_ARCHIVES} -Wl,--end-group -pthread -ldl -lm -static-libstdc++ -static-libgcc)
    target_link_options(${PROJECT_NAME} PRIVATE -rdynamic)
  endif()
elseif(NODE_INCLUDE_DIR AND NODE_LIBRARY)
  target_include_directories(${PROJECT_NAME} PRIVATE ${NODE_INCLUDE_DIR})
  target_link_libraries(${PROJECT_NAME} PRIVATE ${NODE_LIBRARY})
else()
  message(FATAL_ERROR "Set NODE_SOURCE_DIR, or NODE_INCLUDE_DIR and NODE_LIBRARY")
endif()

add_subdirectory("${PACKAGE_ROOT}/cxx_modules/PcapPlusPlus" PcapPlusPlus)
add_dependencies(${PROJECT_NAME} Pcap++)
include_directories("${PACKAGE_ROOT}/cxx_modules/PcapPlusPlus/Pcap++/header")
include_directories("${PACKAGE_ROOT}/cxx_modules/PcapPlusPlus/Packet++/header")
include_directories("${PACKAGE_ROOT}/cxx_modules/PcapPlusPlus/Common++/header")
target_link_libraries(${PROJECT_NAME} PRIVATE Pcap++)

add_subdirectory("${PACKAGE_ROOT}/cxx" addon)
add_subdirectory("${PACKAGE_ROOT}/cxx/example" addon/example)
add_subdirectory("${PACKAGE_ROOT}/cxx/transports/pcap" addon/transports/pcap)
add_subdirectory("${PACKAGE_ROOT}/cxx/transports/socket" addon/transports/socket)
add_subdirectory("${PACKAGE_ROOT}/cxx/bpf-filter" addon/bpf-filter)
add_subdirectory("${PACKAGE_ROOT}/cxx/enums" addon/enums)
add_subdirectory("${PACKAGE_ROOT}/cxx/checksums" addon/checksums)
add_subdirectory("${PACKAGE_ROOT}/cxx/arp" addon/arp)
add_subdirectory("${PACKAGE_ROOT}/cxx/routing" addon/routing)
add_subdirectory("${PACKAGE_ROOT}/cxx/error" addon/error)
add_subdirectory("${PACKAGE_ROOT}/cxx/converters" addon/converters)
