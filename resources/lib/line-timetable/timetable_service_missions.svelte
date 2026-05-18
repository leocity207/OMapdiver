<script lang="ts">
	import { onMount } from 'svelte';

	interface Pattern {
		id: string;
		label: string;
	}

	interface Station {
		id: string;
		label: string;
		hidden?: boolean;
	}

	interface Line {
		id: string;
		label: string;
		color: {
			default: string;
			[key: string]: string;
		};
		stations: string[];
		timetables?: Array<{
			id: string;
			calendar_pattern_id: string;
			stop_pattern_id: string;
		}>;
	}

	let {
		line_data = null,
		network_data = null
	} = $props<{
		line_data?: Line | null;
		network_data?: any | null;
	}>();

	// Display state
	let display_state = $state({
		calendar_pattern: 'all',
		stop_pattern: 'all',
		display_hidden_stations: false,
		show_arrival_times: false
	});

	let show_hidden_stations = $state(false);
	let show_arrival_times = $state(false);

	// Update display state methods
	function update_calendar_pattern(pattern_id: string) {
		display_state.calendar_pattern = pattern_id;
	}

	function update_stop_pattern(pattern_id: string) {
		display_state.stop_pattern = pattern_id;
	}

	function toggle_hidden_stations(value: boolean) {
		show_hidden_stations = value;
		display_state.display_hidden_stations = value;
		refresh_visibility();
	}

	function toggle_arrival_times(value: boolean) {
		show_arrival_times = value;
		display_state.show_arrival_times = value;
		refresh_visibility();
	}

	function normalize_class_token(value: any) {
		return String(value)
			.trim()
			.toLowerCase()
			.replace(/[^a-z0-9_-]+/g, '-');
	}

	function to_array(value: any[] | null | number): any[] {
		if (Array.isArray(value)) return value;
		if (value == null) return [];
		return [value];
	}

	function pattern_list_to_tokens(list: any) {
		return to_array(list).map(normalize_class_token);
	}

	function has_any_intersection(list_a: any[], list_b: any[]) {
		if (!list_a || list_a.length === 0) return true; // no filter => visible
		const set_b = new Set(list_b);
		for (const item of list_a) {
			if (set_b.has(item)) return true;
		}
		return false;
	}

	function refresh_visibility() {
		// Update row visibility based on current filters
		const rows = document.querySelectorAll('.timetable-table tbody tr');
		rows.forEach((row) => {
			const classes = to_array(row.className)
				.join(' ')
				.split(/\s+/)
				.map(normalize_class_token);

			const calendar_tokens = pattern_list_to_tokens(display_state.calendar_pattern);
			const stop_tokens = pattern_list_to_tokens(display_state.stop_pattern);

			const calendar_match = has_any_intersection(calendar_tokens, classes);
			const stop_match = has_any_intersection(stop_tokens, classes);

			const is_hidden_row = row.classList.contains('station-hidden');
			const hidden_match = !is_hidden_row || display_state.display_hidden_stations;

			const should_show = calendar_match && stop_match && hidden_match;
			(row as HTMLElement).style.display = should_show ? '' : 'none';
		});
	}

	function render_table() {
		if (!line_data || !network_data) return;

		// Table content will be built with svelte loops
	}

	$effect(() => {
		if (line_data) {
			render_table();
		}
	});

	// Reactive computed values
	let stations = $derived(line_data?.stations ?? []);
	let timetables = $derived(line_data?.timetables ?? []);
	let line_color = $derived(line_data?.color?.default ?? '#25158B');
	let line_label = $derived(line_data?.label ?? '');
	let line_id = $derived(line_data?.id ?? '');
</script>

<div class="timetable-root">
	{#if line_data}
		<div class="timetable-header">
			<div
				class="timetable-line-badge"
				style="background-color: {line_color}; color: #fff;"
			>
				{line_label}
			</div>
			<div class="timetable-line-title">{line_label}</div>
			<div class="timetable-line-subtitle">{line_id}</div>
		</div>

		<div class="timetable-scroll">
			<table class="timetable-table">
				<thead>
					<tr>
						<th class="station-header">Station</th>
						{#each timetables as timetable (timetable.id)}
							<th
								class="timetable-header {normalize_class_token(timetable.calendar_pattern_id)} {normalize_class_token(timetable.stop_pattern_id)}"
							>
								{timetable.id}
							</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each stations as station_id, idx (station_id)}
						{@const station = network_data?.stations?.[station_id]}
						{@const is_hidden = station?.hidden === true}
						<tr
							class="station-row {is_hidden ? 'station-hidden' : ''} {station_id}"
							style="display: {idx === 0 ? '' : 'none'}"
						>
							<td class="station-name-cell">
								<div class="station-name">{station?.label ?? station_id}</div>
							</td>
							{#each timetables as timetable (timetable.id)}
								<td
									class="time-cell {normalize_class_token(timetable.calendar_pattern_id)} {normalize_class_token(timetable.stop_pattern_id)}"
								>
									<span class="time-value">--:--</span>
								</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

<style>
	.timetable-root {
		display: flex;
		flex-direction: column;
		height: 100%;
		background: #fff;
	}

	.timetable-header {
		display: flex;
		align-items: center;
		padding: 1em;
		border-bottom: 1px solid #ddd;
		gap: 1em;
	}

	.timetable-line-badge {
		width: 60px;
		height: 60px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		font-weight: bold;
		flex-shrink: 0;
		font-size: 0.875em;
	}

	.timetable-line-title {
		font-size: 1.25em;
		font-weight: 600;
		flex: 1;
	}

	.timetable-line-subtitle {
		font-size: 0.875em;
		color: #666;
	}

	.timetable-scroll {
		flex: 1;
		overflow: auto;
	}

	.timetable-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.875em;
	}

	.timetable-table thead {
		position: sticky;
		top: 0;
		background: #f5f5f5;
		border-bottom: 2px solid #ddd;
	}

	.timetable-table th,
	.timetable-table td {
		padding: 0.5em;
		text-align: left;
		border-bottom: 1px solid #eee;
	}

	.timetable-table th {
		font-weight: 600;
		background: #f5f5f5;
	}

	.station-header {
		min-width: 150px;
		font-weight: 600;
	}

	.station-name-cell {
		position: sticky;
		left: 0;
		background: #fff;
		font-weight: 500;
		min-width: 150px;
		z-index: 10;
	}

	.station-name {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.time-cell {
		min-width: 60px;
		text-align: center;
		font-family: monospace;
	}

	.time-value {
		display: inline-block;
		width: 100%;
	}

	.station-row.station-hidden {
		opacity: 0.5;
	}

	.timetable-table tbody tr:hover {
		background-color: #f9f9f9;
	}
</style>
