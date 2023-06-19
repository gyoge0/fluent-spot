<script lang="ts">
    import { fly } from "svelte/transition";
    export let image: string;
    export let inOptions: object;
    export let outOptions: object;
</script>

<div id="album-image">
    {#key image}
        <img
            src={image}
            in:fly={{...inOptions, duration: 500}}
            out:fly={{...outOptions, duration: 250}}
            alt="Album cover">
    {/key}
</div>

<style>
    div {
        width: 100%;
        height: 55%;
        max-height: 600px;
        display: grid;
        place-items: center;
        grid-template-rows: 100%;
    }

    img {
        height: 100%;
        aspect-ratio: 1;
        object-fit: cover;
        grid-row: 1;
        grid-column: 1;
        border-radius: 10px;
        box-shadow: 0 5px 50px rgba(0, 0, 0, 0.5);
    }
</style>
