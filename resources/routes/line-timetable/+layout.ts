import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent }) => {
	const { network_data } = await parent();
	return { network_data };
};