<script lang="ts">

	import type { Snippet } from 'svelte';

	let {
		open = $bindable(),
		children
	} = $props<{
		open: boolean;
		children?: Snippet;
	}>();

</script>

<aside class:open >
	<div hidden={!open}>
		{@render children?.()}
	</div>
</aside>

<style>
	aside {
		height: calc(100vh - 6rem);
		width: 24rem;
		background-color: white;
		top: 6rem;
		position: fixed;
		z-index: 900;
		right: -24rem;
		transition: right 0.3s ease;
		display: flex;
		flex-direction: column;
		border-left: 1px solid #e5e5e5;
	}

	aside.open {
		right: 0;
	}

	aside.open::before {
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
		aside {
			width: 100%;
			right: -100%;
		}

		aside.open {
			right: 0;
		}
	}
</style>