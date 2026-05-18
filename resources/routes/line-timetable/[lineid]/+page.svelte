<script lang="ts">
	import TimeTableServiceMissions from '$lib/line-timetable/timetable_service_missions.svelte';

	let { data } = $props();
</script>

<TimeTableServiceMissions line_data={data.line} network_data={data.network_data} />
