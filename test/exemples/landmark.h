#ifndef TEST_EXEMPLE_LANDMARK_H
#define TEST_EXEMPLE_LANDMARK_H

#include "src/dto/landmarks/landmark.h"

struct Landmark_Exemple
{
	static std::string json = R"(
	{
		"id" : "my_river",
		"label": "big river title",
	}
	)";

	static void Test_Deserialize()
	{
		auto jsonObjectMapper = oatpp::json::ObjectMapper();
		auto object = jsonObjectMapper.readFromString<oatpp::Object<O::DTO::Landmark>>(str);
	}

	static std::string serialized = "";

	static std::string Test_Serialize()
	{

	}
};

#endif //TEST_EXEMPLE_LANDMARK_H