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
		"id": "EXPRESS_1",
		"label": "Express Line 1",
		"url":  "/line/express1",
		"color": {
			"default": "#FF0000",
			"night": "#880000"
		},
		"icon":"<svg>icon</svg>"
		"stations": [
			"s1",
			"s2",
			"s3"
		],
		"patterns": [
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
				"arrival_times": [
					null,
					15,
					45
				],
				"departure_times": [
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

		OATPP_ASSERT(object->id == "EXPRESS_1");
		OATPP_ASSERT(object->label == "Express Line 1");
		OATPP_ASSERT(object->url == "/line/express1");
		OATPP_ASSERT(object->icon == "<svg>icon</svg>");

		OATPP_ASSERT(object->stations->size() == 3);

		auto it = object->stations->begin();
		OATPP_ASSERT(*(it) == "s1");
		OATPP_ASSERT(*(++it) == "s2");
		OATPP_ASSERT(*(++it) == "s3");

		OATPP_ASSERT(object->color->size() == 2);

		auto it_dir = object->color->begin();

		OATPP_ASSERT(it_dir->first == "default");
		OATPP_ASSERT(it_dir->second == "#FF0000");
		it_dir++;
		OATPP_ASSERT(it_dir->first == "night");
		OATPP_ASSERT(it_dir->second == "#880000");
		it_dir++;

		// PATTERNS
		OATPP_ASSERT(object->patterns->size() == 1);
		auto pattern = object->patterns->front();

		OATPP_ASSERT(pattern->id == "IC1_A_15");
		OATPP_ASSERT(pattern->label == "Nantes - Lyon Perrache");
		OATPP_ASSERT(pattern->interval_minutes == 120);
		OATPP_ASSERT(pattern->departure_minute == 15);
		OATPP_ASSERT(pattern->stop_pattern == "local");
		OATPP_ASSERT(pattern->first_departure == "5:15:00");
		OATPP_ASSERT(pattern->last_departure == "20:15:00");
		OATPP_ASSERT(pattern->is_reversed == false);

		OATPP_ASSERT(pattern->info_messages->size() == 0);
		OATPP_ASSERT(pattern->arrival_minutes->size() == 3);
		auto it2 = pattern->arrival_minutes->begin();
		OATPP_ASSERT(it2->getPtr() == nullptr);
		OATPP_ASSERT(*(++it2) == 15);
		OATPP_ASSERT(*(++it2) == 45);

		OATPP_ASSERT(pattern->departure_minutes->size() == 3);
		auto it3 = pattern->departure_minutes->begin();
		OATPP_ASSERT(*(it3) == 257);
		OATPP_ASSERT(*(++it3) == 287);
		OATPP_ASSERT((++it3)->getPtr() == nullptr);

		// TIMETABLES
		OATPP_ASSERT(object->timetables->size() == 1);
		auto timetable = object->timetables->front();

		OATPP_ASSERT(timetable->id == "IC1-1");
		OATPP_ASSERT(timetable->label == "100");
		OATPP_ASSERT(timetable->calendar_pattern == "Weekday");
		OATPP_ASSERT(timetable->stop_pattern == "local");

		OATPP_ASSERT(timetable->info_messages->size() == 0);
		OATPP_ASSERT(timetable->arrival_times->size() == 3);
		auto it4 = timetable->arrival_times->begin();
		OATPP_ASSERT(it4->getPtr() == nullptr);
		OATPP_ASSERT(*(++it4) == 15);
		OATPP_ASSERT(*(++it4) == 45);

		OATPP_ASSERT(timetable->departure_times->size() == 3);
		auto it5 = timetable->departure_times->begin();
		OATPP_ASSERT(*(it5) == 257);
		OATPP_ASSERT(*(++it5) == 287);
		OATPP_ASSERT((++it5)->getPtr() == nullptr);

		OATPP_ASSERT(timetable->Has_Afluence() == false);
		OATPP_ASSERT(timetable->Has_Composition() == false);
	}

	static inline const std::string serialized = R"({"id":"EXPRESS_1","label":"Express Line 1","url":"\/line\/express1","color":{"default":"#FF0000","night":"#880000"},"icon":"<svg>icon<\/svg>","stations":["s1","s2","s3"],"patterns":[{"id":"IC1_A_15","label":"Nantes - Lyon Perrache","interval_minutes":120,"departure_minute":15,"first_departure":"5:15:00","last_departure":"20:15:00","stop_pattern":"local","is_reversed":false,"info_messages":[],"arrival_minutes":[null,15,45],"departure_minutes":[257,287,null]}],"timetables":[{"id":"IC1-1","label":"100","stop_pattern":"local","calendar_pattern":"Weekday","info_messages":[],"departure_times":[257,287,null],"arrival_times":[null,15,45],"afluence":null,"composition":null}]})";

	static std::string Test_Serialize()
	{
		auto line = O::DTO::Line::createShared();
		line->id = "EXPRESS_1";
		line->label = "Express Line 1";
		line->url = "/line/express1";
		line->icon = "<svg>icon</svg>";
		line->color = { {"default", "#FF0000"},{ "night", "#880000"} };
		line->stations = { "s1" ,"s2", "s3" };

		auto pattern = O::DTO::Pattern::createShared();
		pattern->id = "IC1_A_15";
		pattern->label = "Nantes - Lyon Perrache";
		pattern->interval_minutes = 120;
		pattern->departure_minute = 15;
		pattern->stop_pattern = "local";
		pattern->info_messages = {};
		pattern->first_departure = "5:15:00";
		pattern->last_departure = "20:15:00";
		pattern->is_reversed = false;
		pattern->arrival_minutes = { nullptr, 15, 45 };
		pattern->departure_minutes = { 257, 287, nullptr };

		line->patterns = { pattern };
		
		auto service_mission = O::DTO::Service_Mission::createShared();
		service_mission->id = "IC1-1";
		service_mission->label = "100";
		service_mission->calendar_pattern = "Weekday";
		service_mission->stop_pattern = "local";
		service_mission->info_messages = {};
		service_mission->arrival_times = { nullptr, 15, 45 };
		service_mission->departure_times = { 257, 287, nullptr };

		line->timetables = { service_mission };

		auto jsonObjectMapper = oatpp::json::ObjectMapper();
		return  jsonObjectMapper.writeToString(line);
	}
};

#endif //TEST_EXEMPLE_LINE_H