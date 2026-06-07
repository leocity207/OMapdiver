<script lang="ts">
	import type { Network, Pattern, Line } from "$lib/types/network";
	import type { Color_Map } from "$lib/types/color_map.ts";
	import LineStation from "./line-station.svelte";
	import FoldPlusMinus from "$lib/componants/fold_plus_minus.svelte";
	import Utils from "$lib/utils/utils";

	let {
		schedule_data,
		network_data,
		reference_station = null,
		color_mode = $bindable("default"),
	} = $props<{
		schedule_data: Pattern & { parent?: Line };
		network_data: Network;
		reference_station: string | null;
		color_mode?: Color_Map;
	}>();

	let details_open = $state(false);

	function Toggle_Details() {
		details_open = !details_open;
	}

	function Get_Stations() {
		const line = schedule_data.parent as Line;
		const total_stations = line.stations.length;
		const is_reversed = schedule_data.is_reversed;

		// Find reference station index in original line.stations
		let reference_idx = reference_station ? line.stations.indexOf(reference_station) : 0;

		// If pattern is reversed, adjust the index to pattern's perspective
		if (is_reversed && reference_station !== null)
			reference_idx = total_stations - 1 - reference_idx;

		const stations = [];
		const reference_minute = schedule_data.arrival_times[reference_idx];

		if (reference_idx > 0) {
			const first_station_id = is_reversed
				? line.stations[total_stations - 1]
				: line.stations[0];
			stations.push({
				arrival_minute: schedule_data.arrival_times[0],
				departure_time: schedule_data.departure_times[0],
				station_id: first_station_id,
				reference_minute: reference_minute,
				property: "gray",
				parent: schedule_data,
			});
		}

		if (reference_idx > 1) {
			stations.push({
				arrival_minute: null,
				departure_time: null,
				station_id: null,
				reference_minute: reference_minute,
				property: "blank",
				parent: schedule_data,
			});
		}

		// Reference station
		let ref_station_id =
			reference_station ||
			(is_reversed ? line.stations[total_stations - 1] : line.stations[0]);
		stations.push({
			arrival_minute: schedule_data.arrival_times[reference_idx],
			departure_time: schedule_data.departure_times[reference_idx],
			station_id: ref_station_id,
			reference_minute: reference_minute,
			property: reference_idx > 0 ? "half-grayed" : null,
			parent: schedule_data,
		});

		// Add remaining stations
		if (is_reversed) {
			// For reversed: go backwards from reference
			for (let i = reference_idx + 1; i < total_stations; i++) {
				stations.push({
					arrival_minute: schedule_data.arrival_times[i],
					departure_time: schedule_data.departure_times[i],
					station_id: line.stations[total_stations - 1 - i],
					reference_minute: reference_minute,
					property: null,
					parent: schedule_data,
				});
			}
		} else {
			// For normal: go forwards from reference
			for (let i = reference_idx + 1; i < total_stations; i++) {
				stations.push({
					arrival_minute: schedule_data.arrival_times[i],
					departure_time: schedule_data.departure_times[i],
					station_id: line.stations[i],
					reference_minute: reference_minute,
					property: null,
					parent: schedule_data,
				});
			}
		}

		return stations;
	}
</script>

<div class="schedule-item">
	<button class="schedule-header" onclick={Toggle_Details}>
		<div class="header-left">
			<div class="header-left-icon">
				{#if network_data.stop_patterns[schedule_data.stop_pattern]}
					{network_data.stop_patterns[schedule_data.stop_pattern].icon}
				{/if}
			</div>
			<div class="header-left-text">{schedule_data.label}</div>
		</div>
		<div class="header-right">
			<div class="header-minute">{Utils.Format_Minute(schedule_data.departure_time)}</div>
			{#if schedule_data.info_messages?.length}
				<div class="header-icon">
					<svg class="schedule-info-icon" viewBox="0 0 20 20">
						<rect x="0" y="0" rx="5" ry="5" width="20" height="20" fill="#888" />
						<text x="10" y="15" text-anchor="middle" font-size="15" fill="#fff">i</text>
					</svg>
				</div>
			{/if}
			<div class="fold-icon">
				<FoldPlusMinus bind:active={details_open} />
			</div>
		</div>
	</button>

	{#if details_open}
		<div class="schedule-details open">
			{#each Get_Stations() as station (station.station_id ?? "blank")}
				<LineStation station_data={station} {network_data} {color_mode} />
			{/each}
		</div>
	{/if}
</div>

<style>
	.schedule-item {
		border-top: 1px solid #ddd;
		background-color: #e5e5e5;
	}

	.schedule-item:first-child {
		border-top: none;
	}

	.schedule-header {
		padding: 0.5em;
		cursor: pointer;
		display: flex;
		justify-content: space-between;
		user-select: none;
		align-items: center;
		border: none;
		background: none;
		width: 100%;
	}

	.schedule-details {
		padding-left: 0.5em;
		padding-right: 0.5em;
		padding-bottom: 0.5em;
	}

	.header-left {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		width: 100%;
		height: 100%;
	}

	.header-right {
		display: flex;
		align-items: center;
		gap: 1em;
		margin-left: auto;
	}

	.header-left-icon {
		height: 1.5rem;
	}

	.header-left-icon :global(svg) {
		width: 100%;
		height: 100%;
		display: block;
	}

	.header-left-text {
		font-size: 14px;
		color: #444;
	}

	.header-minute {
		font-size: 14px;
		color: #333;
	}

	.header-icon {
		width: 1em;
		aspect-ratio: 1 / 1;
	}

	.schedule-info-icon {
		width: 100%;
		height: 100%;
		display: block;
	}

	.fold-icon {
		cursor: pointer;
		width: 1.5em;
		height: 1.5em;
		flex-shrink: 0;
		pointer-events: none;
	}
</style>
