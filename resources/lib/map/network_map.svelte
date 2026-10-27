<script lang="ts">
	import "leaflet/dist/leaflet.css";
	import { onMount } from "svelte";
	import Network_Map from "./network_map";
	import { Get_Map_Config, Get_Network_Config } from "$lib/config/config_loader";
	import type { Network } from "$lib/types/network";
	import type { Color_Map } from "$lib/types/color_map.ts";

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

	let map_element!: HTMLDivElement;
	let container_element!: HTMLDivElement;
	let map = $state<Network_Map | null>(null);
	let ready = $state(false);
	let load_error = $state<string | null>(null);

	// eslint-disable-next-line @typescript-eslint/naming-convention
	let Detach_Listeners = () => {};
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

	onMount(() => {
		// helper if map is destroyed before async initialization
		let destroyed = false;
		let map_instance: Network_Map | null = null;

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

		void (async () => {
			try {
				map_instance = new Network_Map(
					"Desktop",
					"/customization/image/map.svg",
					Get_Map_Config(),
					Get_Network_Config()
				);
				await map_instance.Setup("en", map_element);
				if (destroyed) {
					map_instance.Destroy();
					return;
				}

				map = map_instance;
				await map_instance.Setup_Mouse_Handlers_With_Data(
					network_data.lines,
					network_data.stations
				);
				if (destroyed) {
					map_instance.Destroy();
					return;
				}

				document.addEventListener("station-click", On_Map_Station_Click);
				document.addEventListener("line-click", On_Map_Line_Click);
				Detach_Listeners = () => {
					document.removeEventListener("station-click", On_Map_Station_Click);
					document.removeEventListener("line-click", On_Map_Line_Click);
				};

				ready = true;
				void map_instance.Initial_Zoom_Move().catch((error: unknown) => {
					if (!destroyed) {
						load_error = error instanceof Error ? error.message : String(error);
						console.error("Failed to animate the initial Leaflet map view.", error);
					}
				});
			} catch (error) {
				map_instance?.Destroy();
				map = null;
				ready = false;
				if (!destroyed) {
					load_error = error instanceof Error ? error.message : String(error);
					console.error("Failed to initialize the Leaflet network map.", error);
				}
			}
		})();

		return () => {
			destroyed = true;
			Detach_Listeners();
			resize_observer?.disconnect();
			resize_observer = null;
			map_instance?.Destroy();
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
	<div class="map-canvas" bind:this={map_element} aria-label="Interactive network map"></div>
	{#if load_error}
		<div class="map-error" role="alert">{load_error}</div>
	{/if}
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

	.map-canvas {
		display: block;
		width: 100%;
		height: 100%;
		background: #f7f7f7;
	}

	.map-error {
		position: absolute;
		inset: 1rem 1rem auto;
		z-index: 1000;
		padding: 0.75rem 1rem;
		color: #842029;
		background: #f8d7da;
		border: 1px solid #f5c2c7;
		border-radius: 0.375rem;
	}

	:global(.leaflet-map-selectable) {
		cursor: pointer;
	}
</style>
