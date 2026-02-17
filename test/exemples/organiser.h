#ifndef TEST_EXEMPLE_ORGANISER_H
#define TEST_EXEMPLE_ORGANISER_H

#include "src/dto/organisers/organiser.h"

struct Organiser_Exemple
{
	static std::string json = R"(
	{
		"id" : "idfm",
		"label": "île de france mobilité",
	}
	)";

	static void Test_Deserialize()
	{
		auto jsonObjectMapper = oatpp::json::ObjectMapper();
		auto object = jsonObjectMapper.readFromString<oatpp::Object<O::DTO::Organiser>>(str);
	}

	static std::string serialized = "";

	static std::string Test_Serialize()
	{

	}
};

#endif //TEST_EXEMPLE_ORGANISER_H