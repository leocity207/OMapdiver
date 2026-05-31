<script lang="ts">
	import type { Line, Network, Timetable } from '$lib/types/network';
	import type { Line_Timetable_Options } from '$lib/types/options';
	import type { Pattern_Scheme } from '$lib/componants/pattern_switch.svelte';
	import type { Color_Map } from '$lib/types/color_map';
	import Pattern_Switch from '$lib/componants/pattern_switch.svelte';
	import Utils from '$lib/utils/utils';

	let {
		line_data,
		network_data,
		options,
		color_mode
	} = $props<{
		line_data: Line;
		network_data: Network;
		options: Line_Timetable_Options;
		color_mode : Color_Map;
	}>();

	let line_icon_container = $state<HTMLDivElement>();
	let show_reverse = $state(false);
	let timetable_root = $state<HTMLDivElement>();

	function Is_Timetable_Visible(t: Timetable): boolean {
		let is_stopping_pattern_visible: boolean = t.stop_pattern === options.selected_stop_pattern || options.selected_stop_pattern === 'all';
		let is_calendar_pattern_visible: boolean = t.calendar_patterns.includes(options.selected_calendar_pattern) || options.selected_calendar_pattern === 'all';

		return is_stopping_pattern_visible && is_calendar_pattern_visible;
	}

	function Has_Cell(t: Timetable, idx: number): boolean {
		const a = t.arrival_times?.[idx];
		const d = t.departure_times?.[idx];
		return a != null || d != null;
	}

	function Is_Row_Visible(stationIndex: number): boolean {
		if (!line_data?.timetables) return false;

		return line_data.timetables.some((timetable: Timetable) => {
			if (!Is_Timetable_Visible(timetable)) return false;
			return Has_Cell(timetable, stationIndex);
		});
	}

	const timetables = $derived(line_data.timetables.filter((t: Timetable) => t.is_reversed === show_reverse));
	const stationIds = $derived(show_reverse ? line_data.stations.slice().reverse() : line_data.stations);
	const lineTitle = $derived(line_data.label);


	$effect(() => {
		let color = line_data.color[color_mode];
		const rect = line_icon_container?.querySelector('rect');
		if (rect)
			rect.setAttribute('fill', color);
		timetable_root?.style.setProperty('--line-color-light', Utils.Lighten_Color(color, 0.9));
	});

	const normal_order: Pattern_Scheme = $derived.by(() => ({
		id: 'normal',
		label: network_data.stations[line_data.stations[0]].label + ' → ' + network_data.stations[line_data.stations[line_data.stations.length - 1]].label,
	}));

	const reversed_order: Pattern_Scheme = $derived.by(() => ({
		id: 'reversed',
		label: network_data.stations[line_data.stations[line_data.stations.length - 1]].label + ' → ' + network_data.stations[line_data.stations[0]].label,
	}));


</script>

{#if line_data}
<div class="timetable-root" bind:this={timetable_root}>

	<!-- HEADER -->
	<div class="timetable-header">
		<div class="line-icon" bind:this={line_icon_container}>
			{@html line_data.icon}
		</div>

		<div class="line-text">
			<div class="line-title">{lineTitle}</div>
		</div>

		<div class="order-switch">
			<Pattern_Switch
				choices={[normal_order, reversed_order]}
				default_choice="normal"
				On_Change={(value: string) => {
					value === 'normal' ? show_reverse = false : show_reverse = true;
				}}
			/>
		</div>
	</div>

	<!-- TABLE -->
	<div class="timetable-scroll">
		<table class="timetable-table">

			<thead>
				<tr>
					<th class="station-header">Stations</th>
					{#each timetables as timetable}
						{#if Is_Timetable_Visible(timetable)}
							<th class="timetable-header-cell">
								{timetable.label}
							</th>
						{/if}
					{/each}
				</tr>
			</thead>

			<tbody>
				{#each stationIds as stationId, i}
					<tr class="station-row" class:hidden={!options.showHiddenStations && !Is_Row_Visible(i)}>

						<th class="station-cell">
							{network_data.stations[stationId].label}
						</th>

						{#each timetables as timetable}
							{#if Is_Timetable_Visible(timetable)}
								{@const a = timetable.arrival_times?.[i]}
								{@const d = timetable.departure_times?.[i]}

								<td class="timetable-cell">

									{#if d != null}
										<div class="time-content">

											{#if options.showArrivalTimes && a != null}
												<span class="time-arrival">
													{Utils.Format_Minute(a)}
												</span>
											{/if}

											<span class="time-main">
												{Utils.Format_Minute(d)}
											</span>

										</div>

									{:else if a != null}
										<span class="time-main time-terminal">
											{Utils.Format_Minute(a)}
										</span>

									{:else}
										|
									{/if}

								</td>
							{/if}
						{/each}

					</tr>
				{/each}
			</tbody>

		</table>
	</div>

</div>
{/if}

<style>

	tbody tr:nth-child(even),
	thead tr {
		background-color: var(--line-color-light);
	}

	tbody tr:nth-child(even) .station-cell,
	.station-header {
		background-color: var(--line-color-light);
	}

	tbody tr:nth-child(odd) .station-cell  {
		background-color: white;
	}

	.timetable-root {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.timetable-header {
		padding: 0.75rem 1rem;
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.line-icon {
		height: 2rem;
	}

	.line-icon :global(svg) {
		width: 100%;
		height: 100%;
	}

	.line-text {
		display: flex;
		flex-direction: column;
	}

	.line-title {
		font-weight: 700;
		font-size: 1.1rem;
	}

	.timetable-scroll {
		overflow: auto;
	}

	.timetable-table {
		border-collapse: collapse;
	}

	th, td {
		padding: 0.2rem;
		text-align: center;
		white-space: nowrap;
	}

	.station-header,
	.station-cell {
		text-align: left;
		position: sticky;
		left: 0;
	}

	.time-content {
		display: flex;
		flex-direction: column;
	}

	.time-arrival {
		font-size: 0.8rem;
		opacity: 0.6;
	}

	.time-main {
		font-weight: 600;
	}

	.time-terminal {
		font-style: italic;
	}

	.hidden {
		display: none;
	}
</style>
