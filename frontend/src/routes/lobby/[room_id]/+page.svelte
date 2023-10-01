<script lang="ts">
	import { goto } from '$app/navigation';
	import Header from '../../../lib/components/Header.svelte';
	import Label from '../../../lib/components/Label.svelte';
	import { players } from '../../../store/player';
	import Button from '../../../lib/components/Button.svelte';
	import { onMount } from 'svelte';
	import { joinRoom } from '../../../services/room';

	export let data;

	$: atLeast3Players = $players.length >= 3;

	const startRound = () => {
		if (!atLeast3Players) {
			return;
		}
		goto('/room/' + data.roomID);
	};

	onMount(async () => {
		try {
			await joinRoom(data.roomID, data.nickname);
		} catch (e) {
			alert(e);
			goto('/');
		}
	});
</script>

<div class="w-100 flex box-border flex-col p-6">
	<Header />
	<Label>Jogadores</Label>
	<ul class="flex flex-col gap-2 my-2">
		{#each $players as player}
			<li class="p-2 border-2 border-gray-500">{player.nickname}</li>
		{/each}
	</ul>

	{#if !atLeast3Players}
		<Label>Mínimo de 3 jogadores!</Label>
	{/if}

	<Button disabled={!atLeast3Players} on:click={startRound}>Iniciar partida</Button>
</div>
