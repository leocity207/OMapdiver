#ifndef TEST_EXEMPLE_TERRITORY_H
#define TEST_EXEMPLE_TERRITORY_H

#include "src/dto/territories/territory.h"

struct Territory_Exemple
{
	static std::string json = R"(
	{
		"id" : "fr",
		"label": "france",
	}
	)";

	static void Test_Deserialize()
	{
		auto jsonObjectMapper = oatpp::json::ObjectMapper();
		auto object = jsonObjectMapper.readFromString<oatpp::Object<O::DTO::Territory>>(str);
	}

	static std::string serialized = "";

	static std::string Test_Serialize()
	{

	}
};

#endif //TEST_EXEMPLE_TERRITORY_H