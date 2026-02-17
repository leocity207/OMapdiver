#ifndef STATION_DTO_H
#define STATION_DTO_H

#include "src/dto/common/base.h"

#include OATPP_CODEGEN_BEGIN(DTO)


namespace O::DTO
{
	/**
	* @brief DTO about stations
	*/
	class Station_DTO : public Base
	{

	public:
		DTO_INIT(Station_DTO, DTO)

		// Mandatory fields
		DTO_FIELD(String, url, "url");
		DTO_FIELD(List<String>, lines, "lines");
		DTO_FIELD(Fields<String>, directions, "direction");

		// Optional fields
		DTO_FIELD(Boolean, have_disabled_equipment, "have_disabled_equipment");
		DTO_FIELD(Boolean, have_bike_parking, "have_bike_parking");
		DTO_FIELD(Boolean, have_car_parking, "have_car_parking");
		DTO_FIELD(Boolean, have_car_sharing, "have_car_parking");
		DTO_FIELD(String, opening_hour, "opening_hour");
		DTO_FIELD(String, closing_hour, "closing_hour");

		// Optional field checker
		bool Has_Have_Disabled_Equipment() const;
		bool Has_Have_Bike_Parking() const;
		bool Has_Have_Car_Parkingt() const;
		bool Has_Have_Car_Sharing() const;
		bool Has_Opening_Hour() const;
		bool Has_Closing_Hour() const;
	};
}

#include OATPP_CODEGEN_END(DTO)

#endif /* STATION_DTO_H */