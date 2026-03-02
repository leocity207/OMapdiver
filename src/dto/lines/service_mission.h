#ifndef SERVICE_MISSION_DTO_H
#define SERVICE_MISSION_DTO_H

// DTO
#include "src/dto/common/base.h"
#include "src/dto/common/info_message.h"

#include OATPP_CODEGEN_BEGIN(DTO)

namespace O::DTO
{
	class Service_Mission : public Base
	{

	public:

		DTO_INIT(Service_Mission, Base)

		// Mandatory Fields
		DTO_FIELD(String, stop_pattern, "stop_pattern");
		DTO_FIELD(String, calendar_pattern, "calendar_pattern");
		DTO_FIELD(List<Object<Info_Message>>, info_messages, "info_messages");
		DTO_FIELD(Vector<Int16>, departure_times, "departure_times");
		DTO_FIELD(Vector<Int16>, arrival_times, "arrival_times");

		// Optional Fields
		DTO_FIELD(Int16, afluence, "afluence");
		DTO_FIELD(Int16, composition, "composition");

		bool Has_Afluence() const;
		bool Has_Composition() const;
	};
}

#include OATPP_CODEGEN_END(DTO)

#endif /* SERVICE_MISSION_DTO_H */
