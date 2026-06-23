<script lang="ts">
	import { T } from "$lib/i18n";
	import type { Extended_Switch_Choice } from "$lib/types/switch.ts";
	import { create_search_state } from "$lib/utils/search_logic.svelte";
	import SearchResults from "$lib/componants/search_results.svelte";

	let { choices, default_choice, On_Change } = $props<{
		choices: Extended_Switch_Choice[];
		default_choice: string;
		On_Change: ((value: string) => void) | null;
	}>();

	// — Derived choices ————————————————————————————————
	let normal_choices = $derived.by(() =>
		choices.filter((c: Extended_Switch_Choice) => !c.is_exceptional)
	);
	let special_choices = $derived.by(() =>
		choices.filter((c: Extended_Switch_Choice) => c.is_exceptional)
	);
	let all_states = $derived.by(() => choices.map((v: Extended_Switch_Choice) => v.id));

	// — State ——————————————————————————————————————————
	let current_state = $state<string>("");
	let search_open = $state(false);
	let left_buttons = $state<Record<string, HTMLButtonElement>>({});
	let special_toggle = $state<HTMLButtonElement | null>(null);
	let search_input_el = $state<HTMLInputElement | null>(null);
	let indicator: HTMLElement;
	let container: HTMLElement;
	let track: HTMLElement;

	// — Search ——————————————————————————————————————————
	const search = create_search_state(() => special_choices);

	// — Init ———————————————————————————————————————————
	$effect(() => {
		if (default_choice && all_states.includes(default_choice))
			current_state = default_choice;
		else current_state = all_states[0] ?? "";
	});

	// — Ordered normal entries —————————————————————————
	let ordered_entries = $derived.by(() => {
		const default_entry = normal_choices.find(
			(c: Extended_Switch_Choice) => c.id === default_choice
		);
		if (!default_entry) return normal_choices;
		return [
			default_entry,
			...normal_choices.filter((c: Extended_Switch_Choice) => c.id !== default_choice),
		];
	});

	// — Special state labels ———————————————————————————
	let is_special_selected = $derived.by(() =>
		special_choices.some((c: Extended_Switch_Choice) => c.id === current_state)
	);

	let selected_special_label = $derived.by(() => {
		const selected = special_choices.find(
			(c: Extended_Switch_Choice) => c.id === current_state
		);
		return selected ? selected.label : T("others");
	});

	// — Indicator animation ————————————————————————————
	$effect(() => {
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		current_state;
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		choices;

		let selected_button: HTMLElement | null = null;

		for (const value_id in left_buttons) {
			if (value_id === current_state) {
				selected_button = left_buttons[value_id];
				break;
			}
		}

		if (
			!selected_button &&
			special_toggle &&
			special_choices.some((c: Extended_Switch_Choice) => c.id === current_state)
		) {
			selected_button = special_toggle;
		}

		if (!selected_button) {
			indicator.style.opacity = "0";
			return;
		}

		indicator.style.opacity = "1";
		const track_rect = track.getBoundingClientRect();
		const button_rect = selected_button.getBoundingClientRect();
		indicator.style.width = `${button_rect.width}px`;
		indicator.style.height = `${button_rect.height}px`;
		indicator.style.transform = `translate3d(${button_rect.left - track_rect.left}px, ${button_rect.top - track_rect.top}px, 0)`;
	});

	// — Focus input when search opens ——————————————————
	$effect(() => {
		if (search_open && search_input_el) {
			search_input_el.focus();
		}
	});

	// — Handlers ———————————————————————————————————————
	function On_Normal_Click(event: MouseEvent) {
		event.stopPropagation();
		const value = (event.currentTarget as HTMLElement).dataset.value!;
		current_state = value;
		search_open = false;
		search.reset();
		On_Change?.(value);
	}

	function Handle_Special_Toggle(event: MouseEvent) {
		event.stopPropagation();
		search_open = !search_open;
		if (!search_open) search.reset();
	}

	function Handle_Search_Select(choice: Extended_Switch_Choice) {
		current_state = choice.id;
		search_open = false;
		search.reset();
		On_Change?.(choice.id);
	}

	function Handle_Outside_Click(event: MouseEvent) {
		if (!event.composedPath().includes(container)) {
			search_open = false;
			search.reset();
		}
	}

	function Register_Button(element: HTMLElement, button_id: string) {
		left_buttons[button_id] = element as HTMLButtonElement;
		return {
			destroy() {
				delete left_buttons[button_id];
			},
		};
	}
</script>

<svelte:document onclick={Handle_Outside_Click} />

<div class="switch-container" bind:this={container}>
	<div class="switch-track" bind:this={track}>
		<span class="switch-indicator" bind:this={indicator}></span>

		<!-- Normal choices -->
		<div class="switch-left-group">
			{#each ordered_entries as value (value.id)}
				<button
					type="button"
					class="switch-option"
					class:is-selected={value.id === current_state}
					data-value={value.id}
					aria-pressed={value.id === current_state}
					use:Register_Button={value.id}
					onclick={On_Normal_Click}
				>
					{value.label}
				</button>
			{/each}
		</div>

		<!-- Special choices via inline search -->
		{#if special_choices.length > 0}
			<div class="switch-special-group">
				{#if search_open}
					<!-- Inline search input replacing the toggle button -->
					<div class="switch-search-inline">
						<input
							bind:this={search_input_el}
							class="switch-search-input"
							type="text"
							bind:value={search.search_text}
							placeholder={T("search")}
							onkeydown={(e) => search.handle_key_down(e, Handle_Search_Select)}
							autocomplete="off"
						/>
						<!-- Results dropdown below the track -->
						{#if search.filtered.length > 0 || search.search_text.trim()}
							<div class="switch-search-results">
								<SearchResults
									items={search.filtered}
									current_focus={search.current_focus}
									search_text={search.search_text}
									on_select={Handle_Search_Select}
									on_keydown={(e) => search.handle_key_down(e, Handle_Search_Select)}
									empty_label={T("no_results")}
								/>
							</div>
						{/if}
					</div>
				{:else}
					<!-- Toggle button showing current special label or placeholder -->
					<button
						type="button"
						class="switch-option switch-special-toggle"
						class:is-selected={is_special_selected}
						aria-pressed={is_special_selected}
						bind:this={special_toggle}
						onclick={Handle_Special_Toggle}
					>
						{selected_special_label}
					</button>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.switch-container {
		display: inline-flex;
		align-items: center;
	}

	.switch-track {
		position: relative;
		display: inline-flex;
		align-items: stretch;
		gap: 0.25rem;
		padding: 0.25rem;
		border-radius: 999px;
		background: #e8e8ee;
		box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.08);
		overflow: visible;
	}

	.switch-left-group,
	.switch-special-group {
		display: inline-flex;
		align-items: stretch;
		position: relative;
		z-index: 1;
	}

	.switch-option {
		position: relative;
		z-index: 2;
		border: 0;
		border-radius: 999px;
		padding: 0.55rem 0.95rem;
		background: transparent;
		cursor: pointer;
		transition: color 0.22s ease, transform 0.22s ease;
		white-space: nowrap;
		font: inherit;

		&:hover {
			transform: translateY(-1px);
		}

		&.is-selected {
			color: #111;
		}
	}

	.switch-indicator {
		position: absolute;
		left: 0;
		top: 0;
		border-radius: 999px;
		background: #fff;
		box-shadow: 0 4px 14px rgba(0, 0, 0, 0.14);
		transition:
			transform 0.25s ease,
			width 0.25s ease,
			height 0.25s ease,
			opacity 0.2s ease;
		pointer-events: none;
		opacity: 0;
		z-index: 0;
	}

	/* Inline search — sits inside the track pill */
	.switch-search-inline {
		position: relative;
		display: inline-flex;
		align-items: center;
		z-index: 2;
	}

	.switch-search-input {
		height: 100%;
		min-width: 8rem;
		padding: 0.45rem 0.95rem;
		border: 1.5px solid #d7d7d7;
		border-radius: 999px;
		background: #fff;
		font: inherit;
		font-size: 0.9rem;
		outline: none;
		box-sizing: border-box;
		transition: border-color 0.18s ease;

		&:focus {
			border-color: #b3b3b3;
		}
	}

	/* Results panel drops below the track */
	.switch-search-results {
		position: absolute;
		top: calc(100% + 0.35rem);
		right: 0;
		min-width: 12rem;
		max-height: 12rem;
		overflow-y: auto;
		padding: 0.35rem;
		border-radius: 1rem;
		background: #fff;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.16);
		z-index: 20;
	}

	.switch-special-toggle {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		color: #888;
	}
</style>