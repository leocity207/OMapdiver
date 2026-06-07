<script lang="ts">
	let {
		label = null,
		checked = $bindable(false)
	} = $props<{
		label: string | null;
		checked?: boolean;
	}>();
</script>

<div>
	{#if label}
		<span class="switch-label">{label}</span>
		<div class="space"></div>
	{/if}



	<label class="switch">
		<input type="checkbox" bind:checked />
		<span class="slider"></span>
	</label>
</div>

<style>
	div {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.space {
		flex-grow: 1;
	}

	.switch-label {
		font-size: 0.9375em;
		line-height: 1.7;
	}

	.switch {
		position: relative;
		display: inline-block;
		width: 3.5em;
		height: 2em;
		scale: 0.7;
	}

	.switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	.slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #fff;
		border: 1px solid #adb5bd;
		transition: 0.4s;
		border-radius: 30px;
	}

	.slider::before {
		position: absolute;
		content: "";
		height: 1.4em;
		width: 1.4em;
		border-radius: 50%;
		left: 0.27em;
		bottom: 0.25em;
		background-color: #adb5bd;
		transition: 0.4s;
	}

	.switch input:checked + .slider {
		background-color: #ff0000;
		border-color: #ff0000;
	}

	.switch input:focus + .slider {
		box-shadow: 0 0 1px #ff0000;
	}

	.switch input:checked + .slider::before {
		transform: translateX(1.4em);
		background-color: #fff;
	}
</style>