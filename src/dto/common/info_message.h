#ifndef INFO_MESSAGE_DTO_H
#define INFO_MESSAGE_DTO_H

#include <oatpp/macro/codegen.hpp>
#include <oatpp/Types.hpp>

#include "postgress_info_message.h"

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


		static oatpp::Object<Info_Message> From_Postgres(const oatpp::Object<Postgres_Info_Message>& src);
	};

}
#include OATPP_CODEGEN_END(DTO)

#endif // INFO_MESSAGE_DTO_H
