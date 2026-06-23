import type { Network, Station, Timetable, Line } from "$lib/types/network";
import type { Station_Timetable_Options } from "$lib/types/options";

export interface Timetable_Entry {
    departure_seconds: number;
    arrival_seconds: number | null;
    line: Line;
    timetable: Timetable;
    station_index: number;
    destination_label: string;
    destination_id: string;
    has_info: boolean;
}

export interface Hour_Group {
    hour: number;
    entries: Timetable_Entry[];
}

function Is_Timetable_Visible(
    timetable: Timetable,
    options: Station_Timetable_Options
): boolean {
    const stop_ok =
        options.selected_stop_pattern === "all" ||
        timetable.stop_pattern === options.selected_stop_pattern;
    const cal_ok =
        options.selected_calendar_pattern === "all" ||
        timetable.calendar_patterns.includes(options.selected_calendar_pattern);
    return stop_ok && cal_ok;
}

function Get_Station_Index(station: Station, line: Line): number {
    return line.stations.indexOf(station.id);
}

function Get_Destination(
    line: Line,
    station_index: number,
    network: Network
): { id: string; label: string } {
    // Last station in line after current position
    const remaining = line.stations.slice(station_index + 1);
    const dest_id = remaining[remaining.length - 1];
    if (!dest_id) return { id: "", label: "" };
    const dest = network.stations[dest_id];
    return { id: dest_id, label: dest?.label ?? dest_id };
}

export function Build_Station_Timetable(
    station: Station,
    network: Network,
    options: Station_Timetable_Options
): Hour_Group[] {
    const entries: Timetable_Entry[] = [];

    for (const line_id of station.lines) {
        const line = network.lines[line_id];
        if (!line) continue;

        const station_index = Get_Station_Index(station, line);
        if (station_index === -1) continue;

        for (const timetable of line.timetables) {
            if (!Is_Timetable_Visible(timetable, options)) continue;

            const dep = timetable.departure_times[station_index];
            if (dep === null || dep === undefined) continue;

            const arr = timetable.arrival_times[station_index] ?? null;
            const destination = Get_Destination(line, station_index, network);
            if (!destination.id) continue;

            entries.push({
                departure_seconds: dep,
                arrival_seconds: arr,
                line,
                timetable,
                station_index,
                destination_label: destination.label,
                destination_id: destination.id,
                has_info: timetable.info_messages?.length > 0,
            });
        }
    }

    // Sort: service starts at 4:00 (14400s), wraps past midnight
    const DAY = 24 * 3600;
    const START = 4 * 3600;
    entries.sort((a, b) => {
        const norm = (s: number) => s < START ? s + DAY : s;
        return norm(a.departure_seconds) - norm(b.departure_seconds);
    });

    // Group by hour
    const hour_map = new Map<number, Timetable_Entry[]>();
    for (const entry of entries) {
        const hour = Math.floor(entry.departure_seconds / 3600) % 24;
        if (!hour_map.has(hour)) hour_map.set(hour, []);
        hour_map.get(hour)!.push(entry);
    }

    // Sort hours with same wrap logic
    return [...hour_map.entries()]
        .sort(([a], [b]) => {
            const norm = (h: number) => h < 4 ? h + 24 : h;
            return norm(a) - norm(b);
        })
        .map(([hour, entries]) => ({ hour, entries }));
}