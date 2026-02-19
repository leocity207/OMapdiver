#ifndef TEST_EXEMPLE_OPERATOR_H
#define TEST_EXEMPLE_OPERATOR_H

// DTO
#include "src/dto/operators/operator.h"

// OATPP
#include <oatpp/json/ObjectMapper.hpp>

struct Operator_Exemple
{
	static inline const  std::string json = R"(
	{
		"id" : "SNCF",
		"label": "sociter national des chemin de fer"
	}
	)";

	static void Test_Deserialize(const std::string& str)
	{
		auto jsonObjectMapper = oatpp::json::ObjectMapper();
		auto object = jsonObjectMapper.readFromString<oatpp::Object<O::DTO::Landmark>>(str);

		OATPP_ASSERT(object->id == "SNCF");
		OATPP_ASSERT(object->label == "sociter national des chemin de fer");
	}

	static inline const std::string serialized = R"({"id":"SNCF","label":"sociter national des chemin de fer"})";

	static std::string Test_Serialize()
	{
		auto op = O::DTO::Operator::createShared();
		op->id = "SNCF";
		op->label = "sociter national des chemin de fer";
		auto jsonObjectMapper = oatpp::json::ObjectMapper();
		return  jsonObjectMapper.writeToString(op);
	}
};

#endif //TEST_EXEMPLE_OPERATOR_H