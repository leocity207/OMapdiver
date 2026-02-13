#ifndef BASE_DTO_H
#define BASE_DTO_H

#include <oatpp/macro/codegen.hpp>
#include <oatpp/Types.hpp>

#include OATPP_CODEGEN_BEGIN(DTO)

namespace O::DTO
{
	/**
	 * @brief Base DTO class shared by all other Data transfer object
	 * 
	 */
	class Base : public oatpp::DTO
	{
		public:
			DTO_INIT(Base, DTO)

			DTO_FIELD(String, id, "id");
			DTO_FIELD(String, label, "label");
	};
}

#include OATPP_CODEGEN_END(DTO)

#endif /* BASE_DTO_H */
