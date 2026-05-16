<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import LineInfo from '$lib/info_panel/line-info.svelte';
	import StationInfo from '$lib/info_panel/station-info.svelte';
	import Round_Cross from '$lib/componants/round-cross.svelte';

	let { data, color_map = $bindable("default") } = $props<{ data: PageData, color_map: "default" | "easy" }>();
</script>

<div class="element-details">
	{#if data.element.kind === 'line'}
		<LineInfo line_data={data.element.raw} network_data={data.network_data} color_map={color_map}/>
	{:else if data.element.kind === 'station'}
		<StationInfo station_data={data.element.raw} network_data={data.network_data} color_map={color_map} />
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

	.element-details :global(> *) {
		height: 100%;
		overflow-y: auto;
	}
</style>