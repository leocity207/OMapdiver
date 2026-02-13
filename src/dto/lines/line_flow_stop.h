#ifndef LINE_FLOW_STOP_DTO_H
#define LINE_FLOW_STOP_DTO_H

#include <oatpp/macro/codegen.hpp>
#include <oatpp/Types.hpp>

#include OATPP_CODEGEN_BEGIN(DTO)

namespace O::DTO
{
	class Line_Flow_Stop : public oatpp::DTO {

		public:
			DTO_INIT(Line_Flow_Stop, DTO)

			// Required field
			DTO_FIELD(String, station_ID, "station_ID");

			// Optional fields - initialized with nullptr
			DTO_FIELD(UInt16, arrival_minute, "arrival_minute") = nullptr;
			DTO_FIELD(UInt16, departure_minute, "departure_minute") = nullptr;
			DTO_FIELD(List<String>::ObjectWrapper, flags, "flags") = List<String>::createShared();

			// Helper methods to check if optional fields exist
			bool Has_Arrival_Minute() const;
			bool Has_Departure_Minute() const;
			bool Has_Flags() const;
	};
}


#include OATPP_CODEGEN_END(DTO)

#endif // LINE_FLOW_STOP_DTO_H
