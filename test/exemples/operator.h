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
		"label": "sociter national des chemin de fer",
	}
	)";

	static void Test_Deserialize()
	{

	}

	static inline const std::string serialized = "";

	static std::string Test_Serialize(const std::string& str)
	{
		auto jsonObjectMapper = oatpp::json::ObjectMapper();
		auto object = jsonObjectMapper.readFromString<oatpp::Object<O::DTO::Operator>>(str);
	}
};

#endif //TEST_EXEMPLE_OPERATOR_H