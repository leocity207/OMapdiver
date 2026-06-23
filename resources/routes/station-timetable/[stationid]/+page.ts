import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import type { Network } from "$lib/types/network";

export const load: PageLoad = async ({ params, parent }) => {
	const { network_data } = (await parent()) as { network_data: Network };
	const station_id = params.stationid;

	const station = network_data.stations?.[station_id];
	if (!station) throw error(404, "Line not found");

	return {
		station,
		network_data,
	};
};
