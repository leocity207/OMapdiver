<script lang="ts">
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();
</script>

<section class="panel">
	<div class="header">
		<div>
			<p class="eyebrow">{data.element.kind}</p>
			<h1>{data.element.label}</h1>
			<p class="meta">ID: {data.element.id}</p>
		</div>

		<a class="close" href="/map" aria-label="Close panel">×</a>
	</div>

	<details open>
		<summary>Raw data</summary>
		<pre>{JSON.stringify(data.element.raw, null, 2)}</pre>
	</details>
</section>

<style>
	.panel {
		padding: 1.25rem;
	}

	.header {
		display: flex;
		gap: 1rem;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: 1rem;
	}

	.eyebrow {
		margin: 0 0 0.25rem 0;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #888;
	}

	h1 {
		margin: 0;
		font-size: 1.25rem;
	}

	.meta {
		margin: 0.35rem 0 0 0;
		color: #666;
		font-size: 0.92rem;
	}

	.close {
		display: inline-grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		border-radius: 999px;
		text-decoration: none;
		color: #222;
		background: #f1f1f1;
		font-size: 1.25rem;
		line-height: 1;
	}

	details {
		border-top: 1px solid #e5e5e5;
		padding-top: 0.85rem;
	}

	summary {
		cursor: pointer;
		font-weight: 600;
		margin-bottom: 0.75rem;
	}

	pre {
		margin: 0;
		padding: 0.9rem;
		background: #f8f8f8;
		border-radius: 0.75rem;
		overflow: auto;
		font-size: 0.85rem;
		line-height: 1.45;
	}
</style>