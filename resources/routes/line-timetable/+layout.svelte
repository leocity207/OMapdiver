<script lang="ts">
	import type { Search_Item } from '$lib/componants/search_bar.svelte';
	import type { Network } from '$lib/types/network';
	import { goto } from '$app/navigation';
	import { T, type Translation_Key } from '$lib/i18n';
	import { Get_Line_Timetable_Options } from '$lib/utils/options.svelte.js';
	import { Get_Global_Options } from '$lib/utils/options.svelte.js';
	import Top_Panel from '$lib/componants/top_panel.svelte';
	import Line_Selector_Panel from '$lib/line-timetable/line_selector_panel.svelte';
	import Pattern_Switch from '$lib/componants/pattern_switch.svelte';
	import SearchBar from '$lib/componants/search_bar.svelte';
	import Hamburger from '$lib/componants/hamburger.svelte';
	import LeftPanel from '$lib/componants/left_panel.svelte';
	import Switch from '$lib/componants/switch.svelte';

	let { data, children } = $props();

	let line_selector_open = $state(true);
	let panel_open = $state(false);
	let global_options = Get_Global_Options();
	let color_mode = $derived(global_options.easy_color_mode ? 'easy' : 'default') as Color_Map;
	let line_options = Get_Line_Timetable_Options();

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
		return [
			{
				id: 'all',
				label: T('all'),
				is_exceptional: false,
				info: null,
				icon: null
			},
			...Object.values(network_data.calendar_patterns).map(pattern => ({
				...pattern,
				label: T(pattern.label as Translation_Key)
			}))
		];
	});

	// Get stop patterns with 'all' option
	let stop_patterns = $derived.by(() => {
		return [
			{
				id: 'all',
				label: T('all'),
				is_exceptional: false,
				level: 0,
				variant: [],
				color: '',
				icon: ''
			},
			...Object.values(network_data.stop_patterns).map(pattern => ({
				...pattern,
				label: T(pattern.label as Translation_Key)
			}))
		];
	});

	const Handle_Search_Select = (item: Search_Item): void => Handle_Line_Select(item.id);

	const Handle_Line_Select = (line_id: string): void => {
		void goto(`/line-timetable/${encodeURIComponent(line_id)}`);
		line_selector_open = false;
	};

	const Handle_Calendar_Pattern_Change = (value: string): void => {
		line_options.selected_calendar_pattern = value;
	};

	const Handle_Stop_Pattern_Change = (value: string): void => {
		line_options.selected_stop_pattern = value;
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
		<Line_Selector_Panel network_data={network_data} On_Line_Selected={Handle_Line_Select} {color_mode}/>
	</Top_Panel>

	<LeftPanel open={panel_open}>
		<div class="panel-header">
			<div>
				<div class="panel-title">{T('timetable_lines')}</div>
				<div class="panel-subtitle">{T('select_line_timetable')}</div>
			</div>
		</div>

		<div class="panel-options">
			<div class="options-title">{T('options')}:</div>
			<Switch label={T('easy_color_mode')} bind:checked={global_options.easy_color_mode} />
			<br/>
			<Switch label={T('force_show_all_stations')} bind:checked={line_options.force_show_all_stations} />
			<Switch label={T('first_last_departure_mode')} bind:checked={line_options.first_last_departure_mode} />
			<Switch label={T('show_arrival_times')} bind:checked={line_options.show_arrival_times} />
		</div>
	</LeftPanel>


	<!-- Pattern Switches -->
	<div class="patterns-container">
		<div class="pattern-switch-group">
			<label for="calendar-pattern-switch">{T("calendar_pattern")}: </label>
			<Pattern_Switch choices={calendar_patterns} default_choice="all" On_Change={Handle_Calendar_Pattern_Change}/>
		</div>

		<div class="pattern-switch-group">
			<label for="stop-pattern-switch">{T("stop_pattern")}: </label>
			<Pattern_Switch choices={stop_patterns} default_choice="all" On_Change={Handle_Stop_Pattern_Change}/>
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

	.panel-options {
		padding: 1rem;
		margin-left: 1rem;
	}

	.options-title {
		font-size: 0.9375em;
		margin-bottom: 1.125em;
		line-height: 1.7;
		font-weight: 600;
	}

	.panel-header {
		padding: 1.5rem;
		border-bottom: 1px solid #e5e5e5;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
	}

	.panel-title {
		font-size: 1.2em;
		margin-bottom: 0.625em;
		line-height: 1.4;
		font-weight: bold;
	}

</style>