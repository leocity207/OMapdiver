import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { MapElementDetail, NetworkRecord } from '$lib/types/network-data';

function toLabel(record: NetworkRecord | undefined, id: string) {
	return record?.label ?? record?.name ?? id;
}

export const load: PageLoad = async ({ params, parent }) => {
	const { network_data } = await parent();
	const id = params.elementid;

	const station = network_data.stations[id];
	if (station) {
		const element: MapElementDetail = {
			id,
			kind: 'station',
			label: toLabel(station, id),
			raw: station
		};

		return { element, network_data };
	}

	const line = network_data.lines[id];
	if (line) {
		const element: MapElementDetail = {
			id,
			kind: 'line',
			label: toLabel(line, id),
			raw: line
		};

		return { element, network_data };
	}

	throw error(404, `Unknown map element: ${id}`);
};