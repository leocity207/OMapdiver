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
	.base-panel.right {
		right: -18.75em;
		transition: right 0.3s ease;
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

	.open.right {
		right: 0;
		height: 92vh;
	}

	.base-panel.right.open::before {
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
</style>