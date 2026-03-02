#include "service_mission.h"

bool O::DTO::Service_Mission::Has_Afluence() const
{
	return afluence.getPtr() != nullptr;
}

bool O::DTO::Service_Mission::Has_Composition() const
{
	return composition.getPtr() != nullptr;
}
