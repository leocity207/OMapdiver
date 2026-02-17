#include "dto_tests.h"

template<class Exemple>
void DTO_Test<Exemple>::onRun()
{
	OATPP_LOGi("[Info]", "deserialization Test");
	Exemple::Test_Deserialize(Exemple::json);

	OATPP_LOGi("[Info]", "serialization Test");
	auto str = Exemple::Test_Serialize();
	OATPP_ASSERT(str == Exemple::serialized);
}
