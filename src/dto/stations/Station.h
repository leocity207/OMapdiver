#ifndef STATION_DTO_H
#define STATION_DTO_H

#include "src/dto/common/base.h"

#include OATPP_CODEGEN_BEGIN(DTO)


namespace O::DTO
{
	class Station_DTO : public Base
	{

	public:
		DTO_INIT(Station_DTO, DTO)
		DTO_FIELD(Boolean, disabled_equipment, "disabled_equipment");
		DTO_FIELD(Boolean, bike_parking, "bike_parking");
		DTO_FIELD(Boolean, car_parking, "car_parking");
		DTO_FIELD(String, opening_hour, "opening_hour");
		DTO_FIELD(String, closing_hour, "closing_hour");
		DTO_FIELD(List<String>, linked_lines, "lines");
		DTO_FIELD(Fields<String>, directions, "direction");
	};
}

#include OATPP_CODEGEN_END(DTO)

#endif /* STATION_DTO_H */