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

bool O::DTO::Station::Has_Opening_Hour() const
{
	return opening_hour.getPtr() != nullptr;
}

bool O::DTO::Station::Has_Closing_Hour() const
{
	return closing_hour.getPtr() != nullptr;
}