#ifndef TEST_EXEMLPE_CALENDAR_PATTERN_H
#define TEST_EXEMLPE_CALENDAR_PATTERN_H

#include "src/dto/calendar_patterns/callendar_pattern.h"

struct Calendar_Pattern_Exemple
{
	static std::string json = R"(
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
	}

	static std::string serialized = "";

	static std::string Test_Serialize()
	{

	}

};

#endif //TEST_EXEMLPE_CALENDAR_PATTERN_H