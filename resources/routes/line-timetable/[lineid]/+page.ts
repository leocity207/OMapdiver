import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import type { Network } from "$lib/types/network";

export const load: PageLoad = async ({ params, parent }) => {
	const { network_data } = (await parent()) as { network_data: Network };
	const line_id = params.lineid;

	const line = network_data.lines?.[line_id];
	if (!line) throw error(404, "Line not found");

	return {
		line,
		network_data,
	};
};
