#ifndef NETWORK_DATA_HANDLER_H
#define NETWORK_DATA_HANDLER_H


#include <oatpp/web/server/api/ApiController.hpp>
#include <oatpp/macro/codegen.hpp>
#include <oatpp/macro/component.hpp>
#include <oatpp/json/ObjectMapper.hpp>

#include "src/config.h"
#include "src/dto/full_network.h"
#include "src/db/client.h"

#include <fstream>
#include <sstream>
#include <filesystem>

#include OATPP_CODEGEN_BEGIN(ApiController) //<-- Begin Codegen

namespace O::Controller
{
	class Network_Data_Handler : public oatpp::web::server::api::ApiController
	{
	public:
		Network_Data_Handler(
			OATPP_COMPONENT(std::shared_ptr<oatpp::web::mime::ContentMappers>, apiContentMappers),
			OATPP_COMPONENT(std::shared_ptr<O::Postgress::Client>, db)
		)
			: oatpp::web::server::api::ApiController(apiContentMappers),
			  m_db(db)
		{}

		ENDPOINT("GET", "/dyn/network_data", Get_Network_Data)
		{
			if (Check_Update()) {
				Rebuild_Network_String();
			}

			auto response = createResponse(Status::CODE_200, m_full_network_json);
			response->putHeader("Content-Type", "application/json; charset=utf-8");
			return response;
		}

	private:
		std::shared_ptr<O::Postgress::Client> m_db;
		oatpp::String m_full_network_json;
		bool m_is_loaded = false;
		std::mutex m_mutex;

		bool Check_Update();
		void Rebuild_Network_String();

		template <class T>
		static oatpp::Fields<oatpp::Object<T>> To_Fields_By_Id(const oatpp::Vector<oatpp::Object<T>>& items);

		template <class T>
		static oatpp::List<oatpp::Object<T>> To_List(const oatpp::Vector<oatpp::Object<T>>& items);
	};
}

#endif