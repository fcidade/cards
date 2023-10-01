<script lang="ts">
	import { onMount } from 'svelte';
	import Header from '../lib/components/Header.svelte';
	import Label from '../lib/components/Label.svelte';
	import Button from '../lib/components/Button.svelte';
	import { joinRoom } from '../services/room';

	let nickname = '';
	let roomID = '';

	onMount(() => {
		nickname = localStorage.getItem('nickname') ?? '';
		roomID = localStorage.getItem('room') ?? '';
	});

	const enter = async () => {
		if (nickname === '') {
			return alert('Digite um nome válido!');
		}
		if (roomID === '') {
			return alert('Digite o nome da sala!');
		}

		try {
			await joinRoom(roomID, nickname);
		} catch (e) {
			alert(e);
		}
	};
</script>

<main class="w-screen h-screen flex justify-center flex-col align-middle text-center gap-1">
	<Header />
	<Label>Qual seu nome?</Label>
	<div><input bind:value={nickname} type="text" class="border-2 border-black w-3/12" /></div>
	<Label>Qual o nome da sala que deseja entrar?</Label>
	<div><input bind:value={roomID} type="text" class="border-2 border-black w-3/12" /></div>
	<div><Button on:click={enter}>Entrar</Button></div>
</main>
