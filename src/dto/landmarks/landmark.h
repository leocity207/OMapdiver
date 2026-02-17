#ifndef LANDMARK_DTO_H
#define LANDMARK_DTO_H

#include "src/dto/common/base.h"

#include OATPP_CODEGEN_BEGIN(DTO)

namespace O::DTO
{
	/**
	 * @brief DTO about landmark
	 */
	class Landmark : public Base
	{
		public:
			DTO_INIT(Landmark, DTO)

	};
}

#include OATPP_CODEGEN_END(DTO)

#endif /* LANDMARK_DTO_H */
