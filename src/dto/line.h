#ifndef LINE_DTO_H
#define LINE_DTO_H

#include <oatpp/macro/codegen.hpp>
#include <oatpp/Types.hpp>

//DTO
#include "timetable_pattern.h"
#include "timetable_cadencing.h"
#include "full_timetable.h"

#include OATPP_CODEGEN_BEGIN(DTO)

class Line_DTO : public oatpp::DTO {
	public:
		DTO_INIT(Line_DTO, DTO)

		DTO_FIELD(String, code, "code");
		DTO_FIELD(String, label, "label");
		DTO_FIELD(Fields<String>, urls, "urls");
		DTO_FIELD(Fields<String>, color, "color");
		DTO_FIELD(String, full_icon, "full_icon");
		DTO_FIELD(String, square_icon, "square_icon");
		DTO_FIELD(List<String>, linked_stations, "stations");
		DTO_FIELD(List<Object<Full_Timetable_DTO>>, patterns, "timetable_cadencing");
		DTO_FIELD(List<Object<Timetable_Cadencing_DTO>>, timetable_cadencing, "timetable_cadencing");
};

#include OATPP_CODEGEN_END(DTO)

#endif /* LINE_DTO_H */
