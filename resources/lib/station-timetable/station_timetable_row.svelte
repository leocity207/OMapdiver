<script lang="ts">
	/* eslint-disable svelte/no-at-html-tags */
	import type { Timetable_Entry } from "$lib/utils/station_timetable";
	import type { Color_Map } from "$lib/types/color_map";
	import ExpandButton from "$lib/componants/expand_button.svelte";
	import Utils from "$lib/utils/utils";

	let {
		entry,
		show_arrival,
		on_expand,
		color_mode
	} = $props<{
		entry: Timetable_Entry;
		show_arrival: boolean;
		on_expand: (entry: Timetable_Entry) => void;
		color_mode: Color_Map;
	}>();

	let expanded = $state(false);
	let line_icon_container = $state<HTMLDivElement>();

	function Handle_Expand() {
		expanded = !expanded;
		on_expand(entry);
	}

	$effect(() => {
		let color = entry.line.color[color_mode];
		const rect = line_icon_container?.querySelector("rect");
		if (rect) rect.setAttribute("fill", color);
	});
</script>

<div class="timetable-row">
	<!-- Warning -->
	<div class="col-warning">
		{#if entry.has_info}
			<span class="warning-icon" title={entry.timetable.info_messages[0]?.message}>
				⚠️
			</span>
		{/if}
	</div>

	<!-- Arrival (hidden by default, shown via option) -->
	<div class="col-arrival">
		{#if show_arrival && entry.arrival_seconds !== null}
			<span class="time-arrival">
				{Utils.Format_Minute(entry.arrival_seconds)}
			</span>
		{/if}
	</div>

	<!-- Departure -->
	<div class="col-time">
		<span class="time-main">
			{Utils.Format_Minute(entry.departure_seconds)}
		</span>
	</div>

	<!-- Line icon -->
	<div class="col-icon" bind:this={line_icon_container}>
		{@html entry.line.icon}
	</div>

	<!-- Destination -->
	<div class="col-destination">
		<strong>{entry.destination_label}</strong>
	</div>

	<!-- Track — placeholder, extend when data provides it -->
	<div class="col-track"></div>

	<!-- Expand -->
	<div class="col-expand">
		<ExpandButton bind:active={expanded} onclick={Handle_Expand} />
	</div>
</div>

<style>
	.timetable-row {
		display: grid;
		grid-template-columns:
			1.5rem   /* warning */
			3.5rem   /* arrival */
			3.5rem   /* departure */
			5.5rem   /* icon */
			1fr      /* destination */
			2.5rem   /* track */
			2rem;    /* expand */
		align-items: center;
		padding: 0.4rem 1rem;
		border-bottom: 1px solid #efefef;
		gap: 0.5rem;
	}

	.timetable-row:hover {
		background: #fafafa;
	}

	.warning-icon {
		font-size: 1rem;
		cursor: help;
	}

	.time-arrival {
		font-size: 0.8rem;
		color: #888;
		font-variant-numeric: tabular-nums;
	}

	.time-main {
		font-size: 0.95rem;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}

	.col-icon {
		display: flex;
		align-items: center;
	}

	.col-icon :global(svg) {
		height: 1.4rem;
		width: auto;
	}

	.col-destination strong {
		font-size: 0.95rem;
	}

	.col-track {
		text-align: right;
		font-size: 0.9rem;
		color: #555;
	}

	.col-expand {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.4rem;
		height: 1.4rem;
	}

	:global(.col-icon path) {
		fill: white;
	}
</style>