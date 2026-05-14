<script lang="ts">
	let {
		value = $bindable(''),
		placeholder = 'Search...',
		items = [],
		onSelect = (item: {label: string}) => {}
	} = $props<{
		value?: string;
		placeholder?: string;
		items?: {label: string}[];
		onSelect?: (item: {label: string}) => void;
	}>();

	let focused = $state(false);
	let current_focus = $state(-1);
	let inputEl: HTMLInputElement;

	let filtered_items = $derived.by(() => {
		if (!value.trim()) return [];
		const query = value.toLowerCase();
		return items.filter((item: {label: string}) => item.label.toLowerCase().includes(query));
	});

	function Handle_Select(item: {label: string}) {
		value = item.label;
		onSelect(item);
		focused = false;
		current_focus = -1;
	}

	function Handle_Key_Down(e: KeyboardEvent) {
		if (!focused || filtered_items.length === 0) {
			if (e.key === 'Enter') {
				e.preventDefault();
				focused = true;
			}
			return;
		}

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				current_focus = (current_focus + 1) % filtered_items.length;
				break;

			case 'ArrowUp':
				e.preventDefault();
				current_focus = (current_focus - 1 + filtered_items.length) % filtered_items.length;
				break;

			case 'Enter':
				e.preventDefault();
				if (current_focus >= 0 && current_focus < filtered_items.length) {
					Handle_Select(filtered_items[current_focus]);
				}
				break;

			case 'Escape':
				e.preventDefault();
				focused = false;
				current_focus = -1;
				break;

			case 'Tab':
				focused = false;
				current_focus = -1;
				break;
		}
	}

	function Handle_Input() {
		focused = true;
		current_focus = -1;
	}

	function Handle_Focus() {
		focused = true;
	}

	function Handle_Blur() {
		// Small delay to allow click on autocomplete item
		setTimeout(() => {
			focused = false;
			current_focus = -1;
		}, 100);
	}
</script>

<div class="search-bar-wrapper">
	<input
		bind:this={inputEl}
		class="search-input"
		bind:value
		{placeholder}
		onfocus={Handle_Focus}
		onblur={Handle_Blur}
		oninput={Handle_Input}
		onkeydown={Handle_Key_Down}
		autocomplete="off"
		spellcheck="false"
	/>

	{#if focused && filtered_items.length > 0}
		<div class="autocomplete-items">
			{#each filtered_items as item, index}
				<div
					class="autocomplete-item"
					class:autocomplete-active={index === current_focus}
					onclick={() => Handle_Select(item)}
					onkeydown={Handle_Key_Down}
					role="option"
					aria-selected={index === current_focus}
				>
					<strong>{item.label.substring(0, value.length)}</strong>{item.label.substring(value.length)}
				</div>
			{/each}
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
	}

	.search-input:focus {
		border-color: #b3b3b3;
		outline: none;
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

	.autocomplete-item {
		padding: 5px;
		cursor: pointer;
		border-bottom-width: 0.5px;
		border-bottom-style: solid;
		border-bottom-color: #aaaaaa;
	}

	.autocomplete-item:hover,
	.autocomplete-active {
		background-color: #e9e9e9;
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
