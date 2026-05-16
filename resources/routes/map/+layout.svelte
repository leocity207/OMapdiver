<script lang="ts">
	import { onMount } from 'svelte';
	import { navigating, page } from '$app/state';
	import { goto } from '$app/navigation';
	import { T } from '$lib/i18n';
	import Network_Map from '$lib/map/network_map.svelte';
	import SearchBar from '$lib/componants/search_bar.svelte';
	import Hamburger from '$lib/componants/hamburger.svelte';
	import LeftPanel from '$lib/componants/left_panel.svelte';
	import RightPanel from '$lib/componants/right_panel.svelte';
	import Switch from '$lib/componants/switch.svelte';

	let { data, children } = $props();

	let search_query = $state('');
	let panel_open = $state(false);
	let simple_color = $state(false);

	const is_viewing_element = $derived(
		page.url.pathname.match(/^\/map\/[^/]+$/)
	);

	const search_items = $derived.by<SearchItem[]>(() => {
		const stations = Object.entries(data.network_data.stations).map(([id, value]: [string, any]) => ({
			id,
			kind: 'station' as const,
			label: value.label ?? value.name ?? id
		}));

		const lines = Object.entries(data.network_data.lines).map(([id, value]: [string, any]) => ({
			id,
			kind: 'line' as const,
			label: value.label ?? value.name ?? id
		}));

		return [...stations, ...lines].sort((a, b) => a.label.localeCompare(b.label));
	});

	function normalize(value: string) {
		return value.trim().toLowerCase();
	}

	function find_match(query: string) {
		const q = normalize(query);
		if (!q) return null;

		return (
			search_items.find((item) => normalize(item.label) === q) ??
			search_items.find((item) => normalize(item.label).startsWith(q)) ??
			search_items.find((item) => normalize(item.label).includes(q)) ??
			null
		);
	}

	function Open_Element(id: string) {
		void goto(`/map/${encodeURIComponent(id)}`);
		search_query = '';
	}

	function Handle_Search_Select(item: SearchItem) {
		Open_Element(item.id);
	}

	function Handle_Map_Select(event: CustomEvent<{ id: string; kind: MapElementKind }>) {
		Open_Element(event.detail.id);
	}

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

		document.addEventListener('line-click', handle_line_click);
		document.addEventListener('station-click', handle_station_click);

		return () => {
			document.removeEventListener('line-click', handle_line_click);
			document.removeEventListener('station-click', handle_station_click);
		};
	});
</script>

<svelte:head>
	<title>Map</title>
</svelte:head>

<div class="shell">

	<header class="topbar">
		<div class="topbar-left">
			<Hamburger active={panel_open} onToggle={() => (panel_open = !panel_open)} />
		</div>

		<div class="topbar-center">
			<SearchBar
				bind:value={search_query}
				items={search_items}
				placeholder="Search a station or a line"
				onSelect={Handle_Search_Select}
			/>
		</div>

		<div class="topbar-right"></div>
	</header>

	<LeftPanel bind:open={panel_open}>
		<div class="panel-header">
			<div>
				<div class="panel-title">{T('direct_routes')}</div>
				<div class="panel-subtitle">{T('select_station_or_line')}</div>
			</div>
		</div>

		<div class="panel-options">
			<div class="options-title">{T('options')}:</div>
			<Switch label={T('simple_color')} bind:checked={simple_color} />
		</div>
	</LeftPanel>

	<div class="workspace">
		<section class="map-pane">
			<Network_Map
				network_data={data.network_data}
				on:select={Handle_Map_Select}
			/>
		</section>

		<RightPanel open={is_viewing_element}>
			{@render children()}
		</RightPanel>
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
		position:absolute;
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