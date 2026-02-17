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
	template<std::size_t N>
	struct Fixed_String {
		char value[N];

		constexpr Fixed_String(const char (&str)[N]) {
			for (std::size_t i = 0; i < N; ++i)
				value[i] = str[i];
		}

		constexpr operator std::string_view() const {
			return std::string_view(value, N - 1);
		}
	};

	/**
	 * @brief class that represent the list id to find the object inside the folder
	 * 
	 * @tparam Key to recognise what is the type of the agregator
	 */
	template<Fixed_String Key>
	class Agregator : public oatpp::DTO
	{
		public:
			DTO_INIT(Agregator, DTO)
			DTO_FIELD(List<String>, list, Key.value);
	};

	using Calendar_Patterns = Agregator<"calendar_patterns">;
	using Lines             = Agregator<"lines">;
	using Landmarks         = Agregator<"landmarks">;
	using Networks          = Agregator<"network">;
	using Operators         = Agregator<"operators">;
	using Organisers        = Agregator<"organisers">;
	using Stations          = Agregator<"stations">;
	using Stop_Patterns     = Agregator<"stop_patterns">;
	using Territories       = Agregator<"territories">;

}
#include OATPP_CODEGEN_END(DTO)

#endif /* AGREGATOR_DTO_H */
