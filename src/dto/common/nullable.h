#ifndef NULLABLE_DTO_H
#define NULLABLE_DTO_H

#include <oatpp/macro/codegen.hpp>
#include <oatpp/Types.hpp>

#include OATPP_CODEGEN_BEGIN(DTO)

namespace O::DTO
{
	/**
	 * @brief Base DTO class shared by all other Data transfer object
	 */
	template<class Type>
	class Nullable : public oatpp::DTO
	{
	public:
		DTO_INIT(Nullable, DTO)

		DTO_FIELD(Type, id, "id");
	};
}

#include OATPP_CODEGEN_END(DTO)

#endif /* NULLABLE_DTO_H */
