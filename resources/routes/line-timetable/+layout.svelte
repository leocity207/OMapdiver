<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Search_Item } from '$lib/componants/search_bar.svelte';
	import { T } from '$lib/i18n';
	import Top_Panel from '$lib/componants/top_panel.svelte';
	import Line_Selector_Panel from '$lib/line-timetable/line_selector_panel.svelte';
	import PatternSwitch from '$lib/componants/pattern_switch.svelte';
	import type { Network } from '$lib/types/network';
	import SearchBar from '$lib/componants/search_bar.svelte';
	import Hamburger from '$lib/componants/hamburger.svelte';
	import LeftPanel from '$lib/componants/left_panel.svelte';
	import { Get_Line_Timetable_Options } from '$lib/utils/options.svelte.js';

	let { data, children } = $props();

	let line_selector_open = $state(true);
	let panel_open = $state(true);
	let options = Get_Line_Timetable_Options();


	const search_items = $derived.by<Search_Item[]>(() => {
		const lines = Object.entries(data.network_data.lines).map(([id, value]: [string, any]) => ({
			id,
			type: 'line' as const,
			label: value.label
		}));

		return [...lines].sort((a, b) => a.label.localeCompare(b.label));
	});

	const network_data = $derived(data.network_data as Network);

	// Get calendar patterns with 'all' option
	let calendar_patterns = $derived.by(() => {
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

	const Handle_Search_Select = (item: Search_Item): void => Handle_Line_Select(item.id);

	const Handle_Line_Select = (line_id: string): void => {
		void goto(`/line-timetable/${encodeURIComponent(line_id)}`);
		line_selector_open = false;
	};

	const Handle_Calendar_Pattern_Change = (value: string): void => {
		options.selected_calendar_pattern = value;
	};

	const Handle_Stop_Pattern_Change = (value: string): void => {
		options.selected_stop_pattern = value;
	};
</script>

<svelte:head>
	<title>Line Timetable</title>
</svelte:head>

<div class="line-timetable-container">

	<header class="topbar">
		<div class="topbar-left">
			<Hamburger bind:active={panel_open}/>
		</div>

		<div class="topbar-center">
			<SearchBar items={search_items} placeholder={T('search_line')} On_Select={Handle_Search_Select}/>
		</div>

		<div class="topbar-right"></div>
	</header>
	

	<!-- Top Panel with Line Selector -->
	<Top_Panel open={line_selector_open}>
		<Line_Selector_Panel network_data={network_data} On_Line_Selected={Handle_Line_Select}/>
	</Top_Panel>

	<LeftPanel open={panel_open}>
	</LeftPanel>


	<!-- Pattern Switches -->
	<div class="patterns-container">
		<div class="pattern-switch-group">
			<label for="calendar-pattern-switch">{T("calendar_pattern")}: </label>
			<PatternSwitch choices={calendar_patterns} default_choice="all" On_Change={Handle_Calendar_Pattern_Change}/>
		</div>

		<div class="pattern-switch-group">
			<label for="stop-pattern-switch">{T("stop_pattern")}: </label>
			<PatternSwitch choices={stop_patterns} default_choice="all" On_Change={Handle_Stop_Pattern_Change}/>
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