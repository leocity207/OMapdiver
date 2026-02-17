#ifndef STOP_PATTERNS_DTO_H
#define STOP_PATTERNS_DTO_H

#include "src/dto/common/base.h"

#include OATPP_CODEGEN_BEGIN(DTO)

namespace O::DTO
{
	/**
	 * @brief DTO about territoriess
	 */
	class Stop_Pattern : public Base
	{
		public:
			DTO_INIT(Stop_Pattern, DTO)

			// Mandatory fields
			DTO_FIELD(Boolean, urls, "urls");
			DTO_FIELD(UInt16, level, "level");
			DTO_FIELD(List<String>, variant, "variant");
			DTO_FIELD(String, color, "color");
			DTO_FIELD(String, icon, "icon");
	};
}

#include OATPP_CODEGEN_END(DTO)

#endif /* STOP_PATTERNS_DTO_H */
