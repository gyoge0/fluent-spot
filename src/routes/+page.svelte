<script lang="ts">
    import { getSignInUrl, handleRedirect } from "./spotify_sign_in";
    import { Button } from "fluent-svelte";
    import { listen } from "@tauri-apps/api/event";
    import { invoke } from "@tauri-apps/api";

    let url = getSignInUrl();

    let listener = null;

    const signIn = (url) => async () => {
        // only have 1 listener at a time
        if (listener != null) {
            listener();
        }
        listener = await listen("oauth-received", (callback) => {
            handleRedirect(callback.payload as string);
        });
        await invoke("do_oauth", { url: url });
    };
</script>

<main>
    <h1>FluentSpot</h1>
    {#await url}
        <p>Loading...</p>
    {:then url}
        <Button variant="accent" on:click={signIn(url)}>Sign in with Spotify</Button>
    {/await}
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        gap: 50px;
    }

    h1 {
        font-size: 3rem;
    }
</style>
