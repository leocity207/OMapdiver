#ifndef FULL_TIMETABLE_DTO_H
#define FULL_TIMETABLE_DTO_H

#include <oatpp/macro/codegen.hpp>
#include <oatpp/Types.hpp>

//DTO
#include "service_mission.h"

#include OATPP_CODEGEN_BEGIN(DTO)

namespace O::DTO
{
	class Full_Timetable : public Base 
	{
		public:
			DTO_INIT(Full_Timetable_DTO, DTO)

			DTO_FIELD(Fields<String>, urls, "urls");
			DTO_FIELD(Fields<String>, color, "color");
			DTO_FIELD(String, svg_icon, "svg_icon");
			DTO_FIELD(String, type, "type");
			DTO_FIELD(String, valid_from, "valid_from");
			DTO_FIELD(String, valid_until, "valid_until");
			DTO_FIELD(List<Service_Mission_DTO>, service_missions, "service_missions");
	};
}
#include OATPP_CODEGEN_END(DTO)

#endif /* FULL_TIMETABLE_DTO_H */
