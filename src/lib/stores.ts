import type { Writable } from "svelte/store";
import { writable } from "svelte/store";

export type UserCreds = {
    access_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
};

export const creds: Writable<UserCreds | null> = writable(null);
export const storedPlayer: Writable<Spotify.Player | null> = writable(null);
export const deviceId: Writable<string> = writable("");
