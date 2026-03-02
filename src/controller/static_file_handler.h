#ifndef STATIC_FILE_HANDLER_HPP
#define STATIC_FILE_HANDLER_HPP

#include <oatpp/web/server/api/ApiController.hpp>
#include <oatpp/macro/codegen.hpp>
#include <oatpp/macro/component.hpp>

#include OATPP_CODEGEN_BEGIN(ApiController) //<-- Begin Codegen

class Static_File_Manager : public oatpp::web::server::api::ApiController {
	public:

		/////////
		/// CTOR
		Static_File_Manager(OATPP_COMPONENT(std::shared_ptr<oatpp::web::mime::ContentMappers>, apiContentMappers));

		///////////////////
		/// STATIC MEMEBER
		static oatpp::String Get_File(oatpp::String& fileName);
		static const char* Get_Content_Type(const std::string& path);

		ENDPOINT("GET", "*", Get_Static_Files, REQUEST(std::shared_ptr<IncomingRequest>, request))
		{
			oatpp::String tail = request->getPathTail();
			oatpp::String file = Get_File(tail);
			OATPP_ASSERT_HTTP(file.get() != nullptr, Status::CODE_404, "File not found");
			auto response = createResponse(Status::CODE_200, file);
			response->putHeader("Content-Type", Get_Content_Type(tail));
			return response;
		}
};

#endif // STATIC_FILE_HANDLER_HPP
