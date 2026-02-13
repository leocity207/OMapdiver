#ifndef CALENDAR_PATTERNS_DTO_H
#define CALENDAR_PATTERNS_DTO_H

#include "src/dto/common/base.h"

#include OATPP_CODEGEN_BEGIN(DTO)

namespace O::DTO
{
	/**
	 * @brief DTO about callendar patterns
	 * 
	 */
	class Calendar_Patterns : public Base
	{
		public:
			DTO_INIT(Landmark, ::DTO)

	};
}

#include OATPP_CODEGEN_END(DTO)

#endif /* CALENDAR_PATTERNS_DTO_H */
