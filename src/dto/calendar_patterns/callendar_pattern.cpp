#include "calendar_pattern.h"


using namespace O::DTO;

bool Calendar_Patterns::Has_Info() const
{
	return info.getPtr() != nullptr;
}

bool Calendar_Patterns::Has_Icon() const
{
	return icon.getPtr() != nullptr;
}