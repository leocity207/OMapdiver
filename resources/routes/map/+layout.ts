import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import type { Network } from '$lib/types/network';

export const load: LayoutLoad = async ({ fetch }: Parameters<LayoutLoad>[0]) => {
	const response = await fetch('/dyn/network_data');

	if (!response.ok)
		throw error(response.status, 'Failed to load map network data');

	const networkData = (await response.json()) as Network;

	return {
		networkData
	};
};