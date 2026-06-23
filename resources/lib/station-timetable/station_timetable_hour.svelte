<script lang="ts">
	import type { Hour_Group, Timetable_Entry } from "$lib/utils/station_timetable";
	import type { Color_Map } from "$lib/types/color_map";
	import { T } from "$lib/i18n"
	import StationTimetableRow from "$lib/station-timetable/station_timetable_row.svelte";

	let {
		group,
		show_arrival,
		on_expand,
		color_mode
	} = $props<{
		group: Hour_Group;
		show_arrival: boolean;
		on_expand: (entry: Timetable_Entry) => void;
		color_mode: Color_Map;
	}>();
</script>

<div class="hour-group">
	<div class="hour-header">
		<span class="hour-label">
			{group.hour} <span class="hour-min">00</span>
		</span>
		<div class="hour-rule-wrapper">
			<span class="voie-label">{T("platform")}</span>
			<div class="hour-rule"></div>
		</div>
	</div>

	<div class="hour-rows">
		{#each group.entries as entry (entry.timetable.id + entry.departure_seconds)}
			<StationTimetableRow
				{entry}
				{show_arrival}
				{on_expand}
				{color_mode}
			/>
		{/each}
	</div>
</div>

<style>
	.hour-group {
		margin-bottom: 1.5rem;
	}

	.hour-header {
		display: flex;
		align-items: flex-end;
		gap: 0.75rem;
		padding: 0 1rem;
		margin-bottom: 0.1rem;
	}

	.hour-label {
		font-size: 3rem;
		font-weight: 900;
		line-height: 1;
		white-space: nowrap;
	}

	.hour-min {
		font-size: 3rem;
		font-weight: 900;
	}

	.hour-rule-wrapper {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		padding-bottom: 0.4rem;
		gap: 0.1rem;
	}

	.voie-label {
		font-size: 0.75rem;
		color: #888;
		letter-spacing: 0.03em;
	}

	.hour-rule {
		width: 100%;
		height: 2px;
		background: #1a1a1a;
	}

	.hour-rows {
		display: flex;
		flex-direction: column;
	}
</style>