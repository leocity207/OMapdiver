<script lang="ts">
	import TimeTableServiceMissions from '$lib/line-timetable/timetable_service_missions.svelte';
    import { Get_Line_Timetable_Options } from '$lib/utils/options.svelte.js';
	let { data } = $props();
</script>

<TimeTableServiceMissions line_data={data.line} network_data={data.network_data} options={Get_Line_Timetable_Options()} />