cmake_minimum_required(VERSION 3.20)

#-------------------------
# Enable building tests (default ON)
option(BUILD_TESTS "Build test executables" ON)

#-------------------------
# add resources by default if they don't exist
set(RESOURCES_DIR "${CMAKE_CURRENT_SOURCE_DIR}/resources/resources-config")
set(DB_HOST "127.0.0.1" CACHE STRING "PostgreSQL host")
set(DB_PORT "5432" CACHE STRING "PostgreSQL port")
set(DB_NAME "appdb" CACHE STRING "PostgreSQL database name")
set(DB_USER "appuser" CACHE STRING "PostgreSQL database user")
set(DB_PASSWORD "app_password" CACHE STRING "PostgreSQL database password")
file(GLOB RESOURCE_CONTENTS "${RESOURCES_DIR}/*")
if(DOWNLOAD_RESOURCES AND NOT RESOURCE_CONTENTS)
	error("Resources not found. Please install ressource inside the resources-config folder.")
endif()

#-----------------
# Creating Project
set(project_name Mapdiver)
project(${project_name} VERSION 1.0.13)

#---------------------------------------
#get the current commit hash for version
execute_process(
	COMMAND git rev-parse HEAD
	WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
	OUTPUT_VARIABLE GIT_COMMIT_HASH
	OUTPUT_STRIP_TRAILING_WHITESPACE
)

#-----------------------
#setting the config file
get_filename_component(STATIC_CURRENT_DIR "${CMAKE_CURRENT_SOURCE_DIR}" ABSOLUTE)

if(CPACK_GENERATOR)
  set(VAR_STATIC_CURRENT_DIR "../")
else()
  set(VAR_STATIC_CURRENT_DIR "${STATIC_CURRENT_DIR}")
endif()

configure_file(
  "${CMAKE_SOURCE_DIR}/src/config.h.in"
  "${CMAKE_BINARY_DIR}/src/config.h"
  @ONLY
)
configure_file(${PROJECT_SOURCE_DIR}/src/config.h.in ${PROJECT_SOURCE_DIR}/src/config.h)


#----------------------------
# setting the main server lib
set(CMAKE_CXX_STANDARD 20)
include_directories(${PROJECT_SOURCE_DIR})


FILE(GLOB CONTROLER_SRC src/controller/*.cpp)
FILE(GLOB CONTROLER_H src/controller/*.h*)
FILE(GLOB DTO_H src/dto/*.h*)
FILE(GLOB DTO_SRC src/dto/*.cpp)
FILE(GLOB DTO_SRC_CALENDAR_PATTERNS src/dto/calendar_patterns/*.cpp)
FILE(GLOB DTO_SRC_COMMON src/dto/common/*.cpp*)
FILE(GLOB DTO_SRC_LINES src/dto/lines/*.cpp*)
FILE(GLOB DTO_SRC_NETWORKS src/dto/networks/*.cpp)
FILE(GLOB DTO_SRC_OPERATORS src/dto/operators/*.cpp*)
FILE(GLOB DTO_SRC_ORGANISERS src/dto/organisers/*.cpp*)
FILE(GLOB DTO_SRC_STATIONS src/dto/stations/*.cpp*)
FILE(GLOB DTO_SRC_STOP_PATTERNS src/dto/stop_patterns/*.cpp*)
FILE(GLOB DTO_SRC_TERRITORIES src/dto/territories/*.cpp*)
FILE(GLOB APP_SRC src/*.cpp*)
FILE(GLOB APP_H src/*.h*)

add_library(${project_name}-lib
	${DTO_H}
	${APP_H}
	${CONTROLER_H}
	${CONTROLER_SRC}
	${DTO_SRC}
	${DTO_SRC_CALENDAR_PATTERNS}
	${DTO_SRC_COMMON}
	${DTO_SRC_LINES}
	${DTO_SRC_NETWORKS}
	${DTO_SRC_OPERATORS}
	${DTO_SRC_ORGANISERS}
	${DTO_SRC_STATIONS}
	${DTO_SRC_STOP_PATTERNS}
	${DTO_SRC_TERRITORIES}
)

#----------------------------------
# link server lib with dependancies

find_package(PostgreSQL REQUIRED)
if(NOT BUILD_TESTS)
    set(OATPP_BUILD_TESTS OFF CACHE BOOL "" FORCE)
    set(OATPP_POSTGRESQL_BUILD_TESTS OFF CACHE BOOL "" FORCE)
endif()
add_subdirectory(externals/oatpp)
set(OATPP_MODULES_LOCATION OATPP_MODULES_LOCATION_CUSTOM CACHE STRING "" FORCE)
set(OATPP_DIR_SRC ${CMAKE_CURRENT_SOURCE_DIR}/externals/oatpp/src)
set(OATPP_DIR_LIB ${CMAKE_BINARY_DIR}/externals/oatpp)
add_subdirectory(externals/oatpp-postgresql)
add_subdirectory(externals/cxxopts)

target_link_libraries(${project_name}-lib
	PRIVATE oatpp
	PRIVATE oatpp-test
	PRIVATE oatpp-postgresql
	PRIVATE cxxopts
	PRIVATE PostgreSQL::PostgreSQL
)

target_include_directories(${project_name}-lib 
	PUBLIC src
	PUBLIC externals/oatpp/src
	PUBLIC externals/oatpp-postgresql/src
	PUBLIC externals/cxxopts/include
)

#--------------------------------
# add main executable executables

add_executable(${project_name}-exe
	${APP_SRC}
)
target_link_libraries(${project_name}-exe 
	${project_name}-lib
	PostgreSQL::PostgreSQL
)
add_dependencies(${project_name}-exe ${project_name}-lib)

#--------------------
# add test executabme
if(BUILD_TESTS)
    FILE(GLOB TEST_APP_H test/app/*.h*)
    FILE(GLOB TEST_H test/*.h*)
    FILE(GLOB TEST_SRC test/*.cpp)

    add_executable(${project_name}-test
        ${TEST_APP_H}
        ${TEST_SRC}
    )

    target_link_libraries(${project_name}-test ${project_name}-lib)
    add_dependencies(${project_name}-test ${project_name}-lib)

    enable_testing()
    add_test(project-tests ${project_name}-test)

	set_target_properties(${project_name}-test PROPERTIES
		CXX_STANDARD 20
		CXX_EXTENSIONS OFF
		CXX_STANDARD_REQUIRED ON
	)

endif()

set_target_properties(${project_name}-lib ${project_name}-exe PROPERTIES
	CXX_STANDARD 20
	CXX_EXTENSIONS OFF
	CXX_STANDARD_REQUIRED ON
)

#-------------------
# Install

set(CMAKE_INSTALL_DEFAULT_COMPONENT_NAME "none")

install(TARGETS Mapdiver-exe RUNTIME DESTINATION bin COMPONENT app)
install(DIRECTORY resources/ DESTINATION resources COMPONENT app)
install(DIRECTORY ${PROJECT_SOURCE_DIR}/documentation/build/ DESTINATION doc COMPONENT doc)

set(CPACK_COMPONENTS_ALL app doc)
set(CPACK_COMPONENT_app_DISPLAY_NAME "Mapdiver Application")
set(CPACK_COMPONENT_doc_DISPLAY_NAME "Mapdiver Documentation")

set(CPACK_COMPONENTS_GROUPING ALL_COMPONENTS_IN_ONE)
set(CPACK_ARCHIVE_COMPONENT_INSTALL ON)

include(CPack)
set(CPACK_PACKAGE_NAME "Mapdiver")
set(CPACK_PACKAGE_VERSION ${PROJECT_VERSION})