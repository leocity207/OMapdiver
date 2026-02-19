#ifndef OPERATOR_DTO_H
#define OPERATOR_DTO_H

#include "src/dto/common/base.h"

#include OATPP_CODEGEN_BEGIN(DTO)

namespace O::DTO
{
	/**
	 * @brief DTO about operators
	 */
	class Operator : public Base
	{
		public:
			DTO_INIT(Operator, Base)

	};
}

#include OATPP_CODEGEN_END(DTO)

#endif /* OPERATOR_DTO_H */
