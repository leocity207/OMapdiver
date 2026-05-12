<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import Network_Map from '/network_map';
	import { Get_Map_Config, Get_Network_Config } from '$lib/config/config_loader';
	import type { Network } from '$lib/types/network-data';

	type Props = {
		network_data: Network;
		selected_id?: string | null;
	};

	let {
		network_data,
		selected_id = null,
	} = $props<Props>();

	const dispatch = createEventDispatcher<{
		select: { id: string; kind: MapElementKind };
	}>();

	let canvas_element!: HTMLCanvasElement;
	let container_element!: HTMLDivElement;

	let map = $state<any | null>(null);
	let ready = $state(false);

	let detachListeners = () => {};
	let resizeObserver: ResizeObserver | null = null;

	function Resolve_Kind(id: string): MapElementKind | null {
		if (network_data?.stations?.[id]) return 'station';
		if (network_data?.lines?.[id]) return 'line';
		return null;
	}

	function Apply_Selection() {
		if (!map) return;

		if (!selected_id) {
			map.Reset_Line_Highlight?.();
			map.Initial_Zoom_Move?.();
			return;
		}

		const kind = Resolve_Kind(selected_id);

		if (kind === 'station') {
			map.Highlight_All_Lines_At_Station?.(selected_id);
			map.Zoom_Highlighted_Stations?.(selected_id);
			return;
		}

		if (kind === 'line') {
			map.Highlight_Lines?.([selected_id]);
			map.Zoom_Highlighted_Line?.(selected_id);
			return;
		}

		map.Reset_Line_Highlight?.();
		map.Initial_Zoom_Move?.();
	}

	onMount(() => {
		let destroyed = false;

		const On_Station_Click = (event: Event) => {
			const id = (event as CustomEvent<string>).detail;
			dispatch('select', { id, kind: 'station' });
		};

		const On_Line_Click = (event: Event) => {
			const id = (event as CustomEvent<string>).detail;
			dispatch('select', { id, kind: 'line' });
		};

		resize_observer = new ResizeObserver((entries) => {
			if (!map) return;

			const entry = entries[0];
			if (!entry) return;

			const { width, height } = entry.contentRect;
			map.Zoom_Check_Map_Resize?.(width, height);
		});

		resize_observer.observe(container_element);

		(async () => {
			const map_instance = new Network_Map(
				'Desktop',
				'/image/map.svg',
				Get_Map_Config(),
				Get_Network_Config()
			);

			await map_instance.Setup("en", canvas_element);

			if (destroyed) return;

			map = map_instance;

			map.Setup_Mouse_Handlers_With_Data(
				network_data.lines,
				network_data.stations
			);

			document.addEventListener('station-click', On_Station_Click as EventListener);
			document.addEventListener('line-click', onLineClick as EventListener);

			detachListeners = () => {
				document.removeEventListener('station-click', On_Station_Click as EventListener);
				document.removeEventListener('line-click', onLineClick as EventListener);
			};

			ready = true;
			Apply_Selection();
		})();

		return () => {
			destroyed = true;
			detachListeners();
			resize_observer?.disconnect();
			resize_observer = null;
			map?.destroy?.();
			map?.Dispose?.();
			map = null;
			ready = false;
		};
	});

	$effect(() => {
		if (!ready) return;
		Apply_Selection();
	});
</script>

<div class="viewer" bind:this={canvas_element}>
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

	.loading {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		background: rgba(255, 255, 255, 0.75);
		font-size: 0.95rem;
		color: #555;
		pointer-events: none;
	}
</style>