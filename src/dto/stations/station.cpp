#include "station.h"

bool O::DTO::Station::Has_Have_Disabled_Equipment() const
{
	return have_disabled_equipment.getPtr() != nullptr;
}

bool O::DTO::Station::Has_Have_Bike_Parking() const
{
	return have_bike_parking.getPtr() != nullptr;
}

bool O::DTO::Station::Has_Have_Car_Parkingt() const
{
	return have_car_parking.getPtr() != nullptr;
}

bool O::DTO::Station::Has_Have_Car_Sharing() const
{
	return have_car_sharing.getPtr() != nullptr;
}

bool O::DTO::Station::Has_Opening_Time() const
{
	return opening_time.getPtr() != nullptr;
}

bool O::DTO::Station::Has_Closing_Time() const
{
	return closing_time.getPtr() != nullptr;
}

oatpp::Object<O::DTO::Station> O::DTO::Station::From_Postgres(const oatpp::Object<O::DTO::Postgres_Station>& src, const std::shared_ptr<oatpp::json::ObjectMapper>& jsonMapper)
{
	if (!src) {
		return nullptr;
	}

	auto station = Station::createShared();

	station->id = src->id;
	station->label = src->label;
	station->url = src->url;
	station->lines = src->lines;
	station->have_disabled_equipment = src->have_disabled_equipment;
	station->have_bike_parking = src->have_bike_parking;
	station->have_car_parking = src->have_car_parking;
	station->have_car_sharing = src->have_car_sharing;
	station->opening_time = src->opening_time;
	station->closing_time = src->closing_time;

	station->directions = oatpp::Fields<oatpp::String>::createShared();

	if (src->directions) {
		try {
			station->directions = jsonMapper->readFromString<oatpp::Fields<oatpp::String>>(src->directions);
		} catch (const std::exception&) {
			station->directions = oatpp::Fields<oatpp::String>::createShared();
		}
	}

	return station;
}