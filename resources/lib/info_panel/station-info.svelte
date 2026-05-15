<script lang="ts">
	import type { Network, Station, Pattern, Line } from '$lib/types/network';
	import LineSchedule from './line-schedule.svelte';

	let {
		station_data,
		network_data
	} = $props<{
		station_data: Station;
		network_data: Network;
	}>();

	function get_grouped_schedules(): Map<string, (Pattern & { parent?: Line })[]> {
		const direction_map = new Map<string, (Pattern & { parent?: Line })[]>();

		station_data.lines.forEach((line_id: string) => {
			const line = network_data.lines[line_id];
			if (!line) return;

			line.patterns.forEach((schedule: Pattern) => {
				const last_stop = line.stations[line.stations.length - 1];
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

	function get_direction_label(direction_code: string): string {
		const station = network_data.stations[direction_code];
		return station?.label || direction_code;
	}

	const grouped_schedules = $derived(get_grouped_schedules());
</script>

<div class="station-info">
	<div class="station-header">
		<div class="station-title">{station_data.label}</div>
	</div>

	<div class="station-subtitle">
		Liaisons grandes lignes directes<br />
		{station_data.label} → Toutes les directions
	</div>

	<div class="schedules">
		{#each grouped_schedules.entries() as [direction_code, schedule_group] (direction_code)}
			<div class="schedule-direction-header">
				<span class="direction-label">Direction: {get_direction_label(direction_code)}</span>
			</div>
			{#each schedule_group as schedule (schedule.id)}
				<LineSchedule
					schedule_data={schedule}
					{network_data}
					reference_station={station_data.id}
				/>
			{/each}
		{/each}
	</div>
</div>

<style>
	.station-header {
		display: flex;
		align-items: center;
		margin-bottom: 0.5em;
		padding-left: 0.5em;
	}

	.station-title {
		font-size: 1.25em;
		flex: 1;
	}

	.station-subtitle {
		background: #f0f0f0;
		padding: 0.75em;
		margin-bottom: 1em;
		border-left: 4px solid #666;
		font-size: 0.9em;
		line-height: 1.5;
	}

	.schedules {
		margin-top: 0.5em;
		overflow: auto;
	}

	.schedule-direction-header {
		padding: 0.75em 0.5em;
		background: #f8f8f8;
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
</style>
