#ifndef LINE_DTO_H
#define LINE_DTO_H


//DTO
#include "src/dto/common/base.h"
#include "patterns.h"
#include "service_mission.h"

#include OATPP_CODEGEN_BEGIN(DTO)

namespace O::DTO
{
	class Line : public Base {
		public:
			DTO_INIT(Line, DTO)

			DTO_FIELD(String, urls, "urls");
			DTO_FIELD(Fields<String>, color, "color");
			DTO_FIELD(String, full_icon, "icon");
			DTO_FIELD(List<String>, stations, "stations");
			DTO_FIELD(List<Object<Pattern>>, patterns, "patterns");
			DTO_FIELD(List<Object<Service_Mission>>, timetables, "timetables");
	};
}

#include OATPP_CODEGEN_END(DTO)

#endif /* LINE_DTO_H */
