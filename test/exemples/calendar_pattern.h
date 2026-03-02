#ifndef TEST_EXEMLPE_CALENDAR_PATTERN_H
#define TEST_EXEMLPE_CALENDAR_PATTERN_H

// DTO
#include "src/dto/calendar_patterns/calendar_pattern.h"

// OATPP
#include <oatpp/json/ObjectMapper.hpp>

struct Calendar_Pattern_Exemple
{
	static inline const std::string json = R"(
	{	
		"id" : "31.12",
		"label": "jounrée mondial spécial",
		"is_exceptional" : true,
		"info": "journée special"
	}
	)";

	static void Test_Deserialize(const std::string& str)
	{
		auto jsonObjectMapper = oatpp::json::ObjectMapper();
		auto object = jsonObjectMapper.readFromString<oatpp::Object<O::DTO::Calendar_Pattern>>(str);


		OATPP_ASSERT(object->id == "31.12");
		OATPP_ASSERT(object->label == "jounrée mondial spécial");
		OATPP_ASSERT(object->is_exceptional == true);
		OATPP_ASSERT(object->info == "journée special");

		OATPP_ASSERT(object->Has_Info() == true);
		OATPP_ASSERT(object->Has_Icon() == false);

	}

	static inline const std::string serialized = R"({"id":"31.12","label":"jounr\u00E9e mondial sp\u00E9cial","is_exceptional":true,"info":"journ\u00E9e special","icon":null})";

	static std::string Test_Serialize()
	{
		auto calendar_pattern = O::DTO::Calendar_Pattern::createShared();
		calendar_pattern->id = "31.12";
		calendar_pattern->label = "jounrée mondial spécial";
		calendar_pattern->is_exceptional = true;
		calendar_pattern->info = "journée special";

		auto jsonObjectMapper = oatpp::json::ObjectMapper();
		return  jsonObjectMapper.writeToString(calendar_pattern);
	}

};

#endif //TEST_EXEMLPE_CALENDAR_PATTERN_H