#ifndef BASE_DTO_HPP
#define BASE_DTO_HPP


// DTO
#include "base.h"
#include "exception.h"

// OATPP
#include <oatpp/Types.hpp>
#include <oatpp/json/ObjectMapper.hpp>
#include <oatpp/base/Log.hpp>


// CONFIGURATION
#include "src/config.h"


template<class Types>
inline bool O::DTO::Base::Need_Update(std::string_view key, const std::filesystem::file_time_type& last_update)
{
	std::filesystem::path aggregate_filepath = RESOURCE_PATH() / "resources-config/data" / (std::string(key) + ".json");

	if (!std::filesystem::exists(aggregate_filepath)) {
		OATPP_LOGi("[warning]", "File not found: %s", aggregate_filepath.generic_string());
		throw Exception{ Exception::FILE_DOES_NOT_EXIST };
	}
	if (last_update < std::filesystem::last_write_time(aggregate_filepath))
		return true;

	auto aggregate_string_data = oatpp::String::loadFromFile(aggregate_filepath.generic_string().c_str());
	oatpp::json::ObjectMapper json_object_mapper;
	typename oatpp::Object<Types> types;
	try {
		types = json_object_mapper.readFromString<oatpp::Object<Types>>(aggregate_string_data);
	}
	catch (const std::exception& e) {
		OATPP_LOGi("[error]", "Failed to parse JSON:" + std::string(e.what()));
		throw Exception{ Exception::JSON_PARSING_FAILED };
	}

	//check individual files
	for (const auto& id : *types->list)
	{
		std::filesystem::path single_filepath = RESOURCE_PATH() / "resources-config/data" / (std::string(id) + ".json");
		
		if (!std::filesystem::exists(single_filepath)) {
			OATPP_LOGi("[warning]", "File not found: %s", single_filepath.generic_string());
			throw Exception{ Exception::FILE_DOES_NOT_EXIST };
		}
		if (last_update < std::filesystem::last_write_time(single_filepath))
			return true;
	}
	return false;
}


template<class Types, class Type>
inline std::pair<oatpp::Fields<oatpp::Object<Type>>, std::filesystem::file_time_type> O::DTO::Base::Load_From_File(std::string_view key)
{
	
	std::filesystem::path aggregate_filepath = RESOURCE_PATH() / "resources-config/data" / (std::string(key) + ".json");
	oatpp::Fields<oatpp::Object<Type>> aggregated_objects = oatpp::Fields<oatpp::Object<Type>>::createShared();

	if (!std::filesystem::exists(aggregate_filepath)) {
		OATPP_LOGi("[warning]", "File not found: %s", aggregate_filepath.generic_string());
		throw Exception{ Exception::FILE_DOES_NOT_EXIST };
	}
	std::filesystem::file_time_type last_update = std::filesystem::last_write_time(aggregate_filepath);

	auto aggregate_string_data = oatpp::String::loadFromFile(aggregate_filepath.generic_string().c_str());
	oatpp::json::ObjectMapper json_object_mapper;
	typename oatpp::Object<Types> types;
	try {
		types = json_object_mapper.readFromString<oatpp::Object<Types>>(aggregate_string_data);
	}
	catch (const std::exception& e) {
		OATPP_LOGi("[error]", "Failed to parse JSON: %s",e.what());
		throw Exception{ Exception::JSON_PARSING_FAILED };
	}

	//check individual files
	for (const auto& id : *types->list)
	{
		std::filesystem::path single_filepath = RESOURCE_PATH() / "resources-config/data" / (std::string(id) + ".json");

		if (!std::filesystem::exists(single_filepath)) {
			OATPP_LOGi("[warning]", "File not found: %s", single_filepath.generic_string());
			throw Exception{ Exception::FILE_DOES_NOT_EXIST };
		}
		if (last_update < std::filesystem::last_write_time(single_filepath))
			last_update = std::filesystem::last_write_time(single_filepath);

		auto signle_string_data = oatpp::String::loadFromFile(single_filepath.generic_string().c_str());
		oatpp::Object<Type> types;
		try {
			types = json_object_mapper.readFromString<oatpp::Object<Type>>(signle_string_data);
		}
		catch (const std::exception& e) {
			OATPP_LOGi("[error]", "Failed to parse JSON: %s", e.what());
			throw Exception{ Exception::JSON_PARSING_FAILED };
		}
		aggregated_objects->push_back({ id, types });
	}
	return { aggregated_objects, last_update };
}

#endif // BASE_DTO_HPP


