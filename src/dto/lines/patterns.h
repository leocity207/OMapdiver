#ifndef PATTERN_DTO_H
#define PATTERN_DTO_H

// DTO
#include "src/dto/common/base.h"
#include "src/dto/common/info_message.h"

#include OATPP_CODEGEN_BEGIN(DTO)

namespace O::DTO
{
	class Pattern : public Base
	{

	public:
		DTO_INIT(Pattern, Base)

		DTO_FIELD(String, line_id, "line_id");
		DTO_FIELD(UInt16, interval_time, "interval_time");
		DTO_FIELD(UInt16, departure_time, "departure_time");
		DTO_FIELD(UInt16, first_departure, "first_departure");
		DTO_FIELD(UInt16, last_departure, "last_departure");
		DTO_FIELD(String, stop_pattern, "stop_pattern");
		DTO_FIELD(Boolean, is_reversed, "is_reversed");

		DTO_FIELD(List<Object<Info_Message>>, info_messages, "info_messages");

		DTO_FIELD(Vector<Int16>, arrival_times, "arrival_times");
		DTO_FIELD(Vector<Int16>, departure_times, "departure_times");
	};
}


#include OATPP_CODEGEN_END(DTO)

#endif // PATTERN_DTO_H
