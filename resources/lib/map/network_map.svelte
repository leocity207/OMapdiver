<script lang="ts">
	import { onMount } from 'svelte';
	import Network_Map from './network_map';
	import { Get_Map_Config, Get_Network_Config } from '$lib/config/config_loader';
	import type { Network } from '$lib/types/network';
	import type { Color_Map } from '$lib/types/color_map.ts'

	type Props = {
		network_data: Network;
		easy_color_mode: Color_Map;
		On_Station_Click: (station_id: string) => void;
		On_Line_Click: (line_id: string) => void;
	};

	let {
		network_data,
		easy_color_mode = $bindable("default"),
		On_Station_Click,
		On_Line_Click,
	}: Props = $props();

	let canvas_element!: HTMLCanvasElement;
	let container_element!: HTMLDivElement;

	let map = $state<Network_Map | null>(null);
	let ready = $state(false);

	let detachListeners = () => {};
	let resize_observer: ResizeObserver | null = null;

	export function Highlight_Line(line_id: string): void {
		map?.Highlight_Lines([line_id]);
	}

	export function Highlight_Station_Lines(station_id: string): void {
		map?.Highlight_All_Lines_At_Station(station_id);
	}

	export function Clear_Highlighted_Lines(): void {
		map?.Reset_Line_Highlight();
	}

	onMount(() =>  {
		let destroyed = false;

		const On_Map_Station_Click = (event: Event) => {
			const id = (event as CustomEvent<string>).detail;
			Highlight_Station_Lines(id);
			On_Station_Click(id);
		};

		const On_Map_Line_Click = (event: Event) => {
			const id = (event as CustomEvent<string>).detail;
			Highlight_Line(id);
			On_Line_Click(id);
		};

		resize_observer = new ResizeObserver((entries) => {
			if (!map) return;

			const entry = entries[0];
			if (!entry) return;

			const { width, height } = entry.contentRect;
			map.Zoom_Check_Map_Resize(width, height);
		});

		resize_observer.observe(container_element);

		(async () => {
			const map_instance = new Network_Map(
				'Desktop',
				'/customization/image/map.svg',
				Get_Map_Config(),
				Get_Network_Config()
			);

			await map_instance.Setup("en", canvas_element);

			if (destroyed) return;

			map = map_instance;

			await map.Setup_Mouse_Handlers_With_Data(
				network_data.lines,
				network_data.stations
			);

			document.addEventListener('station-click', On_Map_Station_Click as EventListener);
			document.addEventListener('line-click', On_Map_Line_Click as EventListener);

			detachListeners = () => {
				document.removeEventListener('station-click', On_Map_Station_Click as EventListener);
				document.removeEventListener('line-click', On_Map_Line_Click as EventListener);
			};

			ready = true;

			map.Initial_Zoom_Move();
		})();

		return () => {
			destroyed = true;
			detachListeners();
			resize_observer?.disconnect();
			resize_observer = null;
			map = null;
			ready = false;
		};
	});

	$effect(() => {
		if (!ready) return;
		map?.Change_Color(easy_color_mode);
	});
</script>

<div class="viewer" bind:this={container_element}>
	<canvas bind:this={canvas_element}></canvas>
</div>

<style>
	.viewer {
		position: relative;
		width: 100%;
		height: 100%;
		min-height: 0;
		overflow: hidden;
		background: #f7f7f7;
	}

	canvas {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>