<script lang="ts">
	let {
		open = $bindable(false),
		title = '',
		subtitle = '',
		enabled = true,
		children
	} = $props<{
		open?: boolean;
		title?: string;
		subtitle?: string;
		enabled?: boolean;
		children?: any;
	}>();

	function toggle() {
		open = !open;
	}
</script>

{#if enabled}
	<aside class:open class="left-panel">
		<header class="header">
			<div>
				{#if title}<div class="title">{title}</div>{/if}
				{#if subtitle}<div class="subtitle">{subtitle}</div>{/if}
			</div>

			<button type="button" class="toggle" on:click={toggle} aria-expanded={open}>
				{open ? '×' : '☰'}
			</button>
		</header>

		<div class="content" hidden={!open}>
			{@render children?.()}
		</div>
	</aside>
{/if}

<style>
	.left-panel {
		position: fixed;
		left: 0;
		top: 0;
		height: 100vh;
		width: 18.75rem;
		background: white;
		box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
		transition: transform 0.3s ease;
		transform: translateX(-100%);
		z-index: 100;
		display: flex;
		flex-direction: column;
	}

	.left-panel.open {
		transform: translateX(0);
	}

	.header {
		flex: 0 0 auto;
		padding: 1.5rem;
		border-bottom: 1px solid #e5e5e5;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
	}

	.title {
		font-size: 1.5rem;
		font-weight: 600;
		margin: 0 0 0.5rem 0;
	}

	.subtitle {
		font-size: 0.9rem;
		color: #666;
		margin: 0;
	}

	.toggle {
		flex: 0 0 auto;
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

	.toggle:hover {
		background: #f0f0f0;
	}

	.content {
		flex: 1 1 auto;
		overflow-y: auto;
		padding: 1rem;
	}

	@media (max-width: 900px) {
		.left-panel {
			width: 100%;
		}
	}
</style>