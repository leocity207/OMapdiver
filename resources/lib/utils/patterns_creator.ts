import type { Calendar_Pattern, Network, Station, Stop_Pattern } from "$lib/types/network";
import type { Extended_Switch_Choice } from "$lib/types/switch.ts";
import { T, Translate_Or_Value } from "$lib/i18n";

export function Get_Choices_For_Stop_Patterns( stop_patterns: { [index: string]: Stop_Pattern }): Extended_Switch_Choice[] {
	return [
		{
			id: "all",
			label: T("all"),
			is_exceptional: false,
		},
		...Object.values(stop_patterns).map((pattern) => ({
			...pattern,
			label: Translate_Or_Value(pattern.label),
		})),
	];
}
export function Get_Choices_For_Directions(
	station: Station,
	network: Network
): Extended_Switch_Choice[] {
	const all_choice: Extended_Switch_Choice = {
		id: "all",
		label: T("all"),
		is_exceptional: false,
	};

	const reachable_ids = new Set<string>();
	for (const line_id of station.lines) {
		const line = network.lines[line_id];
		if (!line) continue;
		for (const station_id of line.stations) {
			reachable_ids.add(station_id);
		}
	}

	const normal_ids = new Set(Object.values(station.directions));
	const exceptional_ids = new Set(
		[...reachable_ids].filter((id) => !normal_ids.has(id) && id !== station.id)
	);

	const To_Choice = (id: string, is_exceptional: boolean): Extended_Switch_Choice | null => {
		const entry = network.stations[id];
		if (!entry) return null;
		return {
			id,
			label: Translate_Or_Value(entry.label),
			is_exceptional,
		};
	};

	const normal = [...normal_ids]
		.map((id) => To_Choice(id, false))
		.filter((choice): choice is Extended_Switch_Choice => choice !== null)
		.sort((a, b) => a.label.localeCompare(b.label));

	const exceptional = [...exceptional_ids]
		.map((id) => To_Choice(id, true))
		.filter((choice): choice is Extended_Switch_Choice => choice !== null)
		.sort((a, b) => a.label.localeCompare(b.label));

	return [all_choice, ...normal, ...exceptional];
}
export function Get_Choices_For_Calendar_Patterns( calendar_patterns: { [index: string]: Calendar_Pattern }): Extended_Switch_Choice[] {
	return [
		{
			id: "all",
			label: T("all"),
			is_exceptional: false,
		},
		...Object.values(calendar_patterns).map((pattern) => ({
			...pattern,
			label: Translate_Or_Value(pattern.label),
		})),
	];
}