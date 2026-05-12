import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { MapElementDetail, NetworkRecord } from '$lib/types/network-data';

function toLabel(record: NetworkRecord | undefined, id: string) {
	return record?.label ?? record?.name ?? id;
}

export const load: PageLoad = async ({ params, parent }) => {
	const { networkData } = await parent();
	const id = params.elementid;

	const station = networkData.stations[id];
	if (station) {
		const element: MapElementDetail = {
			id,
			kind: 'station',
			label: toLabel(station, id),
			raw: station
		};

		return { element };
	}

	const line = networkData.lines[id];
	if (line) {
		const element: MapElementDetail = {
			id,
			kind: 'line',
			label: toLabel(line, id),
			raw: line
		};

		return { element };
	}

	throw error(404, `Unknown map element: ${id}`);
};