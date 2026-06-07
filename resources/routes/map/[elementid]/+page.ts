import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import type { Station, Line } from "$lib/types/network";

function To_Label(record: Station | Line | undefined, id: string) {
	return record?.label ?? id;
}

export const load: PageLoad = async ({ params, parent }) => {
	const { network_data } = await parent();
	const id = params.elementid;

	const station = network_data.stations[id];
	if (station) {
		const element = {
			id,
			kind: "station",
			label: To_Label(station, id),
			raw: station,
		};

		return { element, network_data };
	}

	const line = network_data.lines[id];
	if (line) {
		const element = {
			id,
			kind: "line",
			label: To_Label(line, id),
			raw: line,
		};

		return { element, network_data };
	}

	throw error(404, `Unknown map element: ${id}`);
};
