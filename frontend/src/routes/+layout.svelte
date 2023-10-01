<script>
	import { onMount } from 'svelte';
	import '../app.css';
	import { onThemJoinRoom as onPlayersUpdate, onThemChooseCard } from '../services/room';

	onMount(() => {
		onPlayersUpdate();
		onThemChooseCard();
	});
</script>

<slot />
