#ifndef BASE_DTO_H
#define BASE_DTO_H

// STD
#include <string_view>
#include <filesystem>

// OATPP
#include <oatpp/macro/codegen.hpp>
#include <oatpp/Types.hpp>

#include OATPP_CODEGEN_BEGIN(DTO)

namespace O::DTO
{
	/**
	 * @brief Base DTO class shared by all other Data transfer object
	 */
	class Base : public oatpp::DTO
	{
	public:
		DTO_INIT(Base, DTO)

		DTO_FIELD(String, id, "id");
		DTO_FIELD(String, label, "label");

		template<class Types>
		static bool Need_Update(std::string_view key, const std::filesystem::file_time_type& last_update);

		template<class Types, class Type>
		static std::pair<oatpp::Fields<oatpp::Object<Type>>, std::filesystem::file_time_type> Load_From_File(std::string_view key);
	};
}

#include OATPP_CODEGEN_END(DTO)


#include "base.hpp"

#endif /* BASE_DTO_H */
