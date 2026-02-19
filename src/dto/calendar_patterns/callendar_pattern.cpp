#include "calendar_pattern.h"


using namespace O::DTO;

bool O::DTO::Calendar_Pattern::Has_Info() const
{
	return info.getPtr() != nullptr;
}

bool O::DTO::Calendar_Pattern::Has_Icon() const
{
	return icon.getPtr() != nullptr;
}