<script lang="ts">
    import { getSignInUrl, handleRedirect } from "$lib/spotify_sign_in";
    import { Button } from "fluent-svelte";
    import { listen } from "@tauri-apps/api/event";
    import { invoke } from "@tauri-apps/api";
    import Splash from "$lib/Splash.svelte";

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

{#await url}
    <Splash />
{:then url}
    <Splash>
        <Button variant="accent" on:click={signIn(url)}>Sign in with Spotify</Button>
    </Splash>
{/await}
