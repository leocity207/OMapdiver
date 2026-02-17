#ifndef TEST_EXMPLE_NETWORK_H
#define TEST_EXMPLE_NETWORK_H

// DTO
#include "src/dto/networks/network.h"

// OATPP
#include <oatpp/json/ObjectMapper.hpp>

struct Network_Exemple
{
	static inline const  std::string json = R"(
	{
		"calendar_patterns": [
			"p1",
			"p2"
		],
		"stations": [
			"s1",
			"s2",
			"s3",
			"s4",
		],
		"landmarks" : [
		],
		"lines": [
			"l1",
			"l2",
		],
		"operator" : [
		],
		"organiser" : [
		],
		"patterns" : [
		],
		"stop_patterns" : [
			"express",
			"local",
			"rapid"
		],
		"territories": [
		]
	}
	)";

	static void Test_Deserialize(const std::string& str)
	{
		auto jsonObjectMapper = oatpp::json::ObjectMapper();
		auto object = jsonObjectMapper.readFromString<oatpp::Object<O::DTO::Network>>(str);
	}

	static inline const std::string serialized = "";

	static std::string Test_Serialize()
	{

	}
};

#endif //TEST_EXMPLE_NETWORK_H