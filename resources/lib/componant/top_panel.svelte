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
	<aside class:open class="top-panel">
		<button type="button" class="toggle" on:click={toggle} aria-expanded={open}>
			{open ? '▲' : '▼'}
		</button>

		<div class="content" hidden={!open}>
			{@render children?.()}
		</div>
	</aside>
{/if}

<style>

</style>