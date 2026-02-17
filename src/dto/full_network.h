#ifndef FULL_NETWORK_DTO_H
#define FULL_NETWORK_DTO_H

#include "src/calendar_patterns/calendar_pattern.h"
#include "src/landmarks/landmark.h"
#include "src/lines/line.h"
#include "src/operators/operator.h"
#include "src/organisers/organiser.h"
#include "src/stations/station.h"
#include "src/stop_patterns/stop_pattern.h"
#include "src/territories/territories.h"

#include OATPP_CODEGEN_BEGIN(DTO)

namespace O::DTO
{
	/**
	* @brief DTO about networks
	*/
	class Full_Network : public oatpp::DTO {

	public:
		DTO_INIT(Network, DTO)

			// Mandatory fields
		DTO_FIELD(List<Object<Calendar_Patterns>>, calendar_patterns, "calendar_patterns");
		DTO_FIELD(List<Object<Landmark>>, landmarks, "landmarks");
		DTO_FIELD(List<Object<Line>>, lines, "lines");
		DTO_FIELD(List<Object<Operator>>, operators, "operators");
		DTO_FIELD(List<Object<Organiser>>, organisers, "organisers");
		DTO_FIELD(List<Object<Station>>, stations, "stations");
		DTO_FIELD(List<Object<Stop_Pattern>>, stop_patterns, "stop_patterns");
		DTO_FIELD(List<Object<Territory>>, territories, "territories");
	};
}
#include OATPP_CODEGEN_END(DTO)

#endif /* FULL_NETWORK_DTO_H */
