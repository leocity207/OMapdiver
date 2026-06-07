<script lang="ts">
	import type { Snippet } from "svelte";

	let { open = $bindable(), children } = $props<{
		open: boolean;
		children: Snippet;
	}>();

	// eslint-disable-next-line @typescript-eslint/naming-convention
	const onclick = () => (open = !open);
</script>

<aside>
	<div class="content" hidden={!open}>
		{@render children?.()}
	</div>

	<button aria-expanded={open} title="toggle_top" {onclick}>
		<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" class:open>
			<g
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<polyline points="6 9 12 15 18 9" />
				<polyline points="6 5 12 11 18 5" />
			</g>
		</svg>
	</button>
</aside>

<style>
	aside {
		background: #f5f5f5;
		position: sticky;
		top: 0;
		z-index: 20;
		width: 100%;
		border-bottom: 1px solid var(--top-panel-border, rgba(0, 0, 0, 0.12));
		box-shadow: var(--top-panel-shadow, 0 2px 12px rgba(0, 0, 0, 0.06));
	}

	button {
		place-items: center;
		width: 100%;
		height: 2.25rem;
		padding: 0;
		border: 0;
		background: transparent;
		color: inherit;
		cursor: pointer;
		transition:
			background-color 0.15s ease,
			transform 0.15s ease,
			opacity 0.15s ease;
	}

	button:hover {
		background: rgba(0, 0, 0, 0.06);
	}

	button:focus-visible {
		outline: 2px solid currentColor;
		outline-offset: 2px;
	}

	button svg {
		width: 24px;
		height: 24px;
		transform-origin: 50% 50%;
		transition: transform 0.18s ease;
	}

	.open {
		transform: rotate(180deg);
	}
</style>
