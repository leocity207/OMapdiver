#ifndef TEST_EXEMPLE_LANDMARK_H
#define TEST_EXEMPLE_LANDMARK_H

// DTO
#include "src/dto/landmarks/landmark.h"

// OATPP
#include <oatpp/json/ObjectMapper.hpp>

struct Landmark_Exemple
{
	static inline const  std::string json = R"(
	{
		"id" : "my_river",
		"label": "big river title"
	}
	)";

	static void Test_Deserialize(const std::string& str)
	{
		auto jsonObjectMapper = oatpp::json::ObjectMapper();
		auto object = jsonObjectMapper.readFromString<oatpp::Object<O::DTO::Landmark>>(str);

		OATPP_ASSERT(object->id == "my_river");
		OATPP_ASSERT(object->label == "big river title");
	}

	static inline const std::string serialized = R"({"id":"my_river","label":"big river title"})";

	static std::string Test_Serialize()
	{
		auto landmark = O::DTO::Landmark::createShared();
		landmark->id = "my_river";
		landmark->label = "big river title";
		auto jsonObjectMapper = oatpp::json::ObjectMapper();
		return  jsonObjectMapper.writeToString(landmark);
	}
};

#endif //TEST_EXEMPLE_LANDMARK_H