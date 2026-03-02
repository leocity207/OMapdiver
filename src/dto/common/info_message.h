#ifndef INFO_MESSAGE_DTO_H
#define INFO_MESSAGE_DTO_H

#include <oatpp/macro/codegen.hpp>
#include <oatpp/Types.hpp>

#include OATPP_CODEGEN_BEGIN(DTO)

namespace O::DTO
{
	/**
	 * @brief Base DTO class shared by all other Data transfer object
	 */
	class Info_Message : public oatpp::DTO {

	public:
		DTO_INIT(Info_Message, DTO)

		DTO_FIELD(Int16, index, "index");
		DTO_FIELD(Int16, level, "level");
		DTO_FIELD(String, message, "message");
	};

}
#include OATPP_CODEGEN_END(DTO)

#endif // INFO_MESSAGE_DTO_H
