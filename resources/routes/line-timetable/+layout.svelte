<script lang="ts">
	import { goto } from '$app/navigation';
	import {onMount, setContext} from 'svelte';
	import { T } from '$lib/i18n';
	import Top_Panel from '$lib/componants/top_panel.svelte';
	import Line_Selector_Panel from '$lib/line-timetable/line_selector_panel.svelte';
	import PatternSwitch from '$lib/componants/pattern_switch.svelte';
	import type { Network } from '$lib/types/network';
	import SearchBar from '$lib/componants/search_bar.svelte';
	import Hamburger from '$lib/componants/hamburger.svelte';
	import LeftPanel from '$lib/componants/left_panel.svelte';

	interface PatternScheme {
		id: string;
		label: string;
		is_exceptional: boolean;
		info?: any;
		icon?: any;
		level?: number;
		variant?: any[];
		color?: string;
	}



	let { data, children } = $props();

	let line_selector_open = $state(true);
	let calendar_pattern = $state('all');
	let stop_pattern = $state('all');
	let search_query = $state('');
	let panel_open = $state(false);
	let station_timetable_options = $state();

	setContext('station_timetable_options', station_timetable_options);

	const is_viewing_element = $derived(
		page.url.pathname.match(/^\/map\/[^/]+$/)
	);

	const search_items = $derived.by<SearchItem[]>(() => {
		const stations = Object.entries(data.network_data.stations).map(([id, value]: [string, any]) => ({
			id,
			kind: 'station' as const,
			label: value.label ?? value.name ?? id
		}));

		return [...stations].sort((a, b) => a.label.localeCompare(b.label));
	});

	const network_data = $derived(data.network_data as Network);

	// Get calendar patterns with 'all' option
	let calendar_patterns = $derived.by(() => {
		if (!network_data?.calendar_patterns) return {};
		return {
			all: {
				id: 'all',
				label: 'All',
				is_exceptional: false,
				info: null,
				icon: null
			},
			...network_data.calendar_patterns
		};
	});

	// Get stop patterns with 'all' option
	let stop_patterns = $derived.by(() => {
		if (!network_data?.stop_patterns) return {};
		return {
			all: {
				id: 'all',
				label: 'All',
				is_exceptional: false,
				level: 0,
				variant: [],
				color: '',
				icon: ''
			},
			...network_data.stop_patterns
		};
	});

	function Handle_Search_Select(item: SearchItem) {
		Open_Element(item.id);
	}

	function handle_line_select(event: CustomEvent<{ line: string; network: Network }>) {
		const line_id = event.detail.line;
		void goto(`/line-timetable/${encodeURIComponent(line_id)}`);
		line_selector_open = false;
	}

	function handle_calendar_pattern_change(value: string) {
		calendar_pattern = value;
		// Could dispatch event or update UI based on pattern change
	}

	function handle_stop_pattern_change(value: string) {
		stop_pattern = value;
		// Could dispatch event or update UI based on pattern change
	}
</script>

<svelte:head>
	<title>Line Timetable</title>
</svelte:head>

<div class="line-timetable-container">

	<header class="topbar">
		<div class="topbar-left">
			<Hamburger active={panel_open} onToggle={() => (panel_open = !panel_open)} />
		</div>

		<div class="topbar-center">
			<SearchBar
				bind:value={search_query}
				items={search_items}
				placeholder={T('search_station')}
				onSelect={Handle_Search_Select}
			/>
		</div>

		<div class="topbar-right"></div>
	</header>
	

	<!-- Top Panel with Line Selector -->
	<Top_Panel bind:open={line_selector_open} enabled={true}>
		<Line_Selector_Panel network_data={network_data} on:line_select={handle_line_select}/>
	</Top_Panel>

	<LeftPanel bind:open={panel_open}>
	</LeftPanel>


	<!-- Pattern Switches -->
	<div class="patterns-container">
		<div class="pattern-switch-group">
			<label for="calendar-pattern-switch">Calendar:</label>
			<PatternSwitch
				id="calendar-pattern-switch"
				choices={calendar_patterns}
				default_choice="all"
				onchange={handle_calendar_pattern_change}
			/>
		</div>

		<div class="pattern-switch-group">
			<label for="stop-pattern-switch">Stop Pattern:</label>
			<PatternSwitch
				id="stop-pattern-switch"
				choices={stop_patterns}
				default_choice="all"
				onchange={handle_stop_pattern_change}
			/>
		</div>
	</div>

	<!-- Main Content Area -->
	<div class="content-area">
		{@render children()}
	</div>
</div>

<style>

	.topbar {
		width: 100%;
		display: flex;
		padding-top: 0.5em;
		padding-bottom: 0.5em;
		position: relative;
		z-index: 1000;
		background-color: #f5f5f5;
	}

	.topbar-left {
		flex: 0 0 auto;
		display: flex;
		align-items: center;
		padding-left: 0.5em;
	}

	.topbar-center {
		flex: 1 0 auto;
		display: flex;
		justify-content: center;
	}

	.topbar-right {
		flex: 0 0 auto;
	}

	.line-timetable-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background: #fff;
	}

	.patterns-container {
		display: flex;
		gap: 1rem;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid #ddd;
		background: #f9f9f9;
		align-items: center;
		flex-wrap: wrap;
	}

	.pattern-switch-group {
		display: flex;
		align-items: center;
		gap: 0.5rem;

		label {
			font-size: 0.875rem;
			font-weight: 500;
			color: #333;
			white-space: nowrap;
		}
	}

	.content-area {
		flex: 1;
		overflow: auto;
		display: flex;
		flex-direction: column;
	}
</style>