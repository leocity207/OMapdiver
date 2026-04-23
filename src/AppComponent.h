#ifndef AppComponent_hpp
#define AppComponent_hpp

#include "src/db/client.h"
#include "src/config.h"

#include <oatpp/web/server/HttpConnectionHandler.hpp>
#include <oatpp/web/mime/ContentMappers.hpp>

#include <oatpp/network/tcp/server/ConnectionProvider.hpp>
#include <oatpp/json/ObjectMapper.hpp>

#include <oatpp/macro/component.hpp>
#include <oatpp-postgresql/orm.hpp>

#include <chrono>
#include <memory>
#include <sstream>

/**
 *  Class which creates and holds Application components and registers components in oatpp::base::Environment
 *  Order of components initialization is from top to bottom
 */
class AppComponent {
public:

	/**
	 *  Create ConnectionProvider component which listens on the port
	 */
	OATPP_CREATE_COMPONENT(std::shared_ptr<oatpp::network::ServerConnectionProvider>, serverConnectionProvider)([] {
		return oatpp::network::tcp::server::ConnectionProvider::createShared({"0.0.0.0", 8000, oatpp::network::Address::IP_4});
	}());

	/**
	 *  Create Router component
	 */
	OATPP_CREATE_COMPONENT(std::shared_ptr<oatpp::web::server::HttpRouter>, httpRouter)([] {
		return oatpp::web::server::HttpRouter::createShared();
	}());

	/**
	 *  Create ConnectionHandler component which uses Router component to route requests
	 */
	OATPP_CREATE_COMPONENT(std::shared_ptr<oatpp::network::ConnectionHandler>, serverConnectionHandler)([] {
		OATPP_COMPONENT(std::shared_ptr<oatpp::web::server::HttpRouter>, router); // get Router component
		return oatpp::web::server::HttpConnectionHandler::createShared(router);
	}());

	/**
	 *  Create ObjectMapper component to serialize/deserialize DTOs in Contoller's API
	 */
	OATPP_CREATE_COMPONENT(std::shared_ptr<oatpp::web::mime::ContentMappers>, apiContentMappers)([] {

		auto json = std::make_shared<oatpp::json::ObjectMapper>();
		json->serializerConfig().json.useBeautifier = true;

		auto mappers = std::make_shared<oatpp::web::mime::ContentMappers>();
		mappers->putMapper(json);

		return mappers;

	}());

	/**
	 * Create the database componant
	 */
	OATPP_CREATE_COMPONENT(std::shared_ptr<O::Postgress::Client>, networkDbClient)([] {
		std::ostringstream connectionString;
		connectionString
			<< "host=" << DB_HOST()
			<< " port=" << DB_PORT()
			<< " dbname=" << DB_NAME()
			<< " user=" << DB_USER()
			<< " password=" << DB_PASSWORD();

		auto connectionProvider = std::make_shared<oatpp::postgresql::ConnectionProvider>(connectionString.str().c_str());
		auto connectionPool = oatpp::postgresql::ConnectionPool::createShared(
			connectionProvider,
			10,
			std::chrono::seconds(5)
		);
		auto executor = std::make_shared<oatpp::postgresql::Executor>(connectionPool);

		return std::make_shared<O::Postgress::Client>(executor);
	}());

};

#endif /* AppComponent_hpp */
