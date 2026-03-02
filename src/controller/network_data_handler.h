#ifndef NETWORK_DATA_HANDLER_H
#define NETWORK_DATA_HANDLER_H


#include <oatpp/web/server/api/ApiController.hpp>
#include <oatpp/macro/codegen.hpp>
#include <oatpp/macro/component.hpp>
#include <oatpp/json/ObjectMapper.hpp>

#include "src/config.h"

#include "src/dto/full_network.h"

#include <fstream>
#include <sstream>
#include <filesystem>

#include OATPP_CODEGEN_BEGIN(ApiController) //<-- Begin Codegen

namespace O::Controller
{

	class Network_Data_Handler : public oatpp::web::server::api::ApiController
	{
	public:
		Network_Data_Handler(OATPP_COMPONENT(std::shared_ptr<oatpp::web::mime::ContentMappers>, apiContentMappers));


		ENDPOINT("GET", "dyn/network_data", Get_Network_Data) {

			if (Check_Update())
				Rebuild_Network_String();

			auto response = ResponseFactory::createResponse(Status::CODE_200, m_full_network_json);
			response->putHeader("Content-Type", "application/json");
			return response;
		}

	private:


		void Rebuild_Network_String();
		bool Check_Update();



		std::pair<Fields<Object<O::DTO::Calendar_Pattern>>, std::filesystem::file_time_type> m_calendar_patterns;
		std::pair<Fields<Object<O::DTO::Landmark>>        , std::filesystem::file_time_type> m_landmarks;
		std::pair<Fields<Object<O::DTO::Line>>            , std::filesystem::file_time_type> m_lines;
		std::pair<Fields<Object<O::DTO::Operator>>        , std::filesystem::file_time_type> m_operators;
		std::pair<Fields<Object<O::DTO::Organiser>>       , std::filesystem::file_time_type> m_organiser;
		std::pair<Fields<Object<O::DTO::Station>>         , std::filesystem::file_time_type> m_station;
		std::pair<Fields<Object<O::DTO::Stop_Pattern>>    , std::filesystem::file_time_type> m_stop_patterns;
		std::pair<Fields<Object<O::DTO::Territory>>       , std::filesystem::file_time_type> m_territories;
		 
		oatpp::String m_full_network_json;

	};
}

#endif