<script lang="ts">
	let {
		active = $bindable(),
		title = "Expand",
		onclick,
	} = $props<{
		active: boolean;
		title?: string;
		onclick?: () => void;
	}>();

	function Handle_Click() {
		active = !active;
		onclick?.();
	}
</script>

<button onclick={Handle_Click} aria-pressed={active} {title}>
	<div class={active ? "minus" : "plus"}>
		<div class="horizontal"></div>
		<div class="vertical"></div>
	</div>
</button>

<style>
	button:hover {
		transform: scale(1.1);
	}

	button {
		width: 100%;
		height: 100%;
		aspect-ratio: 1 / 1;
		border-radius: 50%;
		border: 1px solid black;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		background: transparent;
		cursor: pointer;
	}

	.horizontal,
	.vertical {
		position: absolute;
		width: 75%;
		height: 5%;
		background-color: black;
		transition:
			transform 0.2s ease,
			opacity 0.2s ease;
		translate: -50%;
	}

	.horizontal {
		transform: rotate(180deg);
	}

	.vertical {
		transform: rotate(90deg);
	}

	.minus > .vertical,
	.minus > .horizontal {
		transform: rotate(0deg);
	}
</style>
