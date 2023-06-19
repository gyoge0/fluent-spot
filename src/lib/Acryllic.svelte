<script lang="ts">
    export let image = "";
    export let blur = 10;
</script>

<div
    id="background"
    style="background-image: url({image}); --blur: {blur};">
    <div id="content">
        <slot />
    </div>
</div>

<!--suppress CssUnresolvedCustomProperty -->
<style>
    #background {
        background-size: cover;
        width: 100%;
        height: 100%;
        background-position: center;
        transition: background-image 0.3s ease-in-out;
    }

    /* https://stackoverflow.com/a/57417852/18944758 */
    #content {
        width: 100%;
        height: 100%;

        /* Parent background + Gaussian blur */
        backdrop-filter: blur(calc(1px * var(--blur)));
        -webkit-backdrop-filter: blur(calc(1px * var(--blur))); /* Safari */

        /* Exclusion blend */
        background-blend-mode: exclusion;
        background: rgba(0, 0, 0, 0.1);
    }
</style>
