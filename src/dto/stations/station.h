#ifndef STATION_DTO_H
#define STATION_DTO_H

#include "src/dto/common/base.h"

#include "station_postgres.h"

#include OATPP_CODEGEN_BEGIN(DTO)

namespace O::DTO
{
	/**
	* @brief DTO about stations
	*/
	class Station : public Base
	{

	public:
		DTO_INIT(Station, Base)

		// Mandatory fields
		DTO_FIELD(String, url, "url");
		DTO_FIELD(List<String>, lines, "lines");
		DTO_FIELD(Fields<String>, directions, "directions");

		// Optional fields
		DTO_FIELD(Boolean, have_disabled_equipment, "have_disabled_equipment");
		DTO_FIELD(Boolean, have_bike_parking, "have_bike_parking");
		DTO_FIELD(Boolean, have_car_parking, "have_car_parking");
		DTO_FIELD(Boolean, have_car_sharing, "have_car_sharing");
		DTO_FIELD(UInt16, opening_time, "opening_time");
		DTO_FIELD(UInt16, closing_time, "closing_time");

		// Optional field checker
		bool Has_Have_Disabled_Equipment() const;
		bool Has_Have_Bike_Parking() const;
		bool Has_Have_Car_Parkingt() const;
		bool Has_Have_Car_Sharing() const;
		bool Has_Opening_Time() const;
		bool Has_Closing_Time() const;

		// bridge
		static oatpp::Object<Station> From_Postgres(const oatpp::Object<Postgres_Station>& src, const std::shared_ptr<oatpp::json::ObjectMapper>& jsonMapper);
	};
}

#include OATPP_CODEGEN_END(DTO)

#endif /* STATION_DTO_H */