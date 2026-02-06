#include "network_data_handler.h"
#include <filesystem>:;

Network_Data_Handler::Network_Data_Handler(std::shared_ptr<oatpp::web::mime::ContentMappers>& apiContentMappers)
	: oatpp::web::server::api::ApiController(apiContentMappers)
{
}

std::optional<oatpp::String> Network_Data_Handler::Load_Json_File(const oatpp::String& path) {
	if (!std::filesystem::exists(path->c_str())) {
		OATPP_LOGi("[warning]", "File not found: %s", path->c_str());
		return std::nullopt;
	}
	return oatpp::String::loadFromFile(path->c_str());
}

template<typename T>
std::optional<oatpp::Object<T>> Network_Data_Handler::Parse_Json(const oatpp::String& json, oatpp::json::ObjectMapper& mapper) {
	try {
		return mapper.readFromString<oatpp::Object<T>>(json);
	}
	catch (const std::exception& e) {
		OATPP_LOGi("[error]", "Failed to parse JSON:" + std::string(e.what()));
		return std::nullopt;
	}
}