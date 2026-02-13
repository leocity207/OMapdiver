#ifndef STOP_PATTERNS_DTO_H
#define STOP_PATTERNS_DTO_H

#include "src/dto/common/base.h"

#include OATPP_CODEGEN_BEGIN(DTO)

namespace O::DTO
{
	/**
	 * @brief DTO about territoriess
	 * 
	 */
	class Stop_Patterns : public Base
	{
		public:
			DTO_INIT(Stop_Patterns, ::DTO)

	};
}

#include OATPP_CODEGEN_END(DTO)

#endif /* STOP_PATTERNS_DTO_H */
