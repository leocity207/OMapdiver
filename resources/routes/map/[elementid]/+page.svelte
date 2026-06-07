<script lang="ts">
	import type { PageData } from './$types';
	import type { Color_Map } from '$lib/types/color_map'
	import { Get_Global_Options } from '$lib/utils/options.svelte';
	import LineInfo from '$lib/info_panel/line-info.svelte';
	import StationInfo from '$lib/info_panel/station-info.svelte';
	
	let { data } = $props<{ data: PageData }>();
	let map_options = Get_Global_Options();
	let color_mode = $derived(map_options.easy_color_mode ? 'easy' : 'default') as Color_Map;

</script>

<div class="element-details">
	{#if data.element.kind === 'line'}
		<LineInfo line_data={data.element.raw} network_data={data.network_data} {color_mode}/>
	{:else if data.element.kind === 'station'}
		<StationInfo station_data={data.element.raw} network_data={data.network_data} {color_mode}/>
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