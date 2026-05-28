<script lang="ts">
	import type { Global_Options } from '$lib/types/options';
	import { page } from '$app/state';
	import { Get_App_Config } from '$lib/config/config_loader';
	import { Set_Global_Options } from '$lib/utils/options.svelte.js';
	import { T } from '$lib/i18n';

	let { children } = $props();
	let global_options: Global_Options = $state({ easy_color_mode: false });
	Set_Global_Options(global_options);
	
	const Is_Active = (path: string) => page.url.pathname.startsWith(path);
</script>

<nav class="app-selector">
	{#if Get_App_Config().HAVE_NETWORK_MAP}
		<a href="/map"data-sveltekit-preload-data class:selected={Is_Active('/map')} aria-label={T('map')} title={T('map')}>
			<div class="icon">
				<img src="/icons/map.svg" alt="" />
			</div>
		</a>
	{/if}

	{#if Get_App_Config().HAVE_LINE_TIMETABLE}
		<a href="/line-timetable" data-sveltekit-preload-data class:selected={Is_Active('/line-timetable')} aria-label={T('timetable_lines')} title={T('timetable_lines')}>
			<div class="icon">
				<img src="/icons/line_timetable.svg" alt="" />
			</div>
		</a>
	{/if}

	{#if Get_App_Config().HAVE_STATION_SCHEDULES}
		<a href="/station-timetable" data-sveltekit-preload-data class:selected={Is_Active('/station-timetable')} aria-label={T('timetable_stations')} title={T('timetable_stations')}>
			<div class="icon">
				<img src="/icons/station_timetable.svg" alt="" />
			</div>
		</a>
	{/if}

	<div class="logo">
		<img src="/customization/image/logo.svg" alt="Logo" />
	</div>
</nav>

<div class="app-window">
	{@render children()}
</div>

<style>

	.app-window {
		height: 100%;
		width: 100%;
	}

	.app-selector {
		position: sticky;
		top: 0;
		z-index: 1000;
		display: flex;
		align-items: center;
		padding-left: 2vh;
		background-color: #f5f5f5;
	}

	.app-selector a {
		width: 2rem;
		height: 2rem;
		padding: 0.5rem;
		border-radius: 0 0 10px 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		text-decoration: none;
		background: transparent;
		transition: background-color 120ms ease;
	}
	.logo {
		margin-left: auto;
		padding-right: 2vh;
	}

	.logo> img {
		height: 2rem;
		width: auto;
	}

	.app-selector a:hover {
		background-color: #ededed;
	}

	.app-selector a.selected {
		background-color: #e0e0e0;
	}

	.icon {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.icon img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		opacity: 0.7;
	}
</style>