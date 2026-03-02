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
			"s4"
		],
		"landmarks" : [
		],
		"lines": [
			"l1",
			"l2"
		],
		"operators" : [
		],
		"organisers" : [
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

		OATPP_ASSERT(object->calendar_patterns->size() == 2);
		auto it_cal_pat = object->calendar_patterns->begin();
		OATPP_ASSERT(*(it_cal_pat) == "p1");
		OATPP_ASSERT(*(++it_cal_pat) == "p2");

		OATPP_ASSERT(object->stations->size() == 4);
		auto it_station= object->stations->begin();
		OATPP_ASSERT(*(it_station) == "s1");
		OATPP_ASSERT(*(++it_station) == "s2");
		OATPP_ASSERT(*(++it_station) == "s3");
		OATPP_ASSERT(*(++it_station) == "s4");

		OATPP_ASSERT(object->landmarks->size() == 0);
		OATPP_ASSERT(object->lines->size() == 2);
		auto it_lines = object->lines->begin();
		OATPP_ASSERT(*(it_lines) == "l1");
		OATPP_ASSERT(*(++it_lines) == "l2");

		OATPP_ASSERT(object->operators->size() == 0);
		OATPP_ASSERT(object->organisers->size() == 0);
		OATPP_ASSERT(object->stop_patterns->size() == 3);
		auto it_stop_pattern = object->stop_patterns->begin();
		OATPP_ASSERT(*(it_stop_pattern) == "express");
		OATPP_ASSERT(*(++it_stop_pattern) == "local");
		OATPP_ASSERT(*(++it_stop_pattern) == "rapid");

		OATPP_ASSERT(object->territories->size() == 0);
	}

	static inline const std::string serialized = R"({"calendar_patterns":["p1","p2"],"landmarks":[],"lines":["l1","l2"],"operators":[],"organisers":[],"stations":["s1","s2","s3","s4"],"stop_patterns":["express","local","rapid"],"territories":[]})";

	static std::string Test_Serialize()
	{
		auto network = O::DTO::Network::createShared();
		network->calendar_patterns = { "p1","p2" };
		network->stations = { "s1", "s2", "s3", "s4", };
		network->landmarks = {};
		network->lines = { "l1", "l2", };
		network->operators = {};
		network->organisers = {};
		network->stop_patterns = { "express", "local", "rapid" };
		network->territories  = {};

		auto jsonObjectMapper = oatpp::json::ObjectMapper();
		return  jsonObjectMapper.writeToString(network);
	}
};

#endif //TEST_EXMPLE_NETWORK_H