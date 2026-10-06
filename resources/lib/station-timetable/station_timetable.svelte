<script lang="ts">
	import type { Network, Station } from "$lib/types/network";
	import type { Timetable_Entry } from "$lib/utils/station_timetable";
	import type { Station_Timetable_Options } from "$lib/types/options.ts";
	import type { Color_Map } from "$lib/types/color_map";
	import { Build_Station_Timetable, Filter_Station_Timetable_Groups } from "$lib/utils/station_timetable";
	import { T } from "$lib/i18n"
	import Station_Timetable_Hour from "$lib/station-timetable/station_timetable_hour.svelte";
	import Station_Direction_Switch from "$lib/station-timetable/station_direction_switch.svelte";
	

	let {
		station,
		network,
		options,
		On_Train_Selected,
		color_mode,
	} = $props<{
		station: Station;
		network: Network;
		options: Station_Timetable_Options;
		On_Train_Selected: (entry: Timetable_Entry) => void;
		color_mode: Color_Map;
	}>();

	const base_hour_groups = $derived.by(() =>
		Build_Station_Timetable(
			station,
			network,
			{
				selected_calendar_pattern: "all",
				selected_stop_pattern: "all",
				direction: "all",
				show_arrival_times: false,
			},
			false
		)
	);

	const hour_groups = $derived.by(() =>
		Filter_Station_Timetable_Groups(base_hour_groups, options)
	);

	const On_Direction_Change = (station_id: string) => options.direction = station_id;
</script>

<div class="station-timetable">

	<div class="station-header">
		<div class="station-name">{station.label}</div>
		<label for="station_direction_switch">{T("direction")}</label>
		<Station_Direction_Switch
            {station}
            {network}
            On_Change={On_Direction_Change}
        />
	</div>
	
	<div class="timetable-container">
		{#if hour_groups.length === 0}
			<div class="empty">{T("no_departure")}</div>
		{:else}
			{#each hour_groups as group (group.hour)}
				<Station_Timetable_Hour
					{group}
					show_arrival={options.show_arrival_times}
					on_expand={On_Train_Selected}
					{color_mode}
					selected_direction={options.direction}
				/>
			{/each}
		{/if}
	</div>
</div>

<style>

	.timetable-container {
		width: 60%;
		margin: 0 auto;
	}

	.station-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
	}

	.station-header > .station-name {
		font-size: larger;
		font-weight: bold;
		padding-right: 5rem;
	}

	.station-timetable {
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		background: #fff;
		padding-bottom: 2em;
		padding-right: 1em;
		padding-left: 1em;
	}

	.empty {
		padding: 2rem;
		text-align: center;
		color: #888;
		font-size: 0.95rem;
	}
</style>