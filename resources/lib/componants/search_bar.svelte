<script lang="ts">
	import { Create_Search_State } from "$lib/utils/search_logic.svelte";
	import SearchResults from "$lib/componants/search_results.svelte";
	import type { Search_Item } from "$lib/types/search_items";
	import { T } from "$lib/i18n";

	let { placeholder, items, on_select } = $props<{
		placeholder: string;
		items: Search_Item[];
		on_select: (item: Search_Item) => void;
	}>();

	const search = Create_Search_State(() => items);
</script>

<div class="search-bar-wrapper">
	<input
		class="search-input"
		bind:value={search.search_text}
		{placeholder}
		onfocus={search.Handle_Focus}
		onblur={search.Handle_Blur}
		oninput={search.Handle_Input}
		onkeydown={(e) => search.Handle_Key_Down(e, on_select)}
		autocomplete="off"
	/>
	{#if search.focused && search.filtered.length > 0}
		<div class="autocomplete-items">
			<SearchResults
				items={search.filtered}
				current_focus={search.current_focus}
				search_text={search.search_text}
				{on_select}
				on_keydown={(e) =>
					search.Handle_Key_Down(e, (item: Search_Item) =>
						search.Handle_Select(item, on_select)
					)}
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
		.search-input {
			width: 8rem;
		}
		.autocomplete-items {
			width: calc(8rem + 5px);
		}
	}
</style>
