if(NOT EXISTS "/Users/artemiisolodukhov/Projects/over-the-wire/build-standalone/cmake/install_manifest.txt")
  message(FATAL_ERROR "Cannot find install manifest: /Users/artemiisolodukhov/Projects/over-the-wire/build-standalone/cmake/install_manifest.txt")
endif()

file(READ "/Users/artemiisolodukhov/Projects/over-the-wire/build-standalone/cmake/install_manifest.txt" files)
string(REGEX REPLACE "\n" ";" files "${files}")
foreach(file ${files})
  message(STATUS "Uninstalling $ENV{DESTDIR}${file}")
  if(IS_SYMLINK "$ENV{DESTDIR}${file}" OR EXISTS "$ENV{DESTDIR}${file}")
    # If the file exists or is symlink
    # run remove command through cmake in command mode
    # See https://cmake.org/cmake/help/latest/manual/cmake.1.html#run-a-command-line-tool
    exec_program(
      "/private/tmp/claude-501/-Users-artemiisolodukhov-Projects-over-the-wire/fb486e52-8aff-4bce-879c-b4b07a3bbf60/scratchpad/venv/lib/python3.14/site-packages/cmake/data/bin/cmake" ARGS "-E rm -rf \"$ENV{DESTDIR}${file}\""
      OUTPUT_VARIABLE rm_out
      RETURN_VALUE rm_retval
      )
    if(NOT "${rm_retval}" STREQUAL 0)
      message(FATAL_ERROR "Error when removing $ENV{DESTDIR}${file}")
    endif()
  else(IS_SYMLINK "$ENV{DESTDIR}${file}" OR EXISTS "$ENV{DESTDIR}${file}")
    message(STATUS "File $ENV{DESTDIR}${file} does not exist.")
  endif()
endforeach()
file(REMOVE "/Users/artemiisolodukhov/Projects/over-the-wire/build-standalone/cmake/install_manifest.txt")
