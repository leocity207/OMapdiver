<script lang="ts">
	import type { Network, Pattern } from '$lib/types/network';

	interface LineStationData {
		arrival_minute: number | null;
		departure_time: number | null;
		station_id: string | null;
		reference_minute: number | null;
		property: string | null;
		parent: Pattern;
	}

	let {
		station_data,
		network_data
	} = $props<{
		station_data: LineStationData;
		network_data: Network;
	}>();

	const SVG_NS = 'http://www.w3.org/2000/svg';

	function format_minute(minutes: number): string {
		if (minutes === null || minutes === undefined) return '';
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
	}

	function get_path(): string {
		if (station_data.property === 'blank') {
			return 'M0,0 H10 V5.714 H0 Z M0,11.428 H10 V17.142 H0 Z M0,22.856 H10 V28.57 H0 Z M0,34.284 H10 V40 H0 Z';
		}

		const has_arrival = station_data.arrival_minute != null;
		const has_departure = station_data.departure_time != null;

		if (!has_arrival && has_departure) {
			return 'M0,20 A5,5 0 0 1 10,20 V40 H0 Z';
		} else if (!has_departure && has_arrival) {
			return 'M0,0 H10 V20 A5,5 0 0 1 0,20 Z';
		}
		return 'M0,0 H10 V40 H0 Z';
	}

	function get_fill_color(): string {
		const line = station_data.parent.parent;
		const color = line?.color?.default || '#888';
		if (station_data.property === 'gray') return '#888888';
		if (station_data.property === 'blank') return '#888888';
		if (station_data.property === 'half-grayed') return color;
		return color;
	}

	function get_station_name(): string {
		if (!station_data.station_id || !network_data.stations[station_data.station_id]) {
			return '';
		}
		return network_data.stations[station_data.station_id].label || station_data.station_id;
	}

	function get_relative_time(minute: number | null): string {
		if (minute === null || station_data.reference_minute === null) return '';
		return format_minute(minute - station_data.reference_minute);
	}
</script>

<div class="station-row">
	<div class="times-origin">
		<span class="origin-time">
			{get_relative_time(station_data.arrival_minute)}
		</span>
	</div>

	<div class="times-cadence">
		<span class="cadence-arrival">
			{station_data.arrival_minute !== null ? format_minute(station_data.arrival_minute) : ''}
		</span>
		<span class="cadence-departure">
			{station_data.departure_time !== null ? format_minute(station_data.departure_time) : ''}
		</span>
	</div>

	<div class="station-icon-wrap">
		<svg class="station-icon-svg" viewBox="0 0 10 40" preserveAspectRatio="none">
			<defs>
				<linearGradient id="station-vertical-gradient-{station_data.station_id}" x1="0%" y1="0%" x2="0%" y2="100%">
					<stop offset="50%" stop-color="#888888" />
					<stop offset="50%" stop-color={get_fill_color()} class="station-gradient-color" />
				</linearGradient>
			</defs>
			<path d={get_path()} fill="url(#station-vertical-gradient-{station_data.station_id})" />
			<circle cx="5" cy="20" r="4" fill="white" />
		</svg>
	</div>

	<span class="station-name">{get_station_name()}</span>
</div>

<style>
	.station-row {
		display: flex;
		align-items: center;
	}

	.times-origin,
	.times-cadence {
		display: flex;
		flex-direction: column;
		text-align: right;
		min-width: 3em;
	}

	.times-origin {
		margin-right: -0.75em;
		margin-left: 1.25em;
	}

	.origin-time {
		font-size: 0.8em;
		color: #444;
	}

	.times-cadence {
		margin-right: 0.5em;
	}

	.cadence-arrival {
		font-size: 0.8em;
	}

	.cadence-departure {
		font-size: 0.8em;
		font-weight: bold;
	}

	.station-icon-wrap {
		padding: 0;
		width: 10px;
		margin-top: -1px;
		margin-bottom: -1px;
		height: 100%;
		margin: 0 0.5em;
		display: inline-flex;
		justify-content: center;
	}

	.station-icon-svg {
		width: 100%;
		height: auto;
	}

	.station-name {
		flex: 1;
		font-size: 1em;
		color: #222;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
