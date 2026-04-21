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

	auto calendar_patterns      = m_db->getCalendarPatterns()->template fetch<oatpp::Vector<oatpp::Object<O::DTO::Calendar_Pattern>>>();
	auto landmarks              = m_db->getLandmarks()->template fetch<oatpp::Vector<oatpp::Object<O::DTO::Landmark>>>();
	auto operators              = m_db->getOperators()->template fetch<oatpp::Vector<oatpp::Object<O::DTO::Operator>>>();
	auto organisers             = m_db->getOrganisers()->template fetch<oatpp::Vector<oatpp::Object<O::DTO::Organiser>>>();
	auto postgres_stations      = m_db->getStations()->template fetch<oatpp::Vector<oatpp::Object<O::DTO::Postgres_Station>>>();
	auto stop_patterns          = m_db->getStopPatterns()->template fetch<oatpp::Vector<oatpp::Object<O::DTO::Stop_Pattern>>>();
	auto territories            = m_db->getTerritories()->template fetch<oatpp::Vector<oatpp::Object<O::DTO::Territory>>>();
	auto postgres_lines         = m_db->getLines()->template fetch<oatpp::Vector<oatpp::Object<O::DTO::Postgres_Line>>>();
	auto postgres_info_messages = m_db->getInfoMessages()->template fetch<oatpp::Vector<oatpp::Object<O::DTO::Postgres_Info_Message>>>();
	auto timetables             = m_db->getTimetables()->template fetch<oatpp::Vector<oatpp::Object<O::DTO::Service_Mission>>>();
	auto patterns               = m_db->getPatterns()->template fetch<oatpp::Vector<oatpp::Object<O::DTO::Pattern>>>();
	auto stations = oatpp::Vector<oatpp::Object<O::DTO::Station>>::createShared();
	auto lines = oatpp::Vector<oatpp::Object<O::DTO::Line>>::createShared();
	if (postgres_stations)
		for (const auto& pgStation : *postgres_stations)
			stations->push_back(O::DTO::Station::From_Postgres(pgStation, jsonMapper));
	if (postgres_lines)
		for (const auto& pgLines : *postgres_lines)
			lines->push_back(O::DTO::Line::From_Postgres(pgLines, jsonMapper));

	std::unordered_map<std::string, oatpp::Object<O::DTO::Line>> line_Map;
	std::unordered_map<std::string, oatpp::Object<O::DTO::Pattern>> pattern_Map;
	std::unordered_map<std::string, oatpp::Object<O::DTO::Service_Mission>> timetable_Map;
	std::unordered_map<std::string, oatpp::Object<O::DTO::Station>> station_Map;

	full_network->calendar_patterns = To_Fields_By_Id(calendar_patterns);
	full_network->landmarks         = To_Fields_By_Id(landmarks);
	full_network->operators         = To_Fields_By_Id(operators);
	full_network->organisers        = To_Fields_By_Id(organisers);
	full_network->stations          = To_Fields_By_Id(stations);
	full_network->stop_patterns     = To_Fields_By_Id(stop_patterns);
	full_network->territories       = To_Fields_By_Id(territories);
	full_network->lines             = To_Fields_By_Id(lines);

	if (patterns)
	{
		for (const auto& pattern : *patterns)
		{
			if (!pattern || !pattern->id || !pattern->line_id)
				continue;

			auto it = line_Map.find(pattern->line_id->c_str());
			if (it == line_Map.end())
				continue;

			auto& line = it->second;

			if (!line->patterns)
				line->patterns = oatpp::List<oatpp::Object<O::DTO::Pattern>>::createShared();

			line->patterns->push_back(pattern);
			pattern_Map[pattern->id->c_str()] = pattern;
		}
	}
	if (timetables)
	{
		for (const auto& timetable : *timetables)
		{
			if (!timetable || !timetable->id || !timetable->line_id)
				continue;

			auto it = line_Map.find(timetable->line_id->c_str());
			if (it == line_Map.end())
				continue;

			auto& line = it->second;

			if (!line->timetables)
				line->timetables = oatpp::List<oatpp::Object<O::DTO::Service_Mission>>::createShared();

			line->timetables->push_back(timetable);
			timetable_Map[timetable->id->c_str()] = timetable;
		}
	}


	// lines
	if (lines)
	{
		for (auto& line : *lines)
		{
			if (line && line->id)
				line_Map[line->id->c_str()] = line;

			if (line->patterns)
				for (auto& pattern : *line->patterns)
					if (pattern && pattern->id)
						pattern_Map[pattern->id->c_str()] = pattern;

			if (line->timetables)
				for (auto& timetable : *line->timetables)
					if (timetable && timetable->id)
						timetable_Map[timetable->id->c_str()] = timetable;
		}
	}


	if (postgres_info_messages)
	{
		for (const auto& pgInfo : *postgres_info_messages)
		{

			auto info = O::DTO::Info_Message::From_Postgres(pgInfo);
			if (!info) continue;

			// attach to line
			if (pgInfo->line_id)
			{
				auto it = line_Map.find(pgInfo->line_id->c_str());
				if (it != line_Map.end())
				{
					auto& line = it->second;
					if (!line->info_messages)
						line->info_messages = oatpp::List<oatpp::Object<O::DTO::Info_Message>>::createShared();
					line->info_messages->push_back(info);
				}
			}

			// attach to pattern
			else if (pgInfo->pattern_id)
			{
				auto it = pattern_Map.find(pgInfo->pattern_id->c_str());
				if (it != pattern_Map.end())
				{
					auto& pattern = it->second;
					if (!pattern->info_messages)
						pattern->info_messages = oatpp::List<oatpp::Object<O::DTO::Info_Message>>::createShared();
					pattern->info_messages->push_back(info);
				}
			}

			// attach to timetable
			else if (pgInfo->timetable_id)
			{
				auto it = timetable_Map.find(pgInfo->timetable_id->c_str());
				if (it != timetable_Map.end())
				{
					auto& timetable = it->second;
					if (!timetable->info_messages)
						timetable->info_messages = oatpp::List<oatpp::Object<O::DTO::Info_Message>>::createShared();
					timetable->info_messages->push_back(info);
				}
			}
		}
	}

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