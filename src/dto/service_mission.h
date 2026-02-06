#ifndef SERVICE_MISSION_DTO_H
#define SERVICE_MISSION_DTO_H

#include <oatpp/macro/codegen.hpp>
#include <oatpp/Types.hpp>

#include "service_mission_info.h"

#include OATPP_CODEGEN_BEGIN(DTO)

class Service_Mission_DTO : public oatpp::DTO {

public:

	DTO_INIT(Service_Mission_DTO, DTO)

    DTO_FIELD(String, code, "code");
    DTO_FIELD(String, composition, "composition");
    DTO_FIELD(String, pattern_key, "pattern_key");
    DTO_FIELD(Int16, Afluence, "composition");
    DTO_FIELD(List<String>, departure_times, "departure_times");
	DTO_FIELD(List<String>, arrival_times, "arrival_times");
    DTO_FIELD(Fields<Service_Mission_Info_DTO>, service_mission_info, "info");
};

#include OATPP_CODEGEN_END(DTO)

#endif /* SERVICE_MISSION_DTO_H */
