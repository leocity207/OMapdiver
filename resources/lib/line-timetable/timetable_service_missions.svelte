<script lang="ts">
	import type { Line, Network, Station, Timetable } from '$lib/types/network';
	import Utils from '$lib/utils/utils';

	let {
		line_data,
		network_data,
		activeCalendarPattern = 'all',
		activeStopPattern = 'all',
		showHiddenStations = false,
		showArrivalTimes = false
	} = $props<{
		line_data: Line;
		network_data: Network;
		activeCalendarPattern?: string;
		activeStopPattern?: string;
		showHiddenStations?: boolean;
		showArrivalTimes?: boolean;
	}>();

	function normalizeToken(value: unknown): string {
		return String(value ?? '')
			.trim()
			.toLowerCase()
			.replace(/[^a-z0-9_-]+/g, '-');
	}

	function getStationLabel(id: string): string {
		return network_data?.stations?.[id]?.label ?? id;
	}

	function getTimetableLabel(t: Timetable): string {
		return t?.id ?? t?.label ?? '';
	}

	function patternMatch(active: string, value: string | null | undefined): boolean {
		const v = normalizeToken(value ?? 'all');
		const a = normalizeToken(active ?? 'all');
		return a === 'all' || v === 'all' || a === v;
	}

	function isTimetableVisible(t: Timetable): boolean {
		return (
			patternMatch(activeCalendarPattern, t.calendar_pattern) &&
			patternMatch(activeStopPattern, t.stop_pattern)
		);
	}

	function hasCell(t: Timetable, idx: number): boolean {
		const a = t.arrival_times?.[idx];
		const d = t.departure_times?.[idx];
		return a != null || d != null;
	}

	function isRowVisible(stationIndex: number): boolean {
		if (!line_data?.timetables) return false;

		return line_data.timetables.some((t) => {
			if (!isTimetableVisible(t)) return false;
			return hasCell(t, stationIndex);
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
					{#each timetables as t}
						{#if isTimetableVisible(t)}
							<th class="timetable-header-cell">
								{getTimetableLabel(t)}
							</th>
						{/if}
					{/each}
				</tr>
			</thead>

			<tbody>
				{#each stationIds as stationId, i}
					<tr class="station-row" class:hidden={!showHiddenStations && !isRowVisible(i)}>

						<th class="station-cell">
							{getStationLabel(stationId)}
						</th>

						{#each timetables as t}
							{#if isTimetableVisible(t)}
								{@const a = t.arrival_times?.[i]}
								{@const d = t.departure_times?.[i]}

								<td class="timetable-cell">

									{#if d != null}
										<div class="time-content">

											{#if showArrivalTimes && a != null}
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
