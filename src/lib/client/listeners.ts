import { storedPlayer } from "./stores";
import { get } from "svelte/store";

export default function addListeners(player: Spotify.Player) {
    player.addListener("initialization_error", ({ message }) => {
        console.error(message);
        setTimeout(() => {
            if (get(storedPlayer) === null) {
                window.location.href = "/error/player/generic";
            }
        }, 1000);
    });

    player.addListener("authentication_error", ({ message }) => {
        console.error(message);
        setTimeout(() => {
            if (get(storedPlayer) === null) {
                window.location.href = "/error/player/generic";
            }
        }, 1000);
    });

    player.addListener("account_error", ({ message }) => {
        console.error(message);
        window.location.href = "/error/player/premium";
    });
}
