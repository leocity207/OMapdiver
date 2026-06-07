<script lang="ts">
	let { onclick = undefined, title = "round cross" } = $props<{
		onclick?: () => void;
		title?: string;
	}>();
</script>

<button {onclick} aria-label="Close" {title}>
	<div class="circle">
		<div class="left"></div>
		<div class="right"></div>
	</div>
</button>

<style>
	button {
		all: unset;
		width: 100%;
		height: 100%;
		aspect-ratio: 1 / 1;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		padding: 0;
		border: none;
		background: transparent;
	}

	.circle {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		border: 1px solid currentColor;
		position: relative;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
	}

	button:hover .circle {
		transform: scale(1.1);
	}

	.left,
	.right {
		position: absolute;
		width: 75%;
		height: 3%;
		background-color: currentColor;
		transition: background-color 0.2s ease;
	}

	.left {
		transform: rotate(45deg);
	}

	.right {
		transform: rotate(-45deg);
	}
</style>
