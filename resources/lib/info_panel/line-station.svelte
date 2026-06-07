<script lang="ts">
	import type { Network, Pattern } from "$lib/types/network";
	import type { Color_Map } from "$lib/types/color_map.ts";
	import Utils from "$lib/utils/utils";

	interface Line_Station_Data {
		arrival_minute: number | null;
		departure_time: number | null;
		station_id: string | null;
		reference_minute: number | null;
		property: string | null;
		parent: Pattern;
	}

	let {
		station_data,
		network_data,
		color_mode = $bindable("default"),
	} = $props<{
		station_data: Line_Station_Data;
		network_data: Network;
		color_mode?: Color_Map;
	}>();

	function Get_Path(): string {
		if (station_data.property === "blank")
			return "M0,0 H10 V5.714 H0 Z M0,11.428 H10 V17.142 H0 Z M0,22.856 H10 V28.57 H0 Z M0,34.284 H10 V40 H0 Z";

		const has_arrival = station_data.arrival_minute != null;
		const has_departure = station_data.departure_time != null;

		if (!has_arrival && has_departure) return "M0,20 A5,5 0 0 1 10,20 V40 H0 Z";
		else if (!has_departure && has_arrival) return "M0,0 H10 V20 A5,5 0 0 1 0,20 Z";
		return "M0,0 H10 V40 H0 Z";
	}

	function Get_Fill_Color(): string {
		const line = station_data.parent.parent;
		const color = line?.color[color_mode] || "#888";
		if (station_data.property === "gray") return "#888888";
		if (station_data.property === "blank") return "#888888";
		if (station_data.property === "half-grayed") return color;
		return color;
	}

	function Get_Station_Name(): string {
		if (!station_data.station_id || !network_data.stations[station_data.station_id]) return "";
		return network_data.stations[station_data.station_id].label || station_data.station_id;
	}

	function Get_Relative_Time(minute: number | null): string {
		if (minute === null || station_data.reference_minute === null) return "";
		return Utils.Format_Minute(minute - station_data.reference_minute);
	}

	function Should_Show_Gradient(): boolean {
		return station_data.property === "half-grayed";
	}

	function Get_Fill(): string {
		if (Should_Show_Gradient()) {
			// Create unique gradient ID using pattern ID + station ID to avoid conflicts
			// when the same station appears in different schedules
			const gradient_id = `gradient-${station_data.parent.id}-${station_data.station_id}`;
			return `url(#${gradient_id})`;
		}
		return Get_Fill_Color();
	}

	function Get_Gradient_Id(): string {
		return `gradient-${station_data.parent.id}-${station_data.station_id}`;
	}
</script>

<div class="station-row">
	<div class="times-origin">
		<span class="origin-time">
			{Get_Relative_Time(station_data.arrival_minute)}
		</span>
	</div>

	<div class="times-cadence">
		<span class="cadence-arrival">
			{station_data.arrival_minute !== null
				? Utils.Format_Minute(station_data.arrival_minute)
				: ""}
		</span>
		<span class="cadence-departure">
			{station_data.departure_time !== null
				? Utils.Format_Minute(station_data.departure_time)
				: ""}
		</span>
	</div>

	<div class="station-icon-wrap">
		<svg class="station-icon-svg" viewBox="0 0 10 40" preserveAspectRatio="none">
			{#if Should_Show_Gradient()}
				<defs>
					<linearGradient id={Get_Gradient_Id()} x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="50%" stop-color="#888888" />
						<stop
							offset="50%"
							stop-color={Get_Fill_Color()}
							class="station-gradient-color"
						/>
					</linearGradient>
				</defs>
			{/if}
			<path d={Get_Path()} fill={Get_Fill()} />
			{#if station_data.property !== "blank"}
				<circle cx="5" cy="20" r="4" fill="white" />
			{/if}
		</svg>
	</div>

	<span class="station-name">{Get_Station_Name()}</span>
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
