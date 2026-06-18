import type { Network, Line, Station } from "$lib/types/network";
import type { Search_Item } from "$lib/types/search_items.ts";

export function Get_Line_Search_Items(lines: Network["lines"]): Search_Item[] {
	return Object.entries<Line>(lines)
		.map(([_, line]) => ({
			id: line.id,
			label: line.label,
			type: "line" as const,
		}))
		.sort((a, b) => a.label.localeCompare(b.label));
}

export function Get_Station_Search_Items(stations: Network["stations"]): Search_Item[] {
	return Object.entries<Station>(stations)
		.map(([_, station]) => ({
			id: station.id,
			label: station.label,
			type: "station" as const,
		}))
		.sort((a, b) => a.label.localeCompare(b.label));
}

export function Get_All_Search_Items(network: Pick<Network, "lines" | "stations">): Search_Item[] {
	return [
		...Get_Line_Search_Items(network.lines),
		...Get_Station_Search_Items(network.stations),
	].sort((a, b) => a.label.localeCompare(b.label));
}
