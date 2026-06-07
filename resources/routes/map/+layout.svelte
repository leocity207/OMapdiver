<script lang="ts">
	import type { Search_Item } from "$lib/componants/search_bar.svelte";
	import type { Station, Line } from "$lib/types/network";
	import type { Color_Map } from "$lib/types/color_map.ts";
	import { Get_Global_Options } from "$lib/utils/options.svelte.js";
	import { onMount } from "svelte";
	import { navigating, page } from "$app/state";
	import { goto } from "$app/navigation";
	import { T } from "$lib/i18n";
	import Network_Map from "$lib/map/network_map.svelte";
	import Search_Bar from "$lib/componants/search_bar.svelte";
	import Hamburger from "$lib/componants/hamburger.svelte";
	import Left_Panel from "$lib/componants/left_panel.svelte";
	import Right_Panel from "$lib/componants/right_panel.svelte";
	import Switch from "$lib/componants/switch.svelte";

	let { data, children } = $props();

	let panel_open = $state(false);
	let global_options = Get_Global_Options();
	let color_mode = $derived(global_options.easy_color_mode ? "easy" : "default") as Color_Map;
	let map: Network_Map | null = null;

	let is_viewing_element = $derived(page.url.pathname.match(/^\/map\/[^/]+$/) != null);

	const search_items = $derived.by<Search_Item[]>(() => {
		const stations = Object.entries<Station>(data.network_data.stations).map(
			([id, station]: [string, Station]) => ({
				id: station.id,
				label: station.label,
				type: "station" as const,
			})
		);

		const lines = Object.entries<Line>(data.network_data.lines).map(
			([id, line]: [string, Line]) => ({
				id: line.id,
				label: line.label,
				type: "line" as const,
			})
		);

		return [...stations, ...lines].sort((a, b) => a.label.localeCompare(b.label));
	});

	const Open_Element = (id: string): Promise<void> => goto(`/map/${id}`);
	const Handle_Map_Select = (id: string): Promise<void> => Open_Element(id);
	const Handle_Search_Select = (item: Search_Item): Promise<void> => {
		if (item.type === "station") map?.Highlight_Station_Lines(item.id);
		else if (item.type === "line") map?.Highlight_Line(item.id);
		return Open_Element(item.id);
	};

	$effect(() => {
		if (!is_viewing_element && map !== null) map.Clear_Highlighted_Lines();
	});

	onMount(() => {
		// Listen for line-click events from map
		const handle_line_click = (event: Event) => {
			const custom_event = event as CustomEvent<string>;
			Open_Element(custom_event.detail);
		};

		// Listen for station-click events from map
		const handle_station_click = (event: Event) => {
			const custom_event = event as CustomEvent<string>;
			Open_Element(custom_event.detail);
		};

		document.addEventListener("line-click", handle_line_click);
		document.addEventListener("station-click", handle_station_click);

		return () => {
			document.removeEventListener("line-click", handle_line_click);
			document.removeEventListener("station-click", handle_station_click);
		};
	});
</script>

<svelte:head>
	<title>Map</title>
</svelte:head>

<div class="shell">
	<header class="topbar">
		<div class="topbar-left">
			<Hamburger bind:active={panel_open} />
		</div>

		<div class="topbar-center">
			<Search_Bar
				items={search_items}
				placeholder={T("search_all")}
				On_Select={Handle_Search_Select}
			/>
		</div>

		<div class="topbar-right"></div>
	</header>

	<Left_Panel open={panel_open}>
		<div class="panel-header">
			<div>
				<div class="panel-title">{T("direct_routes")}</div>
				<div class="panel-subtitle">{T("select_station_or_line")}</div>
			</div>
		</div>

		<div class="panel-options">
			<div class="options-title">{T("options")}:</div>
			<Switch label={T("easy_color_mode")} bind:checked={global_options.easy_color_mode} />
		</div>
	</Left_Panel>

	<div class="workspace">
		<section class="map-pane">
			<Network_Map
				bind:this={map}
				network_data={data.network_data}
				On_Station_Click={Handle_Map_Select}
				On_Line_Click={Handle_Map_Select}
				easy_color_mode={color_mode}
			/>
		</section>

		<Right_Panel open={is_viewing_element}>
			{@render children()}
		</Right_Panel>
	</div>

	{#if navigating.to}
		<div class="route-loading">Loading…</div>
	{/if}
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
		border-bottom-style: solid;
		border-bottom-color: #9b9b9b;
		border-bottom-width: 1px;
	}

	.shell {
		height: 100dvh;
		min-height: 0;
		display: flex;
		flex-direction: column;
		background: #fafafa;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
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

	.workspace {
		position: absolute;
		flex: 1 1 auto;
		min-height: 0;
		display: grid;
		grid-template-columns: minmax(0, 1fr);
	}

	.map-pane {
		min-width: 0;
		min-height: 0;
	}

	.route-loading {
		position: fixed;
		right: 1rem;
		top: 4.5rem;
		z-index: 50;
		padding: 0.5rem 0.8rem;
		border-radius: 0.75rem;
		background: white;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
		font-size: 0.9rem;
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

	.panel-subtitle {
		font-size: 0.9375em;
		margin-bottom: 1.125em;
		line-height: 1.7;
		color: #666;
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
</style>
