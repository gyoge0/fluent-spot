import type { UserCreds } from "$lib/stores";
import { creds, deviceId, storedPlayer } from "$lib/stores";
import addListeners from "$lib/listeners";
import { get } from "svelte/store";
import { Client } from "$lib/api/client";

export default async function getClient(): Promise<Client> {
    return new Promise((resolve, reject) => {
        window.onSpotifyWebPlaybackSDKReady = () => {
            const storedCreds = localStorage.getItem("user");
            if (storedCreds === null) {
                reject("No user creds");
            } else {
                creds.set(JSON.parse(storedCreds) as UserCreds);
            }

            const token = get(creds).access_token;
            // noinspection JSUnusedGlobalSymbols
            const player: Spotify.Player = new Spotify.Player({
                name: "FluentSpot Playback",
                getOAuthToken: (cb) => {
                    cb(token);
                },
                volume: 1,
            });
            addListeners(player);
            player.connect();
            storedPlayer.set(player);
            player.addListener("ready", ({ device_id }) => {
                console.log("Ready with Device ID", device_id);
                deviceId.set(device_id);
                resolve(new Client(player, get(deviceId), get(creds)));
            });
        };
    });
}
