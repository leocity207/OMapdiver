<script lang="ts">

	let {
		active = $bindable(),
		title = "Fold plus/minus"
	} = $props<{ 
		active: boolean;
		title?: string;
	}>();

	const onclick =() => (active = !active);
</script>

<button class:active {onclick} {title} aria-pressed={active}>
	<div></div>
	<div></div>
	<div></div>
</button>

<style>
	button{
		background: none;
		border: none;
		cursor: pointer;
		width: 2em;
		position : relative;
		height: 60%;
	}

	.active div:nth-child(1){
		transition: top .25s ease,-webkit-transform .25s ease .25s;
		transition: top .25s ease,transform .25s ease .25s;
		transition: top .25s ease,transform .25s ease .25s,-webkit-transform .25s ease .25s;
		top: 50%;
		-webkit-transform: rotate(45deg);
		transform: rotate(45deg);
	}

	button div:nth-child(1){
		top: 0%;
		transition: top .25s ease .25s,-webkit-transform .25s ease;
		transition: transform .25s ease,top .25s ease .25s;
		transition: transform .25s ease,top .25s ease .25s,-webkit-transform .25s ease;
	}

	.active div:nth-child(2){
		transition: opacity .125s ease .25s;
		opacity: 0;
	}

	button div:nth-child(2){
		top: 50%;
		transition: top .25s ease .25s,-webkit-transform .25s ease;
		transition: transform .25s ease,top .25s ease .25s;
		transition: transform .25s ease,top .25s ease .25s,-webkit-transform .25s ease;
	}

	.active div:nth-child(3){
		transition: top .25s ease,-webkit-transform .25s ease .25s;
		transition: top .25s ease,transform .25s ease .25s;
		transition: top .25s ease,transform .25s ease .25s,-webkit-transform .25s ease .25s;
		top: 50%;
		-webkit-transform: rotate(-45deg);
		transform: rotate(-45deg);
	}

	button div:nth-child(3){
		top: 100%;
		transition: top .25s ease .25s,-webkit-transform .25s ease;
		transition: transform .25s ease,top .25s ease .25s;
		transition: transform .25s ease,top .25s ease .25s,-webkit-transform .25s ease;
	}

	button > div{
		position: absolute;
		height: 2px;
		width: 100%;
		background-color: #444;
		opacity: 1;
	}

	button:hover > div{
		background-color: #eb0000;
	}
</style>