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
	.base-panel.left {
		left: -18.75em;
		transition: left 0.3s ease;
	}


	.title {
		font-size: 1.75em;
		margin-bottom: 0.625em;
		line-height: 1.4;
	}

	.text {
		font-size: 0.9375em;
		margin-bottom: 1.125em;
		line-height: 1.7;
	}

	switch-event {
		display: block;
		margin-left: 2rem !important;
	}

	.open.left {
		left: 0;
	}

	.base-panel.left.open::after {
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
</style>