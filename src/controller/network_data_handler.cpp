#include "network_data_handler.h"

// DTO
#include "src/dto/common/agregator.h"

// OTAPP
#include <oatpp/json/ObjectMapper.hpp>


O::Controller::Network_Data_Handler::Network_Data_Handler(std::shared_ptr<oatpp::web::mime::ContentMappers>& apiContentMappers):
	oatpp::web::server::api::ApiController(apiContentMappers),
	m_calendar_patterns(O::DTO::Base::Load_From_File<O::DTO::Calendar_Patterns, O::DTO::Calendar_Pattern>("calendar_patterns")),
	m_landmarks(O::DTO::Base::Load_From_File<O::DTO::Landmarks, O::DTO::Landmark>("landmarks")),
	m_lines(O::DTO::Base::Load_From_File<O::DTO::Lines, O::DTO::Line>("lines")),
	m_operators(O::DTO::Base::Load_From_File<O::DTO::Operators, O::DTO::Operator>("oparators")),
	m_organiser(O::DTO::Base::Load_From_File<O::DTO::Organisers, O::DTO::Organiser>("organisers")),
	m_station(O::DTO::Base::Load_From_File<O::DTO::Stations, O::DTO::Station>("stations")),
	m_territories(O::DTO::Base::Load_From_File<O::DTO::Territories, O::DTO::Territory>("territories")),
	m_full_network_json()
{

}

void O::Controller::Network_Data_Handler::Rebuild_Network_String()
{

	auto full_network = O::DTO::Full_Network::createShared();

	full_network->calendar_patterns = m_calendar_patterns.first;
	full_network->landmarks = m_landmarks.first;
	full_network->lines = m_lines.first;
	full_network->operators = m_operators.first;
	full_network->organisers = m_organiser.first;
	full_network->stations = m_station.first;
	full_network->territories = m_territories.first;

	auto jsonObjectMapper = oatpp::json::ObjectMapper();
	 m_full_network_json = jsonObjectMapper.writeToString(full_network);
}

bool O::Controller::Network_Data_Handler::Check_Update()
{
	bool need_update = false;
	if (O::DTO::Base::Need_Update<O::DTO::Calendar_Patterns>("calendar_patterns", m_calendar_patterns.second))
	{
		m_calendar_patterns = O::DTO::Base::Load_From_File<O::DTO::Calendar_Patterns, O::DTO::Calendar_Pattern>("calendar_patterns");
		need_update = true;
	}
	if (O::DTO::Base::Need_Update<O::DTO::Landmarks>("landmarks", m_calendar_patterns.second))
	{
		m_landmarks = O::DTO::Base::Load_From_File<O::DTO::Landmarks, O::DTO::Landmark>("landmarks");
		need_update = true;
	}
	if (O::DTO::Base::Need_Update<O::DTO::Lines>("lines", m_calendar_patterns.second))
	{
		m_lines = O::DTO::Base::Load_From_File<O::DTO::Lines, O::DTO::Line>("lines");
		need_update = true;
	}
	if (O::DTO::Base::Need_Update<O::DTO::Operators>("oparators", m_calendar_patterns.second))
	{
		m_operators = O::DTO::Base::Load_From_File<O::DTO::Operators, O::DTO::Operator>("oparators");
		need_update = true;
	}
	if (O::DTO::Base::Need_Update<O::DTO::Organisers>("organisers", m_calendar_patterns.second))
	{
		m_organiser = O::DTO::Base::Load_From_File<O::DTO::Organisers, O::DTO::Organiser>("organisers");
		need_update = true;
	}
	if (O::DTO::Base::Need_Update<O::DTO::Stations>("stations", m_calendar_patterns.second))
	{
		m_station = O::DTO::Base::Load_From_File<O::DTO::Stations, O::DTO::Station>("stations");
		need_update = true;
	}
	if (O::DTO::Base::Need_Update<O::DTO::Territories>("territories", m_calendar_patterns.second))
	{
		m_territories = O::DTO::Base::Load_From_File<O::DTO::Territories, O::DTO::Territory>("territories");
		need_update = true;
	}
	return need_update;
}

