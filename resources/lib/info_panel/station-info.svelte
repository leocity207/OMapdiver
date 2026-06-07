<script lang="ts">
	import type { Network, Station, Pattern, Line } from "$lib/types/network";
	import type { Color_Map } from "$lib/types/color_map.ts";
	import { resolve } from "$app/paths";
	import LineSchedule from "./line-schedule.svelte";
	import Round_Cross from "$lib/componants/round-cross.svelte";
	import { goto } from "$app/navigation";
	import { T } from "$lib/i18n";

	let {
		station_data,
		network_data,
		color_mode = $bindable("default"),
	} = $props<{
		station_data: Station;
		network_data: Network;
		color_mode?: Color_Map;
	}>();

	function Get_Grouped_Chedules(): Map<string, (Pattern & { parent?: Line })[]> {
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const direction_map = new Map<string, (Pattern & { parent?: Line })[]>();

		station_data.lines.forEach((line_id: string) => {
			const line = network_data.lines[line_id];
			if (!line) return;

			line.patterns.forEach((schedule: Pattern) => {
				// Determine the actual last stop based on pattern direction
				const last_stop = schedule.is_reversed
					? line.stations[0] // If reversed, last stop is first in array
					: line.stations[line.stations.length - 1]; // Otherwise, last stop is last in array

				// Skip if this station is the terminal/last stop of the pattern
				if (last_stop === station_data.id) return;

				const schedule_with_parent = { ...schedule, parent: line };
				const direction_code = station_data.directions[schedule.id];
				if (!direction_map.has(direction_code)) {
					direction_map.set(direction_code, []);
				}
				direction_map.get(direction_code)!.push(schedule_with_parent);
			});
		});

		return direction_map;
	}

	function Get_Direction_Label(direction_code: string): string {
		const station = network_data.stations[direction_code];
		return station?.label || direction_code;
	}

	const grouped_schedules = $derived(Get_Grouped_Chedules());

</script>

<div class="station-info">
	<header>
		<div class="title">
			{station_data.label}
		</div>
		<div class="close-button">
			<Round_Cross onclick={() => goto(resolve("../"))} />
		</div>
	</header>

	<div class="station-subtitle">
		{T("direct_routes")}<br />
		{station_data.label} → {T("all_directions")}
	</div>

	<div class="schedules">
		{#each grouped_schedules.entries() as [direction_code, schedule_group] (direction_code)}
			<div class="schedule-direction-header">
				<span class="direction-label">Direction: {Get_Direction_Label(direction_code)}</span
				>
			</div>
			{#each schedule_group as schedule (schedule.id)}
				<LineSchedule
					schedule_data={schedule}
					{network_data}
					reference_station={station_data.id}
					{color_mode}
				/>
			{/each}
		{/each}
	</div>
</div>

<style>
	.station-subtitle {
		padding: 0.75em;
		padding-bottom: 0;
		font-size: 0.9em;
		line-height: 1.5;
	}

	.schedules {
		margin-top: 0.5em;
		overflow: auto;
	}

	.schedule-direction-header {
		padding: 0 0.5em 0 0.5em;
		border-bottom: 1px solid #ddd;
		margin-top: 1em;
	}

	.schedule-direction-header:first-child {
		margin-top: 0;
	}

	.direction-label {
		font-weight: 600;
		color: #333;
		font-size: 0.95em;
	}

	header {
		padding: 1rem;
		padding-bottom: 0;
		display: flex;
	}

	header > .title {
		font-size: 1.5em;
		font-weight: bold;
		flex: 1;
	}

	header > .close-button {
		height: 2rem;
		width: 2rem;
		aspect-ratio: 1 / 1;
	}
</style>
