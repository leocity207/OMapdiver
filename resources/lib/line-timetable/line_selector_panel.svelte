<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	interface Line {
		id: string;
		label: string;
		icon: string;
		color: {
			default: string;
			[key: string]: string;
		};
	}

	interface Network {
		lines: Record<string, Line>;
	}

	let {
		network_data = null
	} = $props<{
		network_data?: Network | null;
	}>();

	const dispatch = createEventDispatcher<{
		line_select: { line: string; network: Network };
	}>();

	// Store references to line icon containers
	let line_icons = $state<Record<string, HTMLElement>>({});

	function handle_line_click(line_id: string) {
		if (network_data) {
			dispatch('line_select', {
				line: line_id,
				network: network_data
			});
		}
	}

	function handle_keydown(event: KeyboardEvent, line_id: string) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handle_line_click(line_id);
		}
	}

	// Action to register container references
	function register_container(element: HTMLElement, line_id: string) {
		line_icons[line_id] = element;
		return {
			destroy() {
				delete line_icons[line_id];
			}
		};
	}

	// Update SVG colors when network_data or line colors change
	$effect(() => {
		if (!network_data) return;

		// Wait for DOM to be ready
		setTimeout(() => {
			for (const [line_id, line] of Object.entries(network_data.lines)) {
				const container = line_icons[line_id];
				if (!container) continue;

				// Find all rect elements in the SVG and update their fill
				const rects = container.querySelectorAll('rect');
				rects.forEach(rect => {
					if (line.color.default) {
						rect.setAttribute('fill', line.color.default);
					}
				});

				// Also update all paths (in case the SVG uses paths for the icon)
				const paths = container.querySelectorAll('path');
				paths.forEach(path => {
					// Don't override path fill if it's explicitly set in the SVG
					// Only update if it's white or empty
					const currentFill = path.getAttribute('fill');
					if (!currentFill || currentFill === 'white' || currentFill === '#fff') {
						path.setAttribute('fill', line.color.default);
					}
				});
			}
		}, 0);
	});
</script>

<div class="line-container">
	{#if network_data}
		{#each Object.entries(network_data.lines) as [line_id, line] (line_id)}
			<div
				class="line-icon"
				role="button"
				tabindex="0"
				on:click={() => handle_line_click(line_id)}
				on:keydown={(e) => handle_keydown(e, line_id)}
				use:register_container={line_id}
			>
				{@html line.icon}
			</div>
		{/each}
	{/if}
</div>

<style>
	.line-container {
		display: flex;
		flex-wrap: wrap;
		align-content: flex-start;
		gap: 8px;
		padding: 10px;
		overflow: auto;
		height: 100%;
		background-color: rgb(245, 245, 245);
	}

	.line-icon {
		width: 100px;
		flex: 0 0 auto;
		cursor: pointer;
		transition: transform 0.2s ease;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		max-height: 1.5em;
		border-radius: 4px;
	}

	.line-icon:hover {
		transform: scale(1.05);
	}

	.line-icon:focus {
		outline: 2px solid #333;
		outline-offset: 2px;
	}

	:global(.line-icon svg) {
		width: 100%;
		height: auto;
		display: block;
	}

	:global(.line-icon path) {
		fill: white;
	}
</style>
