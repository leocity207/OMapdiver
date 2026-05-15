<script lang="ts">
	import RoundCross from './round-cross.svelte';

	let {
		open = $bindable(false),
		enabled = true,
		children
	} = $props<{
		open?: boolean;
		enabled?: boolean;
		children?: any;
	}>();

	function close() {
		open = false;
	}
</script>

{#if enabled}
	<aside class:open class="right-panel">
		<div class="content" hidden={!open}>
			{@render children?.()}
		</div>
	</aside>
{/if}

<style>
	.right-panel {
		height: calc(100vh - 3.5rem);
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

	.right-panel.open {
		right: 0;
	}

	.right-panel.open::before {
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

	.panel-header {
		padding: 1rem;
		border-bottom: 1px solid #e5e5e5;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		flex-shrink: 0;
	}

	.content {
		flex: 1 1 auto;
		overflow-y: auto;
	}

	@media (max-width: 900px) {
		.right-panel {
			width: 100%;
			right: -100%;
		}

		.right-panel.open {
			right: 0;
		}
	}
</style>