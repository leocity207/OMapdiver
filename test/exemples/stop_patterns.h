#ifndef TEST_EXEMPLE_STOP_PATTERN_PATTERN_H
#define TEST_EXEMPLE_STOP_PATTERN_PATTERN_H

// DTO
#include "src/dto/stop_patterns/stop_pattern.h"

// OATPP
#include <oatpp/json/ObjectMapper.hpp>

struct Stop_Pattern_Exemple
{
	static inline const  std::string json = R"(
	{
		"id" : "express",
		"label" : "express",
		"level": 1,
		"variant": ["sub-express", "express"],
		"color" : "#FFFFFF",
		"icon" : "<svg> my icon </svg>"
	}
	)";

	static void Test_Deserialize(const std::string& str)
	{
		auto jsonObjectMapper = oatpp::json::ObjectMapper();
		auto object = jsonObjectMapper.readFromString<oatpp::Object<O::DTO::Stop_Pattern>>(str);

		OATPP_ASSERT(object->id == "express");
		OATPP_ASSERT(object->label == "express");
		OATPP_ASSERT(object->level == 1);
		OATPP_ASSERT(object->color == "#FFFFFF");
		OATPP_ASSERT(object->icon == "<svg> my icon </svg>");

		OATPP_ASSERT(object->variant->size() == 2);

		auto it = object->variant->begin();
		OATPP_ASSERT(*(it) == "sub-express");
		OATPP_ASSERT(*(++it) == "express");
	}

	static inline const std::string serialized = R"({"id":"express","label":"express","urls":null,"level":1,"variant":["sub-express","express"],"color":"#FFFFFF","icon":"<svg> my icon <\/svg>"})";

	static std::string Test_Serialize()
	{
		auto stop_pattern = O::DTO::Stop_Pattern::createShared();
		stop_pattern->id = "express";
		stop_pattern->label = "express";
		stop_pattern->level = 1;
		stop_pattern->color = "#FFFFFF";
		stop_pattern->icon = "<svg> my icon </svg>";
		stop_pattern->variant = { "sub-express" ,"express" };
		auto jsonObjectMapper = oatpp::json::ObjectMapper();
		return  jsonObjectMapper.writeToString(stop_pattern);
	}
};

#endif //TEST_EXEMPLE_STOP_PATTERN_PATTERN_H