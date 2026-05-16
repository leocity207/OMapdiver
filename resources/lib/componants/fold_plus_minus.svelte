<script lang="ts">
	let {
		active = $bindable(false)
	} = $props<{
		active?: boolean;
	}>();
</script>

<button
	class="circle"
	class:active
	onclick={() => (active = !active)}
	aria-pressed={active}
	title="fold/unfold details"
>
	<div class={active ? 'minus' : 'plus'}>
		<div class="horizontal"></div>
		<div class="vertical"></div>
	</div>
</button>

<style>
	.circle {
		width: 100%;
		height: 100%;
		aspect-ratio: 1 / 1;
		border-radius: 50%;
		border: 1px solid black;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		position: relative;
		transition: background-color 0.2s ease;
		background: transparent;
		padding: 0;
		appearance: none;
	}

	.horizontal,
	.vertical {
		position: absolute;
		width: 75%;
		height: 5%;
		background-color: black;
		transition: transform 0.2s ease, opacity 0.2s ease;
		translate: -50%;
		pointer-events: none;
	}

	.horizontal {
		transform: rotate(180deg);
	}

	.vertical {
		transform: rotate(90deg);
	}

	.minus > .vertical{
		transform: rotate(0deg);
	}

	.minus > .horizontal{
		transform: rotate(0deg);
	}
</style>