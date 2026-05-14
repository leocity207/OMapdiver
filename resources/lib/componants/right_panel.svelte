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

	function close() {
		open = false;
	}
</script>

{#if enabled}
	<aside class:open class="right-panel">
		<header class="header">
			<button type="button" class="close" on:click={close} aria-label="Close panel">
				×
			</button>
		</header>

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
		position: fixed;
		z-index: 900;
		right: -24rem;
		top: 3.5rem;
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

	.header {
		flex: 0 0 auto;
		padding: 1.5rem;
		border-bottom: 1px solid #e5e5e5;
		display: flex;
		justify-content: flex-end;
	}

	.close {
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		color: #333;
		padding: 0;
		width: 2rem;
		height: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 0.5rem;
		transition: background 0.2s ease;
	}

	.close:hover {
		background: #f0f0f0;
	}

	.content {
		flex: 1 1 auto;
		overflow-y: auto;
		padding: 1.25rem;
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