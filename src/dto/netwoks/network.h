#ifndef NETWORK_DTO_H
#define NETWORK_DTO_H

#include "src/dto/common/base.h"

#include OATPP_CODEGEN_BEGIN(DTO)

namespace O::DTO
{
	/**
	* @brief DTO about networks
	*/
	class Network : public oatpp::DTO {

	public:
		DTO_INIT(Network, DTO)

		// Mandatory fields
		DTO_FIELD(List<String>, calendar_patterns, "calendar_patterns");
		DTO_FIELD(List<String>, landmarks        , "landmarks");
		DTO_FIELD(List<String>, lines            , "lines");
		DTO_FIELD(List<String>, operators        , "operators");
		DTO_FIELD(List<String>, organisers       , "organisers");
		DTO_FIELD(List<String>, stations         , "stations");
		DTO_FIELD(List<String>, stop_patterns    , "stop_patterns");
		DTO_FIELD(List<String>, territories      , "territories");
	};
}
#include OATPP_CODEGEN_END(DTO)

#endif /* NETWORK_DTO_H */
