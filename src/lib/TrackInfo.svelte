<script lang="ts">
    import type { Track } from "$lib/api/types";

    export let track: Track;
</script>

<p id="track-name">{track.name}</p>
<p id="artist-name">{track.artists.map(a => a.name).join(", ")}</p>

<style>
    p {
        text-align: center;
        margin: 0;
        color: white;
        text-shadow: 0 0 75px rgba(0, 0, 0, 1), 0 0 75px rgba(0, 0, 0, 1);
    }

    #artist-name {
        font-size: 1.5em;
        font-weight: 600;
    }

    #track-name {
        font-size: 2em;
        font-weight: 700;
    }
</style>
