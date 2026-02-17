#ifndef CALENDAR_PATTERNS_DTO_H
#define CALENDAR_PATTERNS_DTO_H

#include "src/dto/common/base.h"

#include OATPP_CODEGEN_BEGIN(DTO)

namespace O::DTO
{
	/**
	 * @brief DTO about callendar patterns
	 */
	class Calendar_Pattern : public Base
	{
		public:
			DTO_INIT(Calendar_Pattern, DTO)

			// Mandatory fields
			DTO_FIELD(Boolean, urls, "urls");
			DTO_FIELD(Fields<String>, is_exceptional, "is_exceptional");

			// Optional fields
			DTO_FIELD(String, info, "info") = nullptr;
			DTO_FIELD(String, icon, "icon") = nullptr;

			// Optional field checker
			bool Has_Info() const;
			bool Has_Icon() const;
	};
}

#include OATPP_CODEGEN_END(DTO)

#endif /* CALENDAR_PATTERNS_DTO_H */
