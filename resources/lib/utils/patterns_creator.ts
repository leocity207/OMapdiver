import type { Stop_Pattern, Calendar_Pattern } from "$lib/types/network";
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