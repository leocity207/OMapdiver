<script lang="ts">
	import { navigating, page } from '$app/state';
	import { goto } from '$app/navigation';
	import Network_Map from '$lib/map/network_map.svelte';
	import SearchBar from '$lib/componants/search_bar.svelte';
	import Hamburger from '$lib/componants/hamburger.svelte';
	import LeftPanel from '$lib/componants/left_panel.svelte';

	let { data, children } = $props();

	let search_query = $state('');
	let panel_open = $state(false);

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

	<LeftPanel bind:open={panel_open} title="Menu">
		<nav class="menu">
			<ul>
				<li><a href="/">Home</a></li>
				<li><a href="/map">Map</a></li>
				{#if false}
					<li><a href="/line-timetable">Lines</a></li>
					<li><a href="/station-timetable">Stations</a></li>
				{/if}
			</ul>
		</nav>
	</LeftPanel>

	<div class="workspace">
		<section class="map-pane">
			<Network_Map
				network_data={data.network_data}
				on:select={Handle_Map_Select}
			/>
		</section>


		<aside class="panel" style="display: none;">
			{@render children()}
		</aside>
	</div>

	{#if navigating.to}
		<div class="route-loading">Loading…</div>
	{/if}
</div>

<style>
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
	}

	.topbar-center {
		flex: 1 0 auto;
		display: flex;
		justify-content: center;
	}

	.topbar-right {
		flex: 0 0 auto;
	}

	.menu {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.menu ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.menu li {
		margin: 0.5rem 0;
	}

	.menu a {
		display: block;
		padding: 0.75rem 1rem;
		color: #333;
		text-decoration: none;
		border-radius: 0.5rem;
		transition: background 0.2s ease;
	}

	.menu a:hover {
		background: #e5e5e5 0 3px rgba(0, 0, 0, 0.05);
	}

	.search button {
		height: 2.75rem;
		padding: 0 1rem;
		border: 0;
		border-radius: 999px;
		background: #222;
		color: white;
		font: inherit;
		cursor: pointer;
	}

	.workspace {
		flex: 1 1 auto;
		min-height: 0;
		display: grid;
		grid-template-columns: minmax(0, 1fr) 24rem;
	}

	.map-pane {
		min-width: 0;
		min-height: 0;
	}

	.panel {
		min-width: 0;
		min-height: 0;
		overflow: auto;
		background: white;
		border-left: 1px solid #e5e5e5;
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

	@media (max-width: 900px) {
		.workspace {
			grid-template-columns: 1fr;
			grid-template-rows: minmax(18rem, 1fr) auto;
		}

		.panel {
			border-left: 0;
			border-top: 1px solid #e5e5e5;
		}
	}
</style>