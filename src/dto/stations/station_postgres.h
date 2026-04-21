#ifndef POSTGRESS_STATION_DTO_H
#define POSTGRESS_STATION_DTO_H

#include "src/dto/common/base.h"

#include OATPP_CODEGEN_BEGIN(DTO)


namespace O::DTO
{
	/**
	* @brief DTO about stations
	*/
	class Postgres_Station : public Base
	{

	public:
		DTO_INIT(Postgres_Station, Base)

		// Mandatory fields
		DTO_FIELD(String, url, "url");
		DTO_FIELD(List<String>, lines, "lines");
		DTO_FIELD(String, directions, "directions");

		// Optional fields
		DTO_FIELD(Boolean, have_disabled_equipment, "have_disabled_equipment");
		DTO_FIELD(Boolean, have_bike_parking, "have_bike_parking");
		DTO_FIELD(Boolean, have_car_parking, "have_car_parking");
		DTO_FIELD(Boolean, have_car_sharing, "have_car_sharing");
		DTO_FIELD(String, opening_hour, "opening_hour");
		DTO_FIELD(String, closing_hour, "closing_hour");
	};
}

#include OATPP_CODEGEN_END(DTO)

#endif /* POSTGRESS_STATION_DTO_H */