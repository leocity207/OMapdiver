<script lang="ts">
	import type { Network, Line } from '$lib/types/network';
	import LineSchedule from './line-schedule.svelte';

	let {
		line_data,
		network_data
	} = $props<{
		line_data: Line;
		network_data: Network;
	}>();

	function get_patterns() {
		return line_data.patterns.map(pattern => ({
			...pattern,
			parent: line_data
		}));
	}
</script>

<div class="line-info">
	<div class="line-header">
		<div class="line-logo">
			{@html line_data.icon}
		</div>
		<div class="line-title">Ligne {line_data.label}</div>
	</div>

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
	.line-header {
		display: flex;
		align-items: center;
		margin-bottom: 0.5em;
	}

	.line-logo {
		width: 100px;
		height: 40px;
		margin-right: 0.5em;
		margin-left: 0.5em;
	}

	.line-logo :global(svg) {
		width: 100%;
		height: 100%;
		display: block;
	}

	.line-title {
		font-size: 1.25em;
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
</style>
