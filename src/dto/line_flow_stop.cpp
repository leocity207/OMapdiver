#include "line_flow_stop.h"

bool Line_Flow_Stop_DTO::Has_Arrival_Minute() const
{
	return arrival_minute.getPtr() != nullptr;
}

bool Line_Flow_Stop_DTO::Has_Departure_Minute() const
{
	return departure_minute.getPtr() != nullptr;
}

bool Line_Flow_Stop_DTO::Has_Flags() const
{
	return flags && !flags->empty();
}