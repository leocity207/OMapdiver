<script lang="ts">
	import type { Snippet } from "svelte";

	type Side = "left" | "right";

	let {
		open = $bindable(),
		side = "left",
		children,
	} = $props<{
		open: boolean;
		side?: Side;
		children?: Snippet;
	}>();
</script>

<aside class:open class={side}>
	<div hidden={!open}>
		{@render children?.()}
	</div>
</aside>

<style>
	aside {
		--width: 18.75rem; /* override per-side below */
		--bg: #f5f5f5;
		--edge-offset: -18.75rem; /* must match --width, negated */

		height: calc(100vh - 6rem);
		width: var(--width);
		background-color: var(--bg);
		top: 6rem;
		position: fixed;
		z-index: 900;
		transition:
			left 0.3s ease,
			right 0.3s ease;
		display: flex;
		flex-direction: column;
	}

	/* ── Left ─────────────────────────────── */
	aside.left {
		--width: 18.75rem;
		--bg: #f5f5f5;
		left: -18.75rem;
		border-right: none;
	}
	aside.left.open {
		left: 0;
	}
	aside.left.open::after {
		content: "";
		position: absolute;
		top: 0;
		right: -6px;
		width: 6px;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.1);
		pointer-events: none;
		z-index: 1;
	}

	/* ── Right ────────────────────────────── */
	aside.right {
		--width: 24rem;
		--bg: white;
		right: -24rem;
		border-left: 1px solid #e5e5e5;
	}
	aside.right.open {
		right: 0;
	}
	aside.right.open::before {
		content: "";
		position: absolute;
		top: 0;
		left: -6px;
		width: 6px;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.1);
		pointer-events: none;
		z-index: 1;
	}

	aside > div {
		flex: 1 1 auto;
		overflow-y: auto;
	}

	@media (max-width: 900px) {
		aside.left {
			width: 100%;
			left: -100%;
		}
		aside.right {
			width: 100%;
			right: -100%;
		}
		aside.left.open {
			left: 0;
		}
		aside.right.open {
			right: 0;
		}
	}
</style>
