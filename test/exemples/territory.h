#ifndef TEST_EXEMPLE_TERRITORY_H
#define TEST_EXEMPLE_TERRITORY_H

// DTO
#include "src/dto/territories/territory.h"

// OATPP
#include <oatpp/json/ObjectMapper.hpp>

struct Territory_Exemple
{
	static inline const  std::string json = R"(
	{
		"id" : "fr",
		"label": "france"
	}
	)";

	static void Test_Deserialize(const std::string& str)
	{
		auto jsonObjectMapper = oatpp::json::ObjectMapper();
		auto object = jsonObjectMapper.readFromString<oatpp::Object<O::DTO::Territory>>(str);

		OATPP_ASSERT(object->id == "fr");
		OATPP_ASSERT(object->label == "france");
	}

	static inline const std::string serialized = R"({"id":"fr","label":"france"})";

	static std::string Test_Serialize()
	{
		auto territory = O::DTO::Territory::createShared();
		territory->id = "fr";
		territory->label = "france";
		auto jsonObjectMapper = oatpp::json::ObjectMapper();
		return  jsonObjectMapper.writeToString(territory);
	}
};

#endif //TEST_EXEMPLE_TERRITORY_H