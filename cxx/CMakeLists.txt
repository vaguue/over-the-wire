set(MAIN_SRC
  "${CMAKE_CURRENT_SOURCE_DIR}/main.cpp"
)

source_group("Source Files\\Main" FILES ${MAIN_SRC})

target_sources(${PROJECT_NAME} PRIVATE ${MAIN_SRC})
