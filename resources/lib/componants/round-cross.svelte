<script lang="ts">
	let {
		size = 20,
		color = '#000000',
		strokeWidth = 0.7,
		hoverColor = undefined,
		onclick = undefined
	} = $props<{
		size?: number;
		color?: string;
		strokeWidth?: number;
		hoverColor?: string;
		onclick?: () => void;
	}>();

	let is_hovering = $state(false);

	const effective_color = is_hovering && hoverColor ? hoverColor : color;
</script>

<button
	class="round-cross"
	style:--size="{size}px"
	style:--color={effective_color}
	style:--stroke-width="{strokeWidth}px"
	onmouseenter={() => (is_hovering = true)}
	onmouseleave={() => (is_hovering = false)}
	onclick={onclick}
	aria-label="Close"
>
	<div class="circle">
		<div class="left"></div>
		<div class="right"></div>
	</div>
</button>

<style>
	.round-cross {
		all: unset;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		padding: 0;
		border: none;
		background: none;
	}

	.circle {
		width: var(--size);
		height: var(--size);
		border-radius: 50%;
		border: 1px solid var(--color);
		position: relative;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
	}

	.round-cross:hover .circle {
		background-color: rgba(0, 0, 0, 0.05);
		transform: scale(1.1);
	}

	.left,
	.right {
		position: absolute;
		width: calc(var(--size) * 0.75);
		height: var(--stroke-width);
		background-color: var(--color);
		transition: background-color 0.2s ease;
	}

	.left {
		transform: rotate(45deg);
	}

	.right {
		transform: rotate(-45deg);
	}
</style>