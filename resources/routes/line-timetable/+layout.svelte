<script lang="ts">
	import type { Network } from "$lib/types/network";
	import type { Color_Map } from "$lib/types/color_map";
	import type { Search_Item } from "$lib/types/search_items.ts";
	import { goto } from "$app/navigation";
	import { T } from "$lib/i18n";
	import { Get_Line_Timetable_Options } from "$lib/utils/options.svelte.js";
	import { Get_Global_Options } from "$lib/utils/options.svelte.js";
	import { Get_Line_Search_Items } from "$lib/utils/search_items";
	import { Get_Choices_For_Calendar_Patterns, Get_Choices_For_Stop_Patterns } from "$lib/utils/patterns_creator";
	import Top_Panel from "$lib/componants/top_panel.svelte";
	import Line_Selector_Panel from "$lib/line-timetable/line_selector_panel.svelte";
	import Extended_Switch_Dropdown from "$lib/componants/extended_switch_dropdown.svelte";
	import Top_Bar from "$lib/componants/top_bar.svelte";
	import Side_Panel from "$lib/componants/side_panel.svelte";
	import Switch from "$lib/componants/switch.svelte";

	let { data, children } = $props();

	let line_selector_open = $state(true);
	let panel_open = $state(false);
	let global_options = Get_Global_Options();
	let color_mode = $derived(global_options.easy_color_mode ? "easy" : "default") as Color_Map;
	let line_options = Get_Line_Timetable_Options();

	const search_items = $derived.by(() => Get_Line_Search_Items(data.network_data.lines));

	const network_data = $derived(data.network_data as Network);

	let calendar_patterns = $derived.by(() => Get_Choices_For_Calendar_Patterns(network_data.calendar_patterns));

	let stop_patterns = $derived.by(() => Get_Choices_For_Stop_Patterns(network_data.stop_patterns));


	const Handle_Search_Select = (item: Search_Item): Promise<void> => Handle_Line_Select(item.id);

	const Handle_Line_Select = (line_id: string): Promise<void> =>
		goto(`/line-timetable/${encodeURIComponent(line_id)}`);

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
	<Top_Bar
		bind:panel_open
		{search_items}
		search_placeholder={T("search_line")}
		on_search_select={Handle_Search_Select}
	/>

	<!-- Top Panel with Line Selector -->
	<Top_Panel open={line_selector_open}>
		<Line_Selector_Panel {network_data} On_Line_Selected={Handle_Line_Select} {color_mode} />
	</Top_Panel>

	<Side_Panel side="left" open={panel_open}>
		<div class="panel-header">
			<div>
				<div class="panel-title">{T("lines_timetable")}</div>
				<div class="panel-subtitle">{T("select_line_timetable")}</div>
			</div>
		</div>

		<div class="panel-options">
			<div class="options-title">{T("options")}:</div>
			<Switch label={T("easy_color_mode")} bind:checked={global_options.easy_color_mode} />
			<br />
			<Switch
				label={T("show_hidden_stations")}
				bind:checked={line_options.show_hidden_stations}
			/>
			<Switch label={T("first_last_mode")} bind:checked={line_options.first_last_mode} />
			<Switch
				label={T("show_arrival_times")}
				bind:checked={line_options.show_arrival_times}
			/>
		</div>
	</Side_Panel>

	<!-- Pattern Switches -->
	<div class="patterns-container">
		<div class="pattern-switch-group">
			<label for="calendar-pattern-switch">{T("calendar_pattern")}: </label>
			<Extended_Switch_Dropdown
				choices={calendar_patterns}
				default_choice="all"
				On_Change={Handle_Calendar_Pattern_Change}
			/>
		</div>

		<div class="pattern-switch-group">
			<label for="stop-pattern-switch">{T("stop_pattern")}: </label>
			<Extended_Switch_Dropdown
				choices={stop_patterns}
				default_choice="all"
				On_Change={Handle_Stop_Pattern_Change}
			/>
		</div>
	</div>

	<!-- Main Content Area -->
	<div class="content-area">
		{@render children()}
	</div>
</div>

<style>
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
