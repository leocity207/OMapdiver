<script lang="ts">
    import { navigating, page } from '$app/state';
	import {Get_App_Config} from "$lib/config/config_loader";
	let { children } = $props();

	const Is_Active = (path: string) => page.url.pathname === path;
</script>

<nav>
	{#if Get_App_Config().HAVE_NETWORK_MAP}
		<a href="/map" class:active={Is_Active('/map')} aria-current={Is_Active('/map') ? 'page' : undefined}>
			Map
		</a>
	{/if}

	{#if Get_App_Config().HAVE_LINE_TIMETABLE}
		<a href="/line-timetable" class:active={Is_Active('/line-timetable')} aria-current={Is_Active('/line-timetable') ? 'page' : undefined}>
			Lines
		</a>
	{/if}

	{#if Get_App_Config().HAVE_STATION_SCHEDULES}
		<a href="/station-timetable" class:active={Is_Active('/station-timetable')} aria-current={Is_Active('/station-timetable') ? 'page' : undefined}>
			Stations
		</a>
	{/if}
</nav>


{#if navigating.to}
	<div class="loader">Loading…</div>
{/if}

{@render children()}
