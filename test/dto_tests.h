#ifndef DTO_TEST_H
#define DTO_TEST_H

#include <oatpp-test/UnitTest.hpp>

template<class Exemple>
class DTO_Test : public oatpp::test::UnitTest {
public:

	DTO_Test() : UnitTest("DTO_Test") {}
	void onRun() override;

};

#endif //DTO_TEST_H