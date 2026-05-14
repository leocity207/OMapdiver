<script lang="ts">
	import { navigating, page } from '$app/state';
	import { goto } from '$app/navigation';
	import Network_Map from '$lib/map/network_map.svelte';

	let { data, children } = $props();

	let search_query = $state('');

	const search_items = $derived.by<SearchItem[]>(() => {
		const stations = Object.entries(data.networkData.stations).map(([id, value]: [string, any]) => ({
			id,
			kind: 'station' as const,
			label: value.label ?? value.name ?? id
		}));

		const lines = Object.entries(data.networkData.lines).map(([id, value]: [string, any]) => ({
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

	function Handle_Submit() {
		const match = find_match(search_query);
		if (match) Open_Element(match.id);
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
		<form class="search" on:submit|preventDefault={Handle_Submit}>
			<input
				bind:value={search_query}
				list="map-search-options"
				placeholder="Search a station or a line"
				autocomplete="off"
				spellcheck="false"
			/>
			<button type="submit">Search</button>
		</form>

		<datalist id="map-search-options">
			{#each search_items as item}
				<option value={item.label}></option>
			{/each}
		</datalist>
	</header>

	<div class="workspace">
		<section class="map-pane">
			<Network_Map
				networkData={data.networkData}
				selectedId={page.params.elementid ?? null}
				svgUrl="/image/map.svg"
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
	}

	.topbar {
		flex: 0 0 auto;
		position: sticky;
		top: 0;
		z-index: 20;
		padding: 0.75rem 1rem;
		background: #f5f5f5;
		border-bottom: 1px solid #e5e5e5;
		box-shadow: 0 1px 10px rgba(0, 0, 0, 0.04);
	}

	.search {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		max-width: 42rem;
	}

	.search input {
		flex: 1;
		min-width: 0;
		height: 2.75rem;
		padding: 0 0.9rem;
		border: 1px solid #d7d7d7;
		border-radius: 999px;
		background: white;
		font: inherit;
		outline: none;
	}

	.search input:focus {
		border-color: #b3b3b3;
		box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
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