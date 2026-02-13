#ifndef AGREGATOR_DTO_H
#define AGREGATOR_DTO_H

/// STL
#include <string_view>

/// OATPP
#include <oatpp/macro/codegen.hpp>
#include <oatpp/Types.hpp>


#include OATPP_CODEGEN_BEGIN(DTO)

namespace O::DTO
{

	/**
	 * @brief class that represent the list id to find the object inside the folder
	 * 
	 * @tparam Key to recognise what is the type of the agregator
	 */
	template<std::string_view Key>
	class Agregator : public oatpp::DTO
	{
		public:
			DTO_INIT(Lines, DTO)
			DTO_FIELD(List<String>, list, Key.data());
	};

	using Calendar_Patterns = Agregator<"calendar_patterns">;
	using Lines             = Agregator<"lines">;
	using Landmarks         = Agregator<"landmarks">;
	using Lines             = Agregator<"lines">;
	using Networks          = Agregator<"network">;
	using Operators         = Agregator<"operators">;
	using Organisers        = Agregator<"organisers">;
	using Stations          = Agregator<"stations">;
	using Stop_Patterns     = Agregator<"stop_patterns">;
	using Territories       = Agregator<"territories">;

}
#include OATPP_CODEGEN_END(DTO)

#endif /* AGREGATOR_DTO_H */
