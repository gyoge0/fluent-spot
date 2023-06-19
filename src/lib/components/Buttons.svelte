<script lang="ts">
    export let skipPrevious: () => Promise<void>;
    export let skipNext: () => Promise<void>;
    export let togglePlay: () => Promise<void>;
    export let paused: boolean;
</script>

<div>
    <button on:click={skipPrevious}>
        <img class="icon" src="/icons/previous.svg" alt="previous">
    </button>
    <button on:click={togglePlay}>
        {#if paused}
            <img class="icon" src="/icons/play.svg" alt="play">
        {:else}
            <img class="icon" src="/icons/pause.svg" alt="pause">
        {/if}
    </button>
    <button on:click={skipNext}>
        <img class="icon" src="/icons/next.svg" alt="next">
    </button>
</div>


<style>
    div {
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        gap: 30px;
    }

    button {
        all: unset;
    }

    button:hover > img {
        background: rgba(0, 0, 0, 0.75);
    }

    button > img {
        border-radius: 100%;
        background: rgba(0, 0, 0, 0.5);
        mix-blend-mode: lighten;
        padding: 10px;
    }
</style>
