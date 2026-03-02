#ifndef DTO_TEST_H
#define DTO_TEST_H

#include <oatpp-test/UnitTest.hpp>

template<class Exemple>
class DTO_Test : public oatpp::test::UnitTest {
public:

	DTO_Test() : UnitTest("DTO_Test") {}
	void onRun() override
	{
		OATPP_LOGi("[Info]", "deserialization Test");
		Exemple::Test_Deserialize(Exemple::json);

		OATPP_LOGi("[Info]", "serialization Test");
		auto str = Exemple::Test_Serialize();
		OATPP_ASSERT(str == Exemple::serialized);
	}

};

#endif //DTO_TEST_H