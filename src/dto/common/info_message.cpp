#include "info_message.h"

oatpp::Object<O::DTO::Info_Message> O::DTO::Info_Message::From_Postgres(const oatpp::Object<O::DTO::Postgres_Info_Message>& src)
{
	if (!src)
		return nullptr;
		
	auto dst = Info_Message::createShared();
	dst->index = src->index;
	dst->level = src->level;
	dst->message = src->message;
	return dst;
}