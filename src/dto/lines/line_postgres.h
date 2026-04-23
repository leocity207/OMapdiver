#ifndef LINE_POSTGRESS_DTO_H
#define LINE_POSTGRESS_DTO_H


//DTO
#include "src/dto/common/base.h"
#include "patterns.h"
#include "service_mission.h"

#include OATPP_CODEGEN_BEGIN(DTO)

namespace O::DTO
{
	class Postgres_Line : public Base {
		public:
			DTO_INIT(Postgres_Line, Base)

			DTO_FIELD(String, url, "url");
			DTO_FIELD(String, color, "color");
			DTO_FIELD(String, icon, "icon");
			DTO_FIELD(List<String>, stations, "stations");
	};
}

#include OATPP_CODEGEN_END(DTO)

#endif /* LINE_POSTGRESS_DTO_H */
