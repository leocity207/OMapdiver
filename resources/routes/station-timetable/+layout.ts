import type { LayoutLoad } from "./$types";
import type { Network } from "$lib/types/network";

export const load: LayoutLoad = async ({ parent }) => {
	const { network_data } = (await parent()) as { network_data: Network };
	return { network_data };
};
