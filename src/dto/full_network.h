#ifndef FULL_NETWORK_DTO_H
#define FULL_NETWORK_DTO_H

#include "calendar_patterns/calendar_pattern.h"
#include "landmarks/landmark.h"
#include "lines/line.h"
#include "operators/operator.h"
#include "organisers/organiser.h"
#include "stations/station.h"
#include "stop_patterns/stop_pattern.h"
#include "territories/territory.h"

#include OATPP_CODEGEN_BEGIN(DTO)

namespace O::DTO
{
	/**
	* @brief DTO about networks
	*/
	class Full_Network : public oatpp::DTO {

	public:
		DTO_INIT(Full_Network, DTO)

			// Mandatory fields
		DTO_FIELD(Fields<Object<Calendar_Pattern>>, calendar_patterns, "calendar_patterns");
		DTO_FIELD(Fields<Object<Landmark>>, landmarks, "landmarks");
		DTO_FIELD(Fields<Object<Line>>, lines, "lines");
		DTO_FIELD(Fields<Object<Operator>>, operators, "operators");
		DTO_FIELD(Fields<Object<Organiser>>, organisers, "organisers");
		DTO_FIELD(Fields<Object<Station>>, stations, "stations");
		DTO_FIELD(Fields<Object<Stop_Pattern>>, stop_patterns, "stop_patterns");
		DTO_FIELD(Fields<Object<Territory>>, territories, "territories");
	};
}
#include OATPP_CODEGEN_END(DTO)

#endif /* FULL_NETWORK_DTO_H */
