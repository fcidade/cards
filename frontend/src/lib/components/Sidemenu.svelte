<script lang="ts">
	import { players } from '../../store/player';
	import Label from './Label.svelte';

	// TODO types
	export let round: number = 0;
</script>

<aside class="box-border p-4 h-screen overflow-auto grow-0 border-l-black border-2 sidemenu">
	<Label>Jogadores:</Label>
	<ul>
		{#each $players as { nickname, score, its_me }}
			<li>
				<span class={its_me ? 'font-bold' : ''}>{nickname}</span>
				<span class="text-gray-600">({score} pontos)</span>
			</li>
		{/each}
	</ul>
	<hr />
	<!-- TODO: -->
	<button>Copiar link da sala</button>

	<hr />
	<span>Round: {round}</span>
	<!-- TODO -->
	<!-- <button>Reiniciar</button> -->
</aside>
