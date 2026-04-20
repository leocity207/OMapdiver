#ifndef NETWORK_DB_CLIENT_H
#define NETWORK_DB_CLIENT_H

#include <oatpp/orm/DbClient.hpp>
#include <oatpp/macro/codegen.hpp>

#include OATPP_CODEGEN_BEGIN(DbClient)

namespace O::Postgress {

class Client : public oatpp::orm::DbClient {
public:
	Client(const std::shared_ptr<oatpp::orm::Executor>& executor)
		: oatpp::orm::DbClient(executor)
	{}

	QUERY(getCalendarPatterns,      "SELECT id, label, is_exceptional, info, icon FROM calendar_patterns ORDER BY id;")
	QUERY(getLandmarks,             "SELECT id, label FROM landmarks ORDER BY id;")
	QUERY(getOperators,             "SELECT id, label FROM operators ORDER BY id;")
	QUERY(getOrganisers,            "SELECT id, label FROM organisers ORDER BY id;")
	QUERY(getTerritories,           "SELECT id, label FROM territories ORDER BY id;")
	QUERY(getStopPatterns,          "SELECT id, label, level, is_exceptional, color, icon, variants FROM stop_patterns ORDER BY id;")
	QUERY(getStations,              "SELECT id, label, url, lines, CAST(directions AS TEXT) AS directions, have_disabled_equipment, have_bike_parking, have_car_parking, have_car_sharing, opening_hour, closing_hour FROM stations ORDER BY id;")
	QUERY(getLines,                 "SELECT id, label, url, icon, stations, color FROM lines ORDER BY id;")
	QUERY(getPatternsByLineId,
		"SELECT id, label, interval_minutes, departure_minute, first_departure, last_departure, stop_pattern_id, is_reversed, arrival_minutes, departure_minutes "
		"FROM patterns WHERE line_id = :lineId ORDER BY id;",
		PARAM(oatpp::String, lineId))

	QUERY(getTimetablesByLineId,
		"SELECT id, label, stop_pattern_id, calendar_pattern_id, arrival_minutes, departure_minutes "
		"FROM timetables WHERE line_id = :lineId ORDER BY id;",
		PARAM(oatpp::String, lineId))

	QUERY(getLineInfoMessages,
		"SELECT message_index AS index, level, message "
		"FROM info_messages WHERE line_id = :lineId "
		"ORDER BY COALESCE(message_index, 2147483647), id;",
		PARAM(oatpp::String, lineId))

	QUERY(getPatternInfoMessages,
		"SELECT message_index AS index, level, message "
		"FROM info_messages WHERE pattern_id = :patternId "
		"ORDER BY COALESCE(message_index, 2147483647), id;",
		PARAM(oatpp::String, patternId))

	QUERY(getTimetableInfoMessages,
		"SELECT message_index AS index, level, message "
		"FROM info_messages WHERE timetable_id = :timetableId "
		"ORDER BY COALESCE(message_index, 2147483647), id;",
		PARAM(oatpp::String, timetableId))
};

}

#include OATPP_CODEGEN_END(DbClient)

#endif