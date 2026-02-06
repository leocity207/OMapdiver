#ifndef SERVICE_MISSION_INFO_DTO_H
#define SERVISERVICE_MISSION_INFO_DTO_HCE_MISSION_DTO_H

#include <oatpp/macro/codegen.hpp>
#include <oatpp/Types.hpp>

#include OATPP_CODEGEN_BEGIN(DTO)

class Service_Mission_Info_DTO : public oatpp::DTO {

public:

	DTO_INIT(Service_Mission_Info_DTO, DTO)

    DTO_FIELD(String, code, "code");

    /**
     * level 0: info
     * level 1: significant warning
     * level 3: station not served
     */
    DTO_FIELD(Int16, level, "level");
    DTO_FIELD(Int16, station_index, "station_index");
    DTO_FIELD(Fields<String>, message, "message");
};

#include OATPP_CODEGEN_END(DTO)

#endif /* SERVICE_MISSION_INFO_DTO_H */
