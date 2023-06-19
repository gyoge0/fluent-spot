import type { UserCreds } from "$lib/client/stores";
import type { Track } from "$lib/client/types";
import { convertTrack } from "$lib/client/types";

export type PlaybackPlatform = "client" | "api" | "active";

export function getTrack(state: Spotify.PlaybackState): Track {
    return convertTrack(state.track_window.current_track);
}

export class Client {
    private readonly player: Spotify.Player;
    private readonly deviceId: string;
    private userCreds: UserCreds;

    public constructor(player: Spotify.Player, deviceId: string, userCreds: UserCreds) {
        this.player = player;
        this.deviceId = deviceId;
        this.userCreds = userCreds;
    }

    private async command<R>(
        /* eslint-disable @typescript-eslint/no-explicit-any */
        handleClient: (client: Spotify.Player) => Promise<R>,
        handleApi: () => Promise<R>,
        on: PlaybackPlatform = "active"
        /* eslint-enable @typescript-eslint/no-explicit-any */
    ): Promise<R> {
        if (on === "client" || (on === "api" && (await this.isPlayingOnDevice()))) {
            return handleClient(this.player);
        } else {
            return handleApi();
        }
    }

    private async request(
        endpoint: string,
        method: string,
        body: object = {}
    ): Promise<object | number> {
        const options = {
            method: method,
            headers: {
                Authorization: `Bearer ${this.userCreds.access_token}`,
                "Content-Type": "application/json",
            },
        };
        if (method !== "GET") {
            options["body"] = JSON.stringify(body);
        }

        const res = await fetch(`https://api.spotify.com/v1${endpoint}`, options);
        console.log(res.status);
        if (res.status === 200) {
            return res
                .json()
                .then((data) => data)
                .catch(() => ({}));
        } else {
            return res.status;
        }
    }

    onStateChange(
        callback: (state: Spotify.PlaybackState, client: Client) => Promise<void>
    ): Spotify.PlaybackStateListener {
        const listener: Spotify.PlaybackStateListener = async (state) => {
            if (state !== null) {
                await callback(state, this);
            }
        };
        this.player.addListener("player_state_changed", listener);
        return listener;
    }

    removeListener(listener: Spotify.PlaybackStateListener): void {
        this.player.removeListener("player_state_changed", listener);
    }

    async currentDevice(): Promise<string | null> {
        return await this.command(
            async () => this.deviceId,
            async () => {
                const res = await this.request("/me/player", "GET");
                if (typeof res === "number") {
                    return null;
                } else {
                    return res["device"]["id"];
                }
            }
        );
    }

    async currentTrack(on: PlaybackPlatform = "active"): Promise<Track | null> {
        return await this.command(
            async (client) => {
                const state = await client.getCurrentState();
                if (state === null) {
                    return null;
                }
                return getTrack(state);
            },
            async () => {
                const res = await this.request("/me/player/currently-playing", "GET");
                if (typeof res === "number") {
                    return null;
                } else {
                    return convertTrack(res["item"]);
                }
            },
            on
        );
    }

    async isPlayingOnDevice(): Promise<boolean> {
        return (await this.player.getCurrentState()) != null;
    }

    async transferToPlayer(): Promise<void> {
        await this.request("/me/player", "PUT", {
            device_ids: [this.deviceId],
        });
    }

    async isSongPlaying(): Promise<boolean> {
        return (await this.request("/me/player/currently-playing", "GET")) !== 204;
    }

    async pause(on: PlaybackPlatform = "active"): Promise<void> {
        return await this.command<void>(
            async (client) => await client.pause(),
            async () => {
                await this.request("/me/player/pause", "PUT");
            },
            on
        );
    }

    async play(on: PlaybackPlatform = "active"): Promise<void> {
        return await this.command<void>(
            async (client) => await client.resume(),
            async () => {
                await this.request("/me/player/play", "PUT");
            },
            on
        );
    }

    async playTrack(trackId: string): Promise<void> {
        await this.request("/me/player/play", "PUT", {
            uris: [`spotify:track:${trackId}`],
        });
    }

    async next(on: PlaybackPlatform = "active"): Promise<void> {
        return await this.command<void>(
            async (client) => await client.nextTrack(),
            async () => {
                await this.request("/me/player/next", "POST");
            },
            on
        );
    }

    async previous(on: PlaybackPlatform = "active"): Promise<void> {
        return this.command<void>(
            async (client) => await client.previousTrack(),
            async () => {
                await this.request("/me/player/previous", "POST");
            },
            on
        );
    }

    async disconnect(): Promise<void> {
        await this.player.disconnect();
    }
}
