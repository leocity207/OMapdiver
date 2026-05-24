<script lang="ts">
	import { onMount } from 'svelte';

	interface PatternScheme {
		id: string;
		label: string;
		is_exceptional: boolean;
		info?: any;
		icon?: any;
		level?: number;
		variant?: any[];
		color?: string;
	}

	let {
		choices = {},
		default_choice = null,
		onchange = null
	} = $props<{
		choices?: Record<string, PatternScheme>;
		default_choice?: string | null;
		onchange?: ((value: string) => void) | null;
	}>();

	// State
	let normal_choices = $state<Record<string, PatternScheme>>({});
	let special_choices = $state<Record<string, switchPatternScheme>>({});
	let current_state = $state<string>('');
	let dropdown_open = $state(false);
	let left_buttons = $state<Record<string, HTMLButtonElement>>({});
	let special_menu: HTMLElement | null = null;
	let special_toggle: HTMLButtonElement | null = null;
	let indicator: HTMLElement | null = null;
	let container: HTMLElement | null = null;
	let track: HTMLElement | null = null;

	// Derived
	let all_states = $derived.by(() => {
		return Object.values(normal_choices)
			.concat(Object.values(special_choices))
			.map(v => v.id);
	});

	// Initialize on mount and when choices change
	$effect(() => {
		const [special, normal] = Object.entries(choices).reduce(
			([accTrue, accFalse], [key, value]) => {
				if (value.is_exceptional) {
					accTrue[key] = value;
				} else {
					accFalse[key] = value;
				}
				return [accTrue, accFalse];
			},
			[
				{} as Record<string, PatternScheme>,
				{} as Record<string, PatternScheme>
			]
		);

		normal_choices = normal;
		special_choices = special;

		if (default_choice && normal[default_choice]) {
			current_state = normal[default_choice].id;
		} else {
			const states = all_states;
			current_state = states.length > 0 ? states[0] : '';
		}
	});

	// Event handlers
	function handle_normal_click(event: MouseEvent) {
		event.stopPropagation();
		const target = event.currentTarget as HTMLElement;
		if (!target?.dataset.value) return;

		const value = target.dataset.value;
		current_state = value;
		dropdown_open = false;
		onchange?.(value);
	}

	function handle_special_toggle(event: MouseEvent) {
		event.stopPropagation();
		if (Object.keys(special_choices).length === 0) return;
		dropdown_open = !dropdown_open;
	}

	function handle_special_choice_click(event: MouseEvent) {
		event.stopPropagation();
		const target = event.currentTarget as HTMLElement;
		if (!target?.dataset.value) return;

		const value = target.dataset.value;
		current_state = value;
		dropdown_open = false;
		onchange?.(value);
	}

	function handle_outside_click(event: MouseEvent) {
		const path = event.composedPath();
		if (!path.includes(container)) {
			dropdown_open = false;
		}
	}

	function update_indicator() {
		if (!indicator) return;

		let selected_button: HTMLElement | null = null;

		// Find in normal buttons - search through object values
		for (const value_id in left_buttons) {
			if (value_id === current_state) {
				selected_button = left_buttons[value_id];
				break;
			}
		}

		// Find in special toggle
		if (!selected_button && special_toggle) {
			const is_special = Object.values(special_choices).some(c => c.id === current_state);
			if (is_special) {
				selected_button = special_toggle;
			}
		}

		if (!selected_button) {
			indicator.style.opacity = '0';
			return;
		}

		indicator.style.opacity = '1';

		if (!track) return;

		const track_rect = track.getBoundingClientRect();
		const button_rect = selected_button.getBoundingClientRect();

		const left = button_rect.left - track_rect.left;
		const top = button_rect.top - track_rect.top;
		const width = button_rect.width;
		const height = button_rect.height;

		indicator.style.width = `${width}px`;
		indicator.style.height = `${height}px`;
		indicator.style.transform = `translate3d(${left}px, ${top}px, 0)`;
	}

	// Update indicator on state/button changes
	$effect(() => {
		current_state; // dependency
		update_indicator();
	});

	onMount(() => {
		document.addEventListener('click', handle_outside_click);
		window.addEventListener('resize', update_indicator);

		return () => {
			document.removeEventListener('click', handle_outside_click);
			window.removeEventListener('resize', update_indicator);
		};
	});

	// Get ordered normal entries
	let ordered_entries = $derived.by(() => {
		const entries = Object.entries(normal_choices);
		if (default_choice && normal_choices[default_choice]) {
			return [
				[default_choice, normal_choices[default_choice]],
				...entries.filter(([key]) => key !== default_choice)
			];
		}
		return entries;
	});

	// Get selected special choice label
	let selected_special_label = $derived.by(() => {
		const selected = Object.values(special_choices).find(c => c.id === current_state);
		return selected ? selected.label : 'More';
	});

	let is_special_selected = $derived(
		Object.values(special_choices).some(c => c.id === current_state)
	);

	// Action to register button references
	function register_button(element: HTMLElement, button_id: string) {
		left_buttons[button_id] = element as HTMLButtonElement;
		return {
			destroy() {
				delete left_buttons[button_id];
			}
		};
	}

</script>

<div class="switch-container" bind:this={container}>
	<div class="switch-track" bind:this={track}>
		<span class="switch-indicator" bind:this={indicator}></span>

		<div class="switch-left-group">
			{#each ordered_entries as [key, value] (key)}
				<button
					type="button"
					class="switch-option switch-normal-option"
					class:is-selected={value.id === current_state}
					data-value={value.id}
					aria-pressed={value.id === current_state}
					use:register_button={value.id}
					on:click={handle_normal_click}
				>
					{value.label}
				</button>
			{/each}
		</div>

		{#if Object.keys(special_choices).length > 0}
			<div class="switch-special-group">
				<div class="switch-special-wrapper">
					<button
						type="button"
						class="switch-option switch-special-toggle"
						class:is-selected={is_special_selected}
						aria-expanded={dropdown_open}
						aria-pressed={is_special_selected}
						bind:this={special_toggle}
						on:click={handle_special_toggle}
					>
						<span class="switch-special-label">{selected_special_label}</span>
						<span class="switch-chevron">▾</span>
					</button>

					<div class="switch-special-menu" class:open={dropdown_open} bind:this={special_menu}>
						{#each Object.entries(special_choices) as [key, value] (key)}
							<button
								type="button"
								class="switch-special-item"
								class:is-selected={value.id === current_state}
								data-value={value.id}
								aria-pressed={value.id === current_state}
								on:click={handle_special_choice_click}
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
		transition: color 0.22s ease, transform 0.22s ease;
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
		transition: transform 0.25s ease, width 0.25s ease, height 0.25s ease, opacity 0.2s ease;
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
		transition: opacity 0.2s ease, transform 0.2s ease;
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