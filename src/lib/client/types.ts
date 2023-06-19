function convertUri(uri) {
    return uri.split(":")[2];
}

export type Track = {
    id: string;
    name: string;
    artists: Artist[];
    album: Album;
};

export function convertTrack(convert: Spotify.Track): Track {
    return {
        id: convertUri(convert.uri),
        name: convert.name,
        artists: convert.artists.map(convertArtist),
        album: convertAlbum(convert.album),
    };
}

export type Artist = {
    id: string;
    name: string;
    images: Image[];
};

export function convertArtist(convert: Spotify.Entity) {
    return {
        id: convertUri(convert.uri),
        name: convert.name,
        images: [],
    };
}

export type Album = {
    id: string;
    name: string;
    images: Image[];
};

export function convertAlbum(convert: Spotify.Album): Album {
    return {
        id: convertUri(convert.uri),
        name: convert.name,
        images: convert.images.map(convertImage),
    };
}

export type Image = {
    url: string;
};

export function convertImage(convert: Spotify.Image): Image {
    return {
        url: convert.url,
    };
}
