#ifndef LINE_DTO_H
#define LINE_DTO_H


//DTO
#include "src/dto/common/base.h"

//DTO
#include "timetable_pattern.h"
#include "timetable_cadencing.h"
#include "full_timetable.h"

#include OATPP_CODEGEN_BEGIN(DTO)

namespace O::DTO
{
	class Line : public Base {
		public:
			DTO_INIT(Line, ::DTO)

			DTO_FIELD(Fields<String>, urls, "urls");
			DTO_FIELD(Fields<String>, color, "color");
			DTO_FIELD(String, full_icon, "full_icon");
			DTO_FIELD(String, square_icon, "square_icon");
			DTO_FIELD(List<String>, linked_stations, "stations");
			DTO_FIELD(List<Object<Full_Timetable>>, patterns, "timetable_cadencing");
			DTO_FIELD(List<Object<Timetable_Cadencing>>, timetable_cadencing, "timetable_cadencing");
	};
}

#include OATPP_CODEGEN_END(DTO)

#endif /* LINE_DTO_H */
