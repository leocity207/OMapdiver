<script lang="ts">
	import Hamburger from "$lib/componants/hamburger.svelte";
	import SearchBar from "$lib/componants/search_bar.svelte";
	import type { Search_Item } from "$lib/componants/search_bar.svelte";

	let {
		panel_open = $bindable(false),
		search_items,
		search_placeholder,
		on_search_select,
	} = $props<{
		panel_open?: boolean;
		search_items: Search_Item[];
		search_placeholder: string;
		on_search_select: (item: Search_Item) => void;
	}>();
</script>

<header class="topbar">
	<div class="topbar-side">
		<Hamburger bind:active={panel_open} />
	</div>
	<div class="topbar-center">
		<SearchBar
			items={search_items}
			placeholder={search_placeholder}
			On_Select={on_search_select}
		/>
	</div>
	<div class="topbar-side"></div>
</header>

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
	.topbar-side {
		flex: 0 0 auto;
		display: flex;
		align-items: center;
		padding-left: 0.5em;
		min-width: 2.5em;
	}
	.topbar-center {
		flex: 1 0 auto;
		display: flex;
		justify-content: center;
	}
</style>
