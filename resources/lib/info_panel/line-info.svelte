<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Network, Line } from '$lib/types/network';
	import LineSchedule from './line-schedule.svelte';
	import Round_Cross from '$lib/componants/round-cross.svelte';

	let {
		line_data,
		network_data
	} = $props<{
		line_data: Line;
		network_data: Network;
	}>();

	let logoEl: HTMLDivElement | null = null;
	function get_patterns() {
		return line_data.patterns.map(pattern => ({
			...pattern,
			parent: line_data
		}));
	}

	$effect(() => {
		if (logoEl) {
			const rect = logoEl.querySelector('rect');
			if (rect)
				rect.setAttribute('fill', line_data.color.default);
		}
	});
</script>

<div class="line-info">
	<header>
		<div class="logo" bind:this={logoEl}>
			{@html line_data.icon}
		</div>
		<div class="title">
			Ligne {line_data.label}
		</div>
		<div class="close-button">
			<Round_Cross onclick={() => goto('../')} />
		</div>
	</header>

	{#if line_data.info_messages?.length}
		<div class="line-infomessages">
			{#each line_data.info_messages as message}
				<p class="infomessage">{message.message}</p>
			{/each}
		</div>
	{/if}

	<div class="schedules">
		{#each get_patterns() as pattern (pattern.id)}
			<LineSchedule schedule_data={pattern} {network_data} reference_station={null} />
		{/each}
	</div>
</div>

<style>

	header {
		padding: 1rem;
		padding-bottom: 0;
		display: flex;
		padding-left: .5rem;
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
