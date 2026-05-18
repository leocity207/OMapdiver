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

	function handle_line_click(line_id: string) {
		if (network_data) {
			dispatch('line_select', {
				line: line_id,
				network: network_data
			});
		}
	}

	function on_svg_load(event: Event, line_id: string) {
		const svg = event.target as SVGElement;
		const rect = svg.querySelector('rect');
		if (rect && network_data) {
			const line = network_data.lines[line_id];
			if (line && line.color.default) {
				rect.setAttribute('fill', line.color.default);
			}
		}
	}
</script>

<div class="line-container">
	{#if network_data}
		{#each Object.entries(network_data.lines) as [line_id, line] (line_id)}
			<div
				class="line-icon"
				on:click={() => handle_line_click(line_id)}
				role="button"
				tabindex="0"
				on:keydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						handle_line_click(line_id);
					}
				}}
			>
				<svg
					class="line-icon-svg"
					viewBox="0 0 100 100"
					xmlns="http://www.w3.org/2000/svg"
					on:load={(e) => on_svg_load(e, line_id)}
				>
					{@html line.icon}
				</svg>
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
		background-color: rgb(245, 245, 245);
		height: 100%;
	}

	.line-icon {
		width: 100px;
		flex: 0 0 auto;
		cursor: pointer;
		transition: transform 0.2s ease;
	}

	.line-icon:hover {
		transform: scale(1.05);
	}

	.line-icon:focus {
		outline: 2px solid #333;
		outline-offset: 2px;
		border-radius: 4px;
	}

	.line-icon-svg {
		width: 100%;
		height: 100%;
		display: block;
		max-height: 1.5em;
	}

	:global(.line-icon-svg path) {
		fill: white;
	}
</style>
