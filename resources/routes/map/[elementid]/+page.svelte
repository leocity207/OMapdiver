<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import LineInfo from '$lib/info_panel/line-info.svelte';
	import StationInfo from '$lib/info_panel/station-info.svelte';
	import Round_Cross from '$lib/componants/round-cross.svelte';

	let { data } = $props<{ data: PageData }>();
</script>

	<header class="header">
		<Round_Cross size={20} color="#333" hoverColor="#000" onclick={() => goto('../')} />
	</header>
	

<div class="element-details">


	{#if data.element.kind === 'line'}
		<LineInfo line_data={data.element.raw} network_data={data.network_data} />
	{:else if data.element.kind === 'station'}
		<StationInfo station_data={data.element.raw} network_data={data.network_data} />
	{/if}
</div>

<style>
	.element-details {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	
	.header {
		flex: 0 0 auto;
		padding: 1.5rem;
		border-bottom: 1px solid #e5e5e5;
		display: flex;
		justify-content: flex-end;
	}

	.element-details :global(> *) {
		height: 100%;
		overflow-y: auto;
	}
</style>