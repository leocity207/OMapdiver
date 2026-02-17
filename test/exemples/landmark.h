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
		"label": "big river title",
	}
	)";

	static void Test_Deserialize(const std::string& str)
	{
		auto jsonObjectMapper = oatpp::json::ObjectMapper();
		auto object = jsonObjectMapper.readFromString<oatpp::Object<O::DTO::Landmark>>(str);
	}

	static inline const std::string serialized = "";

	static std::string Test_Serialize()
	{

	}
};

#endif //TEST_EXEMPLE_LANDMARK_H