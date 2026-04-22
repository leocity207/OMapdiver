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
	QUERY(getStopPatterns,          "SELECT id, label, level, color, icon, variant FROM stop_patterns ORDER BY id;")
	QUERY(getStations,              "SELECT id, label, url, lines, CAST(directions AS TEXT) AS directions, have_disabled_equipment, have_bike_parking, have_car_parking, have_car_sharing, opening_time, closing_time FROM stations ORDER BY id;")
	QUERY(getLines,                 "SELECT id, label, url, icon, stations, CAST(color AS TEXT) AS color FROM lines ORDER BY id;")
	QUERY(getPatterns,              "SELECT id, label, line_id, interval_time, departure_time, first_departure, last_departure, stop_pattern, is_reversed, arrival_times, departure_times FROM patterns ORDER BY id;")
	QUERY(getTimetables,            "SELECT id, label, line_id, stop_pattern, calendar_pattern, arrival_times, departure_times FROM timetables ORDER BY id;")
	QUERY(getInfoMessages,          "SELECT info_message_id, line_id, pattern_id, timetable_id, index, level, message FROM info_messages ORDER BY info_message_id;")
};

}

#include OATPP_CODEGEN_END(DbClient)

#endif