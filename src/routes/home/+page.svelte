<svelte:head>
    <script src="https://sdk.scdn.co/spotify-player.js"></script>
</svelte:head>

<script lang="ts">

    import Splash from "$lib/Splash.svelte";
    import getClient from "$lib/api/get_client";
    import Main from "$lib/Main.svelte";


    let promise = getClient().catch(console.error);
</script>

{#await promise}
    <Splash />
{:then client}
    <Main {client}/>
{/await}
