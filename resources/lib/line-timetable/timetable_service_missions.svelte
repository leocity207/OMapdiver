<script lang="ts">
	import type { Line, Network, Timetable } from '$lib/types/network';
	import type { Line_Timetable_Options } from '$lib/types/options';
	import Utils from '$lib/utils/utils';

	let {
		line_data,
		network_data,
		options
	} = $props<{
		line_data: Line;
		network_data: Network;
		options: Line_Timetable_Options;
	}>();

	function isTimetableVisible(t: Timetable): boolean {
		let is_stopping_pattern_visible: boolean = t.stop_pattern === options.selected_stop_pattern || options.selected_stop_pattern === 'all';
		let is_calendar_pattern_visible: boolean = t.calendar_patterns.includes(options.selected_calendar_pattern) || options.selected_calendar_pattern === 'all';

		return is_stopping_pattern_visible && is_calendar_pattern_visible;
	}

	function hasCell(t: Timetable, idx: number): boolean {
		const a = t.arrival_times?.[idx];
		const d = t.departure_times?.[idx];
		return a != null || d != null;
	}

	function isRowVisible(stationIndex: number): boolean {
		if (!line_data?.timetables) return false;

		return line_data.timetables.some((timetable: Timetable) => {
			if (!isTimetableVisible(timetable)) return false;
			return hasCell(timetable, stationIndex);
		});
	}

	function lineIcon(): string {
		return line_data?.icon ?? '';
	}

	const timetables = $derived(line_data?.timetables ?? []);
	const stationIds = $derived(line_data?.stations ?? []);
	const lineTitle = $derived(line_data?.label ?? '');
	const lineId = $derived(line_data?.id ?? '');
	const lineColor = $derived(line_data?.color?.default ?? '#25158B');
</script>

{#if line_data}
<div class="timetable-root">

	<!-- HEADER -->
	<div class="timetable-header">
		<div class="line-icon">
			{@html lineIcon()}
		</div>

		<div class="line-text">
			<div class="line-title">{lineTitle}</div>
			<div class="line-subtitle">{lineId}</div>
		</div>
	</div>

	<!-- TABLE -->
	<div class="timetable-scroll">
		<table class="timetable-table">

			<thead>
				<tr>
					<th class="station-header">Stations</th>
					{#each timetables as timetable}
						{#if isTimetableVisible(timetable)}
							<th class="timetable-header-cell">
								{timetable.label}
							</th>
						{/if}
					{/each}
				</tr>
			</thead>

			<tbody>
				{#each stationIds as stationId, i}
					<tr class="station-row" class:hidden={!options.showHiddenStations && !isRowVisible(i)}>

						<th class="station-cell">
							{network_data.stations[stationId].label}
						</th>

						{#each timetables as timetable}
							{#if isTimetableVisible(timetable)}
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
	.timetable-root {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.timetable-header {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.line-icon :global(svg) {
		width: 3rem;
		height: 3rem;
	}

	.line-text {
		display: flex;
		flex-direction: column;
	}

	.line-title {
		font-weight: 700;
		font-size: 1.1rem;
	}

	.line-subtitle {
		opacity: 0.7;
		font-size: 0.9rem;
	}

	.timetable-scroll {
		overflow: auto;
	}

	.timetable-table {
		width: 100%;
		border-collapse: collapse;
	}

	th, td {
		padding: 0.5rem;
		text-align: center;
	}

	.station-header,
	.station-cell {
		text-align: left;
		position: sticky;
		left: 0;
		background: white;
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
