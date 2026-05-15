<script lang="ts">
	let {
		open = $bindable(false),
		enabled = true,
		children
	} = $props<{
		open?: boolean;
		enabled?: boolean;
		children?: any;
	}>();

	function toggle() {
		open = !open;
	}
</script>

{#if enabled}
	<aside class:open class="left-panel">
		<div class="content" hidden={!open}>
			{@render children?.()}
		</div>
	</aside>
{/if}

<style>


	.left-panel {
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

	.left-panel.open {
		left: 0;
	}

	.left-panel.open::after {
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

	.content {
		flex: 1 1 auto;
		overflow-y: auto;
	}

	@media (max-width: 900px) {
		.left-panel {
			width: 100%;
			left: -100%;
		}

		.left-panel.open {
			left: 0;
		}
	}
</style>