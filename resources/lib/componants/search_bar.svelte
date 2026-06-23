<script lang="ts">
	import { create_search_state } from "$lib/utils/search_logic.svelte";
	import SearchResults from "$lib/componants/search_results.svelte";
	import type { Search_Item } from "$lib/types/search_items";
	import { T } from "$lib/i18n"

	let {
		current_text = $bindable(""),
		placeholder,
		items,
		On_Select,
	} = $props<{
		current_text?: string;
		placeholder: string;
		items: Search_Item[];
		On_Select: (item: Search_Item) => void;
	}>();

	const search = create_search_state(() => items);

	function on_select(item: Search_Item) {
		current_text = item.label;
		search.handle_select(item, On_Select);
	}
</script>

<div class="search-bar-wrapper">
	<input
		class="search-input"
		bind:value={search.search_text}
		{placeholder}
		onfocus={search.handle_focus}
		onblur={search.handle_blur}
		oninput={search.handle_input}
		onkeydown={(e) => search.handle_key_down(e, on_select)}
		autocomplete="off"
	/>
	{#if search.focused && search.filtered.length > 0}
		<div class="autocomplete-items">
			<SearchResults
				items={search.filtered}
				current_focus={search.current_focus}
				search_text={search.search_text}
				on_select={on_select}
				on_keydown={(e) => search.handle_key_down(e, on_select)}
				empty_label={T("no_results")}
			/>
		</div>
	{/if}
</div>

<style>
	.search-bar-wrapper {
		position: relative;
		flex: 0 0 auto;
	}
	.search-input {
		width: 10rem;
		height: 2rem;
		padding: 0 0.9rem;
		border: 2px solid #d7d7d7;
		border-radius: 0.4em;
		background: white;
		font: inherit;
		outline: none;
		font-size: 1rem;

		&:focus {
			border-color: #b3b3b3;
		}
	}
	.autocomplete-items {
		position: absolute;
		border: 1px solid #ccc;
		border-top: none;
		z-index: 99;
		background-color: white;
		max-height: 200px;
		overflow-y: auto;
		width: calc(10rem + 5px);
	}
	@media (max-width: 900px) {
		.search-input { width: 8rem; }
		.autocomplete-items { width: calc(8rem + 5px); }
	}
</style>