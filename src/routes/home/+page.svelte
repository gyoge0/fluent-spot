<svelte:head>
    <script src="https://sdk.scdn.co/spotify-player.js"></script>
</svelte:head>

<script lang="ts">

    import Splash from "$lib/components/Splash.svelte";
    import getClient from "$lib/client/get_client";
    import Main from "$lib/components/Player.svelte";


    let promise = getClient().catch(console.error);
</script>

{#await promise}
    <Splash />
{:then client}
    <Main {client}/>
{/await}
