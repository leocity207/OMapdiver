#ifndef TEST_EXEMPLE_ORGANISER_H
#define TEST_EXEMPLE_ORGANISER_H

// DTO
#include "src/dto/organisers/organiser.h"

// OATPP
#include <oatpp/json/ObjectMapper.hpp>

struct Organiser_Exemple
{
	static inline const  std::string json = R"(
	{
		"id" : "idfm",
		"label": "île de france mobilité",
	}
	)";

	static void Test_Deserialize(const std::string& str)
	{
		auto jsonObjectMapper = oatpp::json::ObjectMapper();
		auto object = jsonObjectMapper.readFromString<oatpp::Object<O::DTO::Organiser>>(str);
	}

	static inline const std::string serialized = "";

	static std::string Test_Serialize()
	{

	}
};

#endif //TEST_EXEMPLE_ORGANISER_H