#ifndef TERRITORY_DTO_H
#define TERRITORY_DTO_H

#include "src/dto/common/base.h"

#include OATPP_CODEGEN_BEGIN(DTO)

namespace O::DTO
{
	/**
	 * @brief DTO about territoriess
	 * 
	 */
	class Territory : public Base
	{
		public:
			DTO_INIT(Territory, ::DTO)

	};
}

#include OATPP_CODEGEN_END(DTO)

#endif /* TERRITORY_DTO_H */
