<script lang="ts">
	export let disabled: boolean = false;
</script>

<button
	class="text-2xl bg-black text-white p-4 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none"
	on:click
	{disabled}><slot /></button
>
