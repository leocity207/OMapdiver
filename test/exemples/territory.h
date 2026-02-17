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
		"label": "france",
	}
	)";

	static void Test_Deserialize(const std::string& str)
	{
		auto jsonObjectMapper = oatpp::json::ObjectMapper();
		auto object = jsonObjectMapper.readFromString<oatpp::Object<O::DTO::Territory>>(str);
	}

	static inline const std::string serialized = "";

	static std::string Test_Serialize()
	{

	}
};

#endif //TEST_EXEMPLE_TERRITORY_H