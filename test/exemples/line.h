#ifndef TEST_EXEMPLE_LINE_H
#define TEST_EXEMPLE_LINE_H

// DTO
#include "src/dto/lines/line.h"

// OATPP
#include <oatpp/json/ObjectMapper.hpp>

struct Line_Exemple
{
	static inline const  std::string json = R"(
	{
		"code": "EXPRESS_1",
		"label": "Express Line 1",
		"urls":  "/line/express1",
		"color": {
			"default": "#FF0000",
			"night": "#880000"
		},
		"svg_icon":"<svg>icon</svg>"
		"stations": [
			"s1",
			"s2",
			"s3",
		],
		"timetable_pattern": [
			{
				"id": "IC1_A_15",
				"label": "Nantes - Lyon Perrache",
				"interval_minutes": 120,
				"departure_minute": 15,
				"stop_pattern": "local",
				"info_messages": [],
				"first_departure":"5:15:00",
				"last_departure":"20:15:00",
				"is_reversed": false,
				"arrival_minutes": [
					null,
					15,
					45
				],
				"departure_minutes": [
					257,
					287,
					null
				]
			}
		],
		"timetables": 
		[
			{
				"id": "IC1-1",
				"label": "100",
				"calendar_pattern": "Weekday",
				"stop_pattern" : "local",
				"info_messages": [],
				"arrival_minutes": [
					null,
					15,
					45
				],
				"departure_minutes": [
					257,
					287,
					null
				]
			}
		]
	}
	)";

	static void Test_Deserialize(const std::string& str)
	{
		auto jsonObjectMapper = oatpp::json::ObjectMapper();
		auto object = jsonObjectMapper.readFromString<oatpp::Object<O::DTO::Line>>(str);
	}

	static inline const std::string serialized = "";

	static std::string Test_Serialize()
	{

	}
};

#endif //TEST_EXEMPLE_LINE_H