#include "network_data_handler.h"

// DTO
#include "src/dto/common/agregator.h"
#include "src/dto/stations/station_postgres.h"

// OATPP
#include <oatpp/json/ObjectMapper.hpp>

void O::Controller::Network_Data_Handler::Rebuild_Network_String()
{
	auto full_network = O::DTO::Full_Network::createShared();

	auto jsonMapper = std::make_shared<oatpp::json::ObjectMapper>();

	auto calendar_patterns = m_db->getCalendarPatterns()->template fetch<oatpp::Vector<oatpp::Object<O::DTO::Calendar_Pattern>>>();
	auto landmarks         = m_db->getLandmarks()->template fetch<oatpp::Vector<oatpp::Object<O::DTO::Landmark>>>();
	auto operators         = m_db->getOperators()->template fetch<oatpp::Vector<oatpp::Object<O::DTO::Operator>>>();
	auto organisers        = m_db->getOrganisers()->template fetch<oatpp::Vector<oatpp::Object<O::DTO::Organiser>>>();
	auto postgres_stations = m_db->getStations()->template fetch<oatpp::Vector<oatpp::Object<O::DTO::Postgres_Station>>>();
	auto stop_patterns     = m_db->getStopPatterns()->template fetch<oatpp::Vector<oatpp::Object<O::DTO::Stop_Pattern>>>();
	auto territories       = m_db->getTerritories()->template fetch<oatpp::Vector<oatpp::Object<O::DTO::Territory>>>();
	auto postgres_lines    = m_db->getLines()->template fetch<oatpp::Vector<oatpp::Object<O::DTO::Postgres_Line>>>();
	auto stations = oatpp::Vector<oatpp::Object<O::DTO::Station>>::createShared();
	if (postgres_stations) {
		for (const auto& pgStation : *postgres_stations) {
			stations->push_back(O::DTO::Station::From_Postgres(pgStation, jsonMapper));
		}
	}

	auto lines = oatpp::Vector<oatpp::Object<O::DTO::Line>>::createShared();
	if (postgres_lines) {
		for (const auto& pgLine : *postgres_lines) {
			auto line = O::DTO::Line::From_Postgres(pgLine, jsonMapper);
			if (!line) {
				continue;
			}

			const auto& lineId = line->id;

			line->info_messages = To_List(
				m_db->getLineInfoMessages(lineId)->template fetch<
					oatpp::Vector<oatpp::Object<O::DTO::Info_Message>>
				>()
			);

			auto patternRows = m_db->getPatternsByLineId(lineId)->template fetch<
				oatpp::Vector<oatpp::Object<O::DTO::Pattern>>
			>();
			line->patterns = oatpp::List<oatpp::Object<O::DTO::Pattern>>::createShared();
			if (patternRows) {
				for (auto& pattern : *patternRows) {
					pattern->info_messages = To_List(
						m_db->getPatternInfoMessages(pattern->id)->template fetch<
							oatpp::Vector<oatpp::Object<O::DTO::Info_Message>>
						>()
					);
					line->patterns->push_back(pattern);
				}
			}

			auto timetableRows = m_db->getTimetablesByLineId(lineId)->template fetch<
				oatpp::Vector<oatpp::Object<O::DTO::Service_Mission>>
			>();
			line->timetables = oatpp::List<oatpp::Object<O::DTO::Service_Mission>>::createShared();
			if (timetableRows) {
				for (auto& timetable : *timetableRows) {
					timetable->info_messages = To_List(
						m_db->getTimetableInfoMessages(timetable->id)->template fetch<
							oatpp::Vector<oatpp::Object<O::DTO::Info_Message>>
						>()
					);
					line->timetables->push_back(timetable);
				}
			}

			lines->push_back(line);
		}
	}

	full_network->calendar_patterns = To_Fields_By_Id(calendar_patterns);
	full_network->landmarks         = To_Fields_By_Id(landmarks);
	full_network->operators         = To_Fields_By_Id(operators);
	full_network->organisers        = To_Fields_By_Id(organisers);
	full_network->stations          = To_Fields_By_Id(stations);
	full_network->stop_patterns     = To_Fields_By_Id(stop_patterns);
	full_network->territories       = To_Fields_By_Id(territories);
	full_network->lines             = To_Fields_By_Id(lines);

	auto responseMapper = m_contentMappers->getMapper("application/json");
	m_full_network_json = responseMapper->writeToString(full_network);

	{
		std::lock_guard<std::mutex> lock(m_mutex);
		m_is_loaded = true;
	}
}

bool O::Controller::Network_Data_Handler::Check_Update()
{
	std::lock_guard<std::mutex> lock(m_mutex);
	return !m_is_loaded;
}

template <class T>
oatpp::Fields<oatpp::Object<T>> 
O::Controller::Network_Data_Handler::To_Fields_By_Id(
    const oatpp::Vector<oatpp::Object<T>>& items)
{
    auto result = oatpp::Fields<oatpp::Object<T>>::createShared();

    if (!items)
        return result;

    for (const auto& item : *items) {
        if (item && item->id) {
            result->push_back({ item->id, item });
        }
    }

    return result;
}

template <class T>
oatpp::List<oatpp::Object<T>> O::Controller::Network_Data_Handler::To_List(const oatpp::Vector<oatpp::Object<T>>& items)
{
	auto result = oatpp::List<oatpp::Object<T>>::createShared();
	if (!items) {
		return result;
	}

	for (const auto& item : *items) {
		result->push_back(item);
	}
	return result;
}