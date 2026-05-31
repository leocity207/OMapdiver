<script lang="ts">
	import type { Color_Map } from '$lib/types/color_map';
	import TimeTableServiceMissions from '$lib/line-timetable/timetable_service_missions.svelte';
    import { Get_Line_Timetable_Options } from '$lib/utils/options.svelte.js';
	import { Get_Global_Options } from '$lib/utils/options.svelte.js';
	let { data } = $props();

	let color_mode = $derived(Get_Global_Options().easy_color_mode ? 'easy' : 'default') as Color_Map;
</script>

<TimeTableServiceMissions line_data={data.line} network_data={data.network_data} options={Get_Line_Timetable_Options()} {color_mode} />