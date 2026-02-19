#ifndef ORGANISER_DTO_H
#define ORGANISER_DTO_H

#include "src/dto/common/base.h"

#include OATPP_CODEGEN_BEGIN(DTO)

namespace O::DTO
{
	/**
	 * @brief DTO about organisers
	 */
	class Organiser : public Base
	{
		public:
			DTO_INIT(Organiser, Base)
	};
}

#include OATPP_CODEGEN_END(DTO)

#endif /* ORGANISER_DTO_H */
