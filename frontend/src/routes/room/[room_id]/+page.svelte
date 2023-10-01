<script lang="ts">
	import { onMount } from 'svelte';
	// import io, { Socket } from 'socket.io-client';
	import { goto } from '$app/navigation';
	import Sidemenu from '../../../lib/components/Sidemenu.svelte';
	import Card from '../../../lib/components/Card.svelte';
	import Header from '../../../lib/components/Header.svelte';
	import { RoomState } from '@fcidade/cah';
	import Label from '../../../lib/components/Label.svelte';
	import Button from '../../../lib/components/Button.svelte';
	import {
		cardsOnTheTable,
		currentCardType,
		myBlackCards,
		myWhiteCards,
		roomState
	} from '../../../store/player';
	import {
		blackChooseCard,
		blackVoteCard,
		joinRoom,
		whiteChooseCard
	} from '../../../services/room';
	import type { CardID } from '@fcidade/cah/build/card';

	export let data;

	// TODO: Types
	let round = 0;

	$: amIPlayingTheBlackCards = $currentCardType === 'black';

	let selectedCardID: CardID | null = null;

	const selectCard = (id: string) => {
		// if (roomState !== RoomState.WhiteChoosingCard) return;
		selectedCardID = id;
	};

	const chooseCard = () => {
		// TODO: Check for nulltability
		if (amIPlayingTheBlackCards) {
			blackChooseCard(data.roomID, data.nickname, selectedCardID!);
		} else {
			whiteChooseCard(data.roomID, data.nickname, selectedCardID!);
		}
		selectedCardID = null;
	};

	const voteCard = () => {
		blackVoteCard(data.roomID, data.nickname, selectedCardID!);
		selectedCardID = null;
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

<div class="w-100 flex box-border">
	<main class="box-border grow">
		<Header />

		<div class="flex flex-row justify-center gap-2 flex-wrap">
			{#each $cardsOnTheTable as { id, type, content, is_hidden }}
				<div>
					<!-- TODO: Passar lógica de selecao com um bind no componente do card -->
					<Card
						{type}
						{content}
						{is_hidden}
						selected={$roomState === RoomState.BlackVoteCard && id === selectedCardID}
						selectable={type !== 'black' &&
							$roomState === RoomState.BlackVoteCard &&
							amIPlayingTheBlackCards}
						on:selected={() => selectCard(id)}
					/>
				</div>
			{/each}
			{#if selectedCardID && $roomState === RoomState.BlackVoteCard}
				<Button on:click={voteCard}>Escolher!</Button>
			{/if}
		</div>
		<hr class="my-2" />

		<div class="flex flex-row justify-center gap-2 flex-wrap">
			{#if amIPlayingTheBlackCards}
				{#each $myBlackCards as { type, content, id }}
					<Card
						{type}
						{content}
						on:selected={() => selectCard(id)}
						selected={$roomState === RoomState.BlackChoosingCard && id === selectedCardID}
						selectable={$roomState === RoomState.BlackChoosingCard}
					/>
					<!-- // TODO: Fix Selectable -->
				{/each}
			{:else}
				{#each $myWhiteCards as { type, content, id }}
					<Card
						{type}
						{content}
						on:selected={() => selectCard(id)}
						selected={$roomState === RoomState.WhiteChoosingCard && id === selectedCardID}
						selectable={$roomState === RoomState.WhiteChoosingCard}
					/>
					<!-- // TODO: Fix Selectable -->
				{/each}
			{/if}
		</div>

		<div class="text-center m-4">
			{#if $roomState === RoomState.BlackChoosingCard}
				{#if amIPlayingTheBlackCards}
					<Label>Escolha uma carta preta!</Label>
					{#if selectedCardID}
						<Button on:click={chooseCard}>Escolher!</Button>
					{/if}
				{:else}
					<Label>Aguarde enquanto o jogador (TODO: JOGADOR) escolhe uma carta preta...</Label>
				{/if}
			{:else if $roomState === RoomState.WhiteChoosingCard}
				{#if amIPlayingTheBlackCards}
					<Label>Aguarde enquanto os jogadores escolhem as cartas brancas...</Label>
				{:else if !selectedCardID}
					<Label>Escolha uma carta branca!</Label>
				{:else}
					<Button on:click={chooseCard}>Escolher!</Button>
				{/if}
			{:else if $roomState === RoomState.BlackVoteCard}
				{#if amIPlayingTheBlackCards}
					<Label>Escolha a melhor carta branca!</Label>
				{:else}
					<Label>Aguarde enquanto o jogador escolhe a melhor carta branca...</Label>
				{/if}
			{:else if $roomState === RoomState.AnnounceRoundWinner}
				<Label>O vencedor do round foi o(a) (TODO: PLAYER)!</Label>
			{/if}
			<Label>(debug) {$roomState}</Label>
		</div>
	</main>

	<Sidemenu {round} />
</div>
