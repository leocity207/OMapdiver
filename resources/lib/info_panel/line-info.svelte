<script lang="ts">
	import type { Color_Map } from "$lib/types/color_map.ts";
	import type { Network, Line, Pattern } from "$lib/types/network";
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths"
	import LineSchedule from "./line-schedule.svelte";
	import Round_Cross from "$lib/componants/round-cross.svelte";
	import { T } from "$lib/i18n";

	let {
		line_data,
		network_data,
		color_mode = $bindable("default"),
	} = $props<{
		line_data: Line;
		network_data: Network;
		color_mode?: Color_Map;
	}>();

	let logo_element: HTMLDivElement | null = null;
	function Get_Patterns() {
		return line_data.patterns.map((pattern: Pattern) => ({
			...pattern,
			parent: line_data,
		}));
	}

	$effect(() => {
		if (logo_element) {
			const rect = logo_element.querySelector("rect");
			if (rect) rect.setAttribute("fill", line_data.color[color_mode]);
		}
	});
</script>

<div class="line-info">
	<header>
		<div class="logo" bind:this={logo_element}>
			{line_data.icon}
		</div>
		<div class="title">
			{T("line")}
			{line_data.label}
		</div>
		<div class="close-button">
			<Round_Cross onclick={() => goto(resolve("../"))} />
		</div>
	</header>

	{#if line_data.info_messages?.length}
		<div class="line-infomessages">
			{#each line_data.info_messages as message (message.id)}
				<p class="infomessage">{message.message}</p>
			{/each}
		</div>
	{/if}

	<div class="schedules">
		{#each Get_Patterns() as pattern (pattern.id)}
			<LineSchedule
				schedule_data={pattern}
				{network_data}
				reference_station={null}
				{color_mode}
			/>
		{/each}
	</div>
</div>

<style>
	header {
		padding: 1rem;
		padding-bottom: 0;
		display: flex;
		padding-left: 0.5rem;
	}

	header > .title {
		font-size: 1.5em;
		flex: 1;
	}

	.logo {
		width: 8rem;
		margin-right: 0.5em;
	}

	.logo :global(svg) {
		width: 100%;
		height: 100%;
		display: block;
	}

	.logo :global(path) {
		fill: white;
	}

	.title {
		font-size: 1em;
		flex: 1;
	}

	.line-infomessages {
		background: #fff4e5;
		border: 1px solid #f5c26b;
		padding: 0.5em;
		border-radius: 4px;
		margin-bottom: 0.75em;
		margin-left: 0.5em;
		margin-right: 0.5em;
	}

	.infomessage {
		margin: 0.25em 0;
	}

	.schedules {
		margin-top: 0.5em;
		overflow: auto;
	}

	header > .close-button {
		height: 2rem;
		width: 2rem;
		aspect-ratio: 1 / 1;
	}
</style>
