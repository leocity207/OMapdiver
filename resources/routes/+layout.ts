import { Init_Config } from "$lib/config/config_loader";
import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import type { Network } from '$lib/types/network';

export const load: LayoutLoad = async ({ fetch }) => {
	await Init_Config(fetch);

	const response = await fetch('/dyn/network_data');

	if (!response.ok)
		throw error(response.status, 'Failed to load map network data');

	const network_data = (await response.json()) as Network;

	return {network_data};
}