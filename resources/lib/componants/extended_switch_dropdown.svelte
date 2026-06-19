<script lang="ts">
	import { T } from "$lib/i18n";
	import type { Extended_Switch_Choice } from "$lib/types/switch.ts";

	let { choices, default_choice, On_Change } = $props<{
		choices: Extended_Switch_Choice[];
		default_choice: string;
		On_Change: ((value: string) => void) | null;
	}>();

	// State
	let normal_choices = $derived.by(() =>
		choices.filter((choice: Extended_Switch_Choice) => !choice.is_exceptional)
	);
	let special_choices = $derived.by(() =>
		choices.filter((choice: Extended_Switch_Choice) => choice.is_exceptional)
	);
	let current_state = $state<string>("");
	let dropdown_open = $state(false);
	let left_buttons = $state<Record<string, HTMLButtonElement>>({});
	let special_toggle = $state<HTMLButtonElement | null>(null);
	let indicator: HTMLElement;
	let container: HTMLElement;
	let track: HTMLElement;

	// Derived
	let all_states = $derived.by(() => choices.map((v: Extended_Switch_Choice) => v.id));

	$effect(() => {
		if (default_choice && all_states.includes(default_choice)) current_state = default_choice;
		else current_state = all_states[0] ?? "";
	});

	// Event handlers
	function On_Normal_Click(event: MouseEvent) {
		event.stopPropagation();
		const target = event.currentTarget as HTMLElement;
		const value = target.dataset.value!;

		current_state = value;
		dropdown_open = false;
		On_Change(value);
	}

	function Handle_Special_Toggle(event: MouseEvent) {
		event.stopPropagation();
		dropdown_open = !dropdown_open;
	}

	function Handle_Special_Choice_Click(event: MouseEvent) {
		event.stopPropagation();
		const target = event.currentTarget as HTMLElement;
		const value = target.dataset.value!;

		current_state = value;
		dropdown_open = false;
		On_Change(value);
	}

	function Handle_Outside_Click(event: MouseEvent) {
		const path = event.composedPath();

		if (!path.includes(container)) dropdown_open = false;
	}

	// Update indicator on state/button changes
	$effect(() => {
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		current_state;
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		choices;

		let selected_button: HTMLElement | null = null;

		// Find in normal buttons - search through object values
		for (const value_id in left_buttons) {
			if (value_id === current_state) {
				selected_button = left_buttons[value_id];
				break;
			}
		}

		// Find in special toggle
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
		const button_rect = selected_button?.getBoundingClientRect();

		const left = button_rect.left - track_rect.left;
		const top = button_rect.top - track_rect.top;
		const width = button_rect.width;
		const height = button_rect.height;
		indicator.style.width = `${width}px`;
		indicator.style.height = `${height}px`;
		indicator.style.transform = `translate3d(${left}px, ${top}px, 0)`;
	});

	// Get ordered normal entries
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

	// Get selected special choice label
	let selected_special_label = $derived.by(() => {
		const selected = special_choices.find(
			(c: Extended_Switch_Choice) => c.id === current_state
		);
		return selected ? selected.label : T("more");
	});

	let is_special_selected = $derived.by(() =>
		special_choices.some((c: Extended_Switch_Choice) => c.id === current_state)
	);

	// Action to register button references
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

		<div class="switch-left-group">
			{#each ordered_entries as value (value.id)}
				<button
					type="button"
					class="switch-option switch-normal-option"
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

		{#if special_choices.length > 0}
			<div class="switch-special-group">
				<div class="switch-special-wrapper">
					<button
						type="button"
						class="switch-option switch-special-toggle"
						class:is-selected={is_special_selected}
						aria-expanded={dropdown_open}
						aria-pressed={is_special_selected}
						bind:this={special_toggle}
						onclick={Handle_Special_Toggle}
					>
						<span class="switch-special-label">{selected_special_label}</span>
						<span class="switch-chevron">▾</span>
					</button>

					<div class="switch-special-menu" class:open={dropdown_open}>
						{#each special_choices as value (value.id)}
							<button
								type="button"
								class="switch-special-item"
								class:is-selected={value.id === current_state}
								data-value={value.id}
								aria-pressed={value.id === current_state}
								onclick={Handle_Special_Choice_Click}
							>
								{value.label}
							</button>
						{/each}
					</div>
				</div>
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
		transition:
			color 0.22s ease,
			transform 0.22s ease;
		white-space: nowrap;

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

	.switch-special-wrapper {
		position: relative;
		display: inline-flex;
	}

	.switch-special-toggle {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
	}

	.switch-chevron {
		font-size: 0.8em;
		line-height: 1;
	}

	.switch-special-menu {
		position: absolute;
		top: calc(100% + 0.35rem);
		right: 0;
		min-width: 100%;
		padding: 0.35rem;
		border-radius: 1rem;
		background: #fff;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.16);
		opacity: 0;
		transform: translateY(-6px);
		pointer-events: none;
		transition:
			opacity 0.2s ease,
			transform 0.2s ease;
		z-index: 20;

		&.open {
			opacity: 1;
			transform: translateY(0);
			pointer-events: auto;
		}
	}

	.switch-special-item {
		display: block;
		width: 100%;
		border: 0;
		background: transparent;
		text-align: left;
		padding: 0.55rem 0.8rem;
		border-radius: 0.8rem;
		cursor: pointer;
		transition: background 0.18s ease;
		white-space: nowrap;

		&:hover,
		&.is-selected {
			background: #f2f3f7;
		}
	}
</style>
