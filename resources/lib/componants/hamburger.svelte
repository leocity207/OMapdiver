<script lang="ts">
	export let active: boolean = false;
	export let onToggle: (() => void) | undefined;
</script>

<button
	class="hamburger"
	class:active
	on:click={onToggle}
	aria-label="Menu"
	aria-pressed={active}
>
	<div class="bar bar1"></div>
	<div class="bar bar2"></div>
	<div class="bar bar3"></div>
</button>

<style>
	.hamburger{
		background: none;
		border: none;
		cursor: pointer;
		width: 3em;
		position : relative;
		height: 70%;
	}

	.active .bar1{
		transition: top .25s ease,-webkit-transform .25s ease .25s;
		transition: top .25s ease,transform .25s ease .25s;
		transition: top .25s ease,transform .25s ease .25s,-webkit-transform .25s ease .25s;
		top: 50%;
		-webkit-transform: rotate(45deg);
		transform: rotate(45deg);
	}

	.bar1{
		top: 0%;
		transition: top .25s ease .25s,-webkit-transform .25s ease;
		transition: transform .25s ease,top .25s ease .25s;
		transition: transform .25s ease,top .25s ease .25s,-webkit-transform .25s ease;
	}

	.active .bar2{
		transition: opacity .125s ease .25s;
		opacity: 0;
	}

	.bar2{
		top: 50%;
		transition: top .25s ease .25s,-webkit-transform .25s ease;
		transition: transform .25s ease,top .25s ease .25s;
		transition: transform .25s ease,top .25s ease .25s,-webkit-transform .25s ease;
	}

	.active .bar3{
		transition: top .25s ease,-webkit-transform .25s ease .25s;
		transition: top .25s ease,transform .25s ease .25s;
		transition: top .25s ease,transform .25s ease .25s,-webkit-transform .25s ease .25s;
		top: 50%;
		-webkit-transform: rotate(-45deg);
		transform: rotate(-45deg);
	}

	.bar3{
		top: 100%;
		transition: top .25s ease .25s,-webkit-transform .25s ease;
		transition: transform .25s ease,top .25s ease .25s;
		transition: transform .25s ease,top .25s ease .25s,-webkit-transform .25s ease;
	}

	.bar{
		position: absolute;
		height: 2px;
		width: 100%;
		background-color: #444;
		opacity: 1;
	}

	.hamburger:hover .bar{
		background-color: #eb0000;
	}
</style>