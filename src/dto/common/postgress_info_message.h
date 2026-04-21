#ifndef POSTGRES_INFO_MESSAGE_DTO_H
#define POSTGRES_INFO_MESSAGE_DTO_H

#include <oatpp/macro/codegen.hpp>
#include <oatpp/Types.hpp>

#include OATPP_CODEGEN_BEGIN(DTO)

namespace O::DTO
{
	/**
	 * @brief Base DTO class shared by all other Data transfer object
	 */
	class Postgres_Info_Message : public oatpp::DTO {

	public:
		DTO_INIT(Postgres_Info_Message, DTO)

		DTO_FIELD(String, info_message_id, "info_message_id");
		DTO_FIELD(String, line_id, "line_id");
		DTO_FIELD(String, pattern_id, "pattern_id");
		DTO_FIELD(String, timetable_id, "timetable_id");
		DTO_FIELD(String, station_id, "station_id");
		DTO_FIELD(Int16, index, "index");
		DTO_FIELD(Int16, level, "level");
		DTO_FIELD(String, message, "message");
	};

}
#include OATPP_CODEGEN_END(DTO)

#endif // POSTGRES_INFO_MESSAGE_DTO_H
