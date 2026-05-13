#include "src/controller/network_data_handler.h"
#include "src/AppComponent.h"
#include "config.h"

#include <oatpp/network/Server.hpp>

#include <iostream>

void run() {

	/* Register Components in scope of run() method */
	AppComponent components;

	//Create Rooter and add componant
	OATPP_COMPONENT(std::shared_ptr<oatpp::web::server::HttpRouter>, router);
	router->addController(std::make_shared<O::Controller::Network_Data_Handler>());

	// Create the server
	OATPP_COMPONENT(std::shared_ptr<oatpp::network::ConnectionHandler>, connectionHandler);
	OATPP_COMPONENT(std::shared_ptr<oatpp::network::ServerConnectionProvider>, connectionProvider);
	oatpp::network::Server server(connectionProvider, connectionHandler);

	/* Print info about server port */
	OATPP_LOGi("[Info]", "Server running on port {}", connectionProvider->getProperty("port").toString());
	OATPP_LOGi("[Info]", "Server running on port {}", connectionProvider->getProperty("port").toString());
	OATPP_LOGi("[Info]", "DB_HOST     {}", DB_HOST());
	OATPP_LOGi("[Info]", "DB_PORT     {}", DB_PORT());
	OATPP_LOGi("[Info]", "DB_NAME     {}", DB_NAME());
	OATPP_LOGi("[Info]", "DB_USER     {}", DB_USER());
	OATPP_LOGi("[Info]", "DB_PASSWORD {}", DB_PASSWORD());

	server.run();

}


int main(int argc, const char * argv[]) {

	oatpp::Environment::init();

	run();

	/* Print how much objects were created during app running, and what have left-probably leaked */
	/* Disable object counting for release builds using '-D OATPP_DISABLE_ENV_OBJECT_COUNTERS' flag for better performance */
	std::cout << "\nEnvironment:\n";
	std::cout << "objectsCount = " << oatpp::Environment::getObjectsCount() << "\n"; 
	std::cout << "objectsCreated = " << oatpp::Environment::getObjectsCreated() << "\n\n";

	oatpp::Environment::destroy();

	return 0;
}
