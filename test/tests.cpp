
#include "dto_tests.h"
#include <iostream>

#include "exemples/calendar_pattern.h"
#include "exemples/landmark.h"
#include "exemples/line.h"
#include "exemples/network.h"
#include "exemples/operator.h"
#include "exemples/organiser.h"
#include "exemples/station.h"
#include "exemples/stop_patterns.h"
#include "exemples/territory.h"

void runTests() {
	OATPP_RUN_TEST(DTO_Test<Calendar_Pattern_Exemple>);
	OATPP_RUN_TEST(DTO_Test<Landmark_Exemple>);
	OATPP_RUN_TEST(DTO_Test<Line_Exemple>);
	OATPP_RUN_TEST(DTO_Test<Network_Exemple>);
	OATPP_RUN_TEST(DTO_Test<Operator_Exemple>);
	OATPP_RUN_TEST(DTO_Test<Organiser_Exemple>);
	OATPP_RUN_TEST(DTO_Test<Station_Exemple>);
	OATPP_RUN_TEST(DTO_Test<Stop_Pattern_Exemple>);
	OATPP_RUN_TEST(DTO_Test<Territory_Exemple>);
}

int main() {

	oatpp::Environment::init();

	runTests();

	/* Print how much objects were created during app running, and what have left-probably leaked */
	/* Disable object counting for release builds using '-D OATPP_DISABLE_ENV_OBJECT_COUNTERS' flag for better performance */
	std::cout << "\nEnvironment:\n";
	std::cout << "objectsCount = " << oatpp::Environment::getObjectsCount() << "\n";
	std::cout << "objectsCreated = " << oatpp::Environment::getObjectsCreated() << "\n\n";

	OATPP_ASSERT(oatpp::Environment::getObjectsCount() == 0);

	oatpp::Environment::destroy();

	return 0;
}
