#ifndef LINE_TIMETABLE_DTO_H
#define LINE_TIMETABLE_DTO_H

#include <oatpp/macro/codegen.hpp>
#include <oatpp/Types.hpp>

//DTO
#include "service_mission.h"

#include OATPP_CODEGEN_BEGIN(DTO)

namespace O::DTO
{
	class Timetable_Pattern : public oatpp::DTO {
		public:
			DTO_INIT(Timetable_Pattern, DTO)

			// Required field
			DTO_FIELD(String, key, "key");
			DTO_FIELD(String, label, "label");

			// Optional field
			DTO_FIELD(Boolean, exceptional, "exceptional") = nullptr;
			DTO_FIELD(String, info, "info") = nullptr;

			bool Has_Exceptional()
	};
}

#include OATPP_CODEGEN_END(DTO)

#endif /* LINE_TIMETABLE_DTO_H */
