<script lang="ts">
	import { T } from "$lib/i18n";
</script>

<div class="empty-state">
	<div class="empty-state-content">
		<h1>{T("line_timetable")}</h1>
		<p>Select a line from the list above to view its timetable.</p>
	</div>
</div>

<style>
	.empty-state {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		width: 100%;
	}

	.empty-state-content {
		text-align: center;
		color: #666;
	}

	h1 {
		font-size: 1.5em;
		margin-bottom: 0.5em;
		color: #333;
	}

	p {
		font-size: 1em;
		margin: 0;
	}
</style>
