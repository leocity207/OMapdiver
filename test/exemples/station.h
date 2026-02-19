#ifndef TEST_EXEMPLE_STATION_PATTERN_H
#define TEST_EXEMPLE_STATION_PATTERN_H

// DTO
#include "src/dto/stations/station.h"

// OATPP
#include <oatpp/json/ObjectMapper.hpp>

struct Station_Exemple
{
	static inline const  std::string json = R"(
	{
		"label": "Rennes",
		"id": "FR_03190_0",
		"lines" : ["l1","l2"],
		"directions": {
			"LGV_FR8_A_27": "s1",
			"LER_NOR2_A_05": "s1",
			"LGV_FR4_A_00": "s2"
		}
	}
	)";

	static void Test_Deserialize(const std::string& str)
	{
		auto jsonObjectMapper = oatpp::json::ObjectMapper();
		auto object = jsonObjectMapper.readFromString<oatpp::Object<O::DTO::Station>>(str);

		OATPP_ASSERT(object->id == "FR_03190_0");
		OATPP_ASSERT(object->label == "Rennes");

		OATPP_ASSERT(object->lines->size() == 2);

		auto it = object->lines->begin();
		OATPP_ASSERT(*(it) == "l1");
		OATPP_ASSERT(*(++it) == "l2");

		OATPP_ASSERT(object->directions->size() == 3);

		auto it_dir = object->directions->begin();
	
		OATPP_ASSERT(it_dir->first == "LGV_FR8_A_27");
		OATPP_ASSERT(it_dir->second == "s1");
		it_dir++;
		OATPP_ASSERT(it_dir->first == "LER_NOR2_A_05");
		OATPP_ASSERT(it_dir->second == "s1");
		it_dir++;
		OATPP_ASSERT(it_dir->first == "LGV_FR4_A_00");
		OATPP_ASSERT(it_dir->second == "s2");
		it_dir++;

		OATPP_ASSERT(object->Has_Have_Disabled_Equipment() == false);
		OATPP_ASSERT(object->Has_Have_Bike_Parking() == false);
		OATPP_ASSERT(object->Has_Have_Car_Parkingt() == false);
		OATPP_ASSERT(object->Has_Have_Car_Sharing() == false);
		OATPP_ASSERT(object->Has_Opening_Hour() == false);
		OATPP_ASSERT(object->Has_Closing_Hour() == false);

	}

	static inline const std::string serialized = R"({"id":"FR_03190_0","label":"Rennes","url":null,"lines":["l1","l2"],"directions":{"LGV_FR8_A_27":"s1","LER_NOR2_A_05":"s1","LGV_FR4_A_00":"s2"},"have_disabled_equipment":null,"have_bike_parking":null,"have_car_parking":null,"opening_hour":null,"closing_hour":null})";

	static std::string Test_Serialize()
	{
		auto station = O::DTO::Station::createShared();
		station->id = "FR_03190_0";
		station->label = "Rennes";
		station->lines = {"l1","l2"};
		station->directions = { {"LGV_FR8_A_27", "s1"}, {"LER_NOR2_A_05", "s1"},{"LGV_FR4_A_00", "s2"} };
		auto jsonObjectMapper = oatpp::json::ObjectMapper();
		return  jsonObjectMapper.writeToString(station);
	}
};

#endif //TEST_EXEMPLE_STATION_PATTERN_H