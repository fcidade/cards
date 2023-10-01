<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let selectable: boolean = false;
	export let selected: boolean = false;
	export let is_hidden: boolean = false;
	export let content = '';
	export let type: 'white' | 'black';

	const dispatch = createEventDispatcher();

	const click = () => {
		if (selectable) {
			dispatch('selected');
		}
	};

	$: styles = [
		`${type}-card`,
		is_hidden && 'card-hidden',
		selected && `card-selected-${type}`,
		selectable && 'card-mine'
	]
		.filter(Boolean)
		.join(' ')
		.trim();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class={`${styles} flex-none card`} on:click={click}>
	{content}
</div>

<style>
	.card {
		padding: 16px;
		font-weight: bold;
		border: solid 2px black;
		border-radius: 16px;
		width: 180px;
		box-sizing: border-box;
		min-height: 230px;
		background-color: white;
	}

	.white-card {
		color: black;
		background-color: white;
	}

	.black-card {
		color: white;
		background-color: black;
	}

	.card-mine:hover {
		transform: scale(110%);
		transition: 0.1s;
		cursor: pointer;
	}

	.card-selected-white {
		background-color: greenyellow;
	}

	.card-selected-black {
		background-color: red;
	}

	.sidemenu {
		min-width: 250px;
	}
</style>
