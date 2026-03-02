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
		"label": "île de france mobilité"
	}
	)";

	static void Test_Deserialize(const std::string& str)
	{
		auto jsonObjectMapper = oatpp::json::ObjectMapper();
		auto object = jsonObjectMapper.readFromString<oatpp::Object<O::DTO::Organiser>>(str);

		OATPP_ASSERT(object->id == "idfm");
		OATPP_ASSERT(object->label == "île de france mobilité");
	}

	static inline const std::string serialized = R"({"id":"idfm","label":"\u00EEle de france mobilit\u00E9"})";

	static std::string Test_Serialize()
	{
		auto organiser = O::DTO::Organiser::createShared();
		organiser->id = "idfm";
		organiser->label = "île de france mobilité";
		auto jsonObjectMapper = oatpp::json::ObjectMapper();
		return  jsonObjectMapper.writeToString(organiser);
	}
};

#endif //TEST_EXEMPLE_ORGANISER_H