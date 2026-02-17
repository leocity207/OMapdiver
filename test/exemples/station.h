#ifndef TEST_EXEMPLE_STATION_PATTERN_H
#define TEST_EXEMPLE_STATION_PATTERN_H

#include "src/dto/stations/station.h"

struct Station_Exemple
{
	static std::string json = R"(
	{
		"label": "Rennes",
		"code": "FR_03190_0",
		"lines" : ["l1","l2"],
		"direction": {
			"LGV_FR8_A_27": "s1",
			"LER_NOR2_A_05": "s1",
			"LGV_FR4_A_00": "s2",
		}
	}
	)";

	static void Test_Deserialize()
	{
		auto jsonObjectMapper = oatpp::json::ObjectMapper();
		auto object = jsonObjectMapper.readFromString<oatpp::Object<O::DTO::Station>>(str);
	}

	static std::string serialized = "";

	static std::string Test_Serialize()
	{

	}
};

#endif //TEST_EXEMPLE_STATION_PATTERN_H