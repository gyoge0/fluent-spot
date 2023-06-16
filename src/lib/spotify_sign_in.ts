/* eslint-disable @typescript-eslint/no-non-null-assertion */
import pkceChallenge from "pkce-challenge";

const clientId = "689f510bed68418f81f8de98249a5943";
const redirectUri = "http://localhost:10000";
const scopes = [
    "streaming",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-currently-playing",
];

export async function getSignInUrl() {
    const pkce = pkceChallenge();
    localStorage.setItem("pkce", JSON.stringify(pkce));
    const args = new URLSearchParams({
        response_type: "code",
        client_id: clientId,
        scope: scopes.join(" "),
        redirect_uri: redirectUri,
        state: pkce.code_verifier,
        code_challenge_method: "S256",
        code_challenge: pkce.code_challenge,
    });
    return `https://accounts.spotify.com/authorize?${args.toString()}`;
}

export async function handleRedirect(callback: string) {
    const pkce = JSON.parse(localStorage.getItem("pkce")!);
    const split = callback.split("/");
    const params = new URLSearchParams(split[split.length - 1]);
    const body = new URLSearchParams({
        grant_type: "authorization_code",
        code: params.get("code")!,
        redirect_uri: redirectUri,
        client_id: clientId,
        code_verifier: pkce.code_verifier,
    });

    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body,
    });

    if (!response.ok) {
        console.error(await response.json());
        throw new Error("HTTP status " + response.status);
    }

    localStorage.removeItem("pkce");
    localStorage.setItem("user", JSON.stringify(await response.json()));
    window.location.href = "/home";
}
