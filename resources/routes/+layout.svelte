<script lang="ts">
	import { navigating, page } from '$app/state';
	import { Get_App_Config } from '$lib/config/config_loader';
	import { T } from '$lib/i18n';

	let { children } = $props();

	const Is_Active = (path: string) =>
		page.url.pathname.startsWith(path);
</script>

<nav class="app-selector">
	{#if Get_App_Config().HAVE_NETWORK_MAP}
		<a
			href="/map"
			data-sveltekit-preload-data
			class:selected={Is_Active('/map')}
			aria-label={T('map')}
			title={T('map')}
		>
			<div class="icon">
				<img src="/icons/map.svg" alt="" />
			</div>
		</a>
	{/if}

	{#if Get_App_Config().HAVE_LINE_TIMETABLE}
		<a
			href="/line-timetable"
			data-sveltekit-preload-data
			class:selected={Is_Active('/line-timetable')}
			aria-label={T('timetable_lines')}
			title={T('timetable_lines')}
		>
			<div class="icon">
				<img src="/icons/line_timetable.svg" alt="" />
			</div>
		</a>
	{/if}

	{#if Get_App_Config().HAVE_STATION_SCHEDULES}
		<a
			href="/station-timetable"
			data-sveltekit-preload-data
			class:selected={Is_Active('/station-timetable')}
			aria-label={T('timetable_stations')}
			title={T('timetable_stations')}
		>
			<div class="icon">
				<img src="/icons/station_timetable.svg" alt="" />
			</div>
		</a>
	{/if}
</nav>

{#if navigating.to}
	<div class="loader">{T('loading')}</div>
{/if}

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

	.loader {
		position: fixed;
		top: 5rem;
		right: 1rem;
		padding: 0.5rem 1rem;
		background: white;
		border-radius: 8px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
	}
</style>