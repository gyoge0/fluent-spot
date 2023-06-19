<script lang="ts">
    import "fluent-svelte/theme.css";
    import "../style.css";
    import { appWindow } from "@tauri-apps/api/window";

    let maximized = false;
    let windowTitle = "";

    setInterval(function() {
        appWindow.isMaximized().then(function(value) {
            maximized = value;
        });
        appWindow.title().then(function(title) {
            if (windowTitle !== title) {
                windowTitle = title;
            }
        });
    }, 200);

</script>

<div data-tauri-drag-region>
</div>
<button on:click={appWindow.minimize} id="minimize"></button>
{#if maximized}
    <button on:click={appWindow.toggleMaximize} id="restore"></button>
{:else}
    <button on:click={appWindow.toggleMaximize} id="maximize"></button>
{/if}
<button id="close" on:click={appWindow.close}></button>
<slot />

<style>
    :root {
        --width: 50px;
    }

    div {
        position: absolute;
        height: 40px;
        top: 0;
        left: 0;
        right: 0;
        z-index: 500;
    }

    button {
        width: var(--width);
        height: 40px;
        cursor: pointer;
        border: none;

        position: absolute;
        top: 0;

        z-index: 1000;
        background-color: transparent;
        mix-blend-mode: exclusion;
        background-repeat: no-repeat;
        background-position-x: center;
        background-position-y: 10px;
    }

    #minimize:hover, #maximize:hover, #restore:hover {
        background-color: rgba(0, 0, 0, 0.1);
        mix-blend-mode: normal;
    }

    #minimize:active, #maximize:active, #restore:active {
        background-color: rgba(0, 0, 0, 0.2);
        mix-blend-mode: normal;
    }

    #minimize {
        background-image: url("/icons/minimize.svg");
        right: calc(var(--width) * 2);
    }

    #maximize {
        background-image: url("/icons/maximize.svg");
        right: var(--width);
    }

    #restore {
        background-image: url("/icons/restore.svg");
        right: var(--width);
    }

    #close {
        background-image: url("/icons/close.svg");
        right: 0;
    }

    #close:hover {
        background-color: rgb(200, 62, 49);
        mix-blend-mode: normal;
    }

    #close:active {
        background-color: rgb(196, 28, 41);
        mix-blend-mode: normal;
    }

</style>
