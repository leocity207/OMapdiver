#ifndef TEST_EXEMPLE_STOP_PATTERN_PATTERN_H
#define TEST_EXEMPLE_STOP_PATTERN_PATTERN_H

#include "src/dto/stop_patterns/stop_pattern.h"

struct Stop_Pattern_Exemple
{
	static std::string json = R"(
	{
		"id" : "express",
		"label" : "express",
		"level": 1,
		"variant": [],
		"color" : "#FFFFFF",
		"icon" : "<svg> my icon </svg>"
	}
	)";

	static void Test_Deserialize()
	{
		auto jsonObjectMapper = oatpp::json::ObjectMapper();
		auto object = jsonObjectMapper.readFromString<oatpp::Object<O::DTO::Stop_Pattern>>(str);
	}

	static std::string serialized = "";

	static std::string Test_Serialize()
	{

	}
};

#endif //TEST_EXEMPLE_STOP_PATTERN_PATTERN_H