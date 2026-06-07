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


<aside class:open>
	<div hidden={!open}>
		{@render children?.()}
	</div>
</aside>


<style>


	aside {
		height: 100%;
		width: 18.75rem;
		background-color: #f5f5f5;
		position: fixed;
		z-index: 900;
		left: -18.75rem;
		top: 6rem;
		transition: left 0.3s ease;
		display: flex;
		flex-direction: column;
	}

	aside.open {
		left: 0;
	}

	aside.open::after {
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

	aside > div {
		flex: 1 1 auto;
		overflow-y: auto;
	}

	@media (max-width: 900px) {
		aside {
			width: 100%;
			left: -100%;
		}

		aside.open {
			left: 0;
		}
	}
</style>