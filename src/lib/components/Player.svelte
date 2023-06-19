<!--suppress HtmlRequiredAltAttribute -->
<script lang="ts">
    import Acrylic from "$lib/components/Acrylic.svelte";
    import { Client } from "$lib/client/client";
    import { onDestroy } from "svelte";
    import type { Track } from "$lib/client/types";
    import Buttons from "$lib/components/Buttons.svelte";
    import TrackInfo from "$lib/components/TrackInfo.svelte";
    import AlbumImage from "$lib/components/AlbumImage.svelte";

    export let client: Client;
    const listener = client.onStateChange(async () => {
        update(0);
    });
    onDestroy(() => {
        client.removeListener(listener);
        client.disconnect();
    });

    let paused = true;
    let inOptions = { x: "100%" };
    let outOptions = { x: "-100%" };
    let track: Track | null = null;
    let image = "/app-icon.png";

    function update(time = 225) {
        setTimeout(async () => {
            const newTrack = await client.currentTrack();
            if (newTrack === null) {
                return;
            }
            if (newTrack.id !== track?.id) {
                track = newTrack;
                image = newTrack.album.images[0].url;
                return;
            }
        }, time);
    }

    async function skipPrevious() {
        await client.previous();
        inOptions = { x: "-100%" };
        outOptions = { x: "100%" };
        update();
        paused = false;
    }

    async function skipNext() {
        await client.next();
        inOptions = { x: "100%" };
        outOptions = { x: "-100%" };
        update();
        paused = false;
    }

    async function togglePlay() {
        inOptions = { x: "100%" };
        outOptions = { x: "-100%" };
        if (paused && !(await client.isPlayingOnDevice())) {
            await client.transferToPlayer();
            await client.play("client");
            update(500);
        } else if (paused) {
            await client.play();
            update();
        } else {
            await client.pause();
            update();
        }
        paused = !paused;
    }
</script>

<Acrylic {image} blur="150">
    <main>
        <AlbumImage {image} {inOptions} {outOptions} />
        {#if track !== null}
            <TrackInfo {track} />
        {/if}
        <Buttons {skipNext} {skipPrevious} {togglePlay} {paused} />
    </main>
</Acrylic>

<style>
    main {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        overflow-x: hidden;
        gap: 5%;
    }
</style>
