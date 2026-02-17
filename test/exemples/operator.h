#ifndef TEST_EXEMPLE_OPERATOR_H
#define TEST_EXEMPLE_OPERATOR_H

#include "src/dto/operators/operator.h"

struct Operator_Exemple
{
	static std::string json = R"(
	{
		"id" : "SNCF",
		"label": "sociter national des chemin de fer",
	}
	)";

	static void Test_Deserialize()
	{

	}

	static std::string serialized = "";

	static std::string Test_Serialize()
	{
		auto jsonObjectMapper = oatpp::json::ObjectMapper();
		auto object = jsonObjectMapper.readFromString<oatpp::Object<O::DTO::Operator>>(str);
	}
};

#endif //TEST_EXEMPLE_OPERATOR_H