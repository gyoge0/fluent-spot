// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{command, AppHandle, Wry};
use tauri::{Manager, Window};
use tauri_plugin_oauth::{start_with_config, OauthConfig};
use window_shadows::set_shadow;

#[command]
async fn do_oauth(handle: AppHandle<Wry>, window: Window<Wry>, url: &str) -> Result<(), String> {
    // spawn in a new window we use for oauth
    let oauth_window = tauri::WindowBuilder::new(
        &handle,
        "oauth-window",
        tauri::WindowUrl::External(url.to_string().parse().unwrap()),
    )
    .focused(true)
    .resizable(false)
    .closable(true)
    .build()
    .map_err(|err| err.to_string())?;

    start_with_config(
        OauthConfig {
            ports: Some(vec![10000]),
            response: None,
        },
        move |callback| {
            // close the window and send another event when we get the callback
            let result = oauth_window.close();
            if result.is_err() {
                let _ = dbg!(result.err().unwrap());
            }
            let result = window.emit("oauth-received", callback);
            if result.is_err() {
                let _ = dbg!(result.err().unwrap());
            }
        },
    )
    .map_err(|err| err.to_string())?;

    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![do_oauth])
        .setup(|app| {
            for w in app.windows().values() {
                set_shadow(&w, true).unwrap();
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
