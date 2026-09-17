import { useEffect, useState } from "react";
import { getSpotifyNowPlaying } from "../../services/api.js";

const POLL_INTERVAL_MS = 30000;

function Spotify() {
  const [track, setTrack] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchNowPlaying = () => {
      getSpotifyNowPlaying()
        .then((data) => {
          if (isMounted) setTrack(data);
        })
        .catch(() => {
          if (isMounted) setTrack(null);
        });
    };

    fetchNowPlaying();
    const intervalId = setInterval(fetchNowPlaying, POLL_INTERVAL_MS);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  // Belum dikonfigurasi (SPOTIFY_CLIENT_ID kosong) atau belum ada
  // refresh token (pemilik belum login sekali) -> jangan tampilkan apa-apa.
  if (!track || !track.configured || !track.title) {
    return null;
  }

  const content = (
    <>
      <div className="spotify-widget-art">
        {track.albumArt ? (
          <img src={track.albumArt} alt={`${track.title} album art`} />
        ) : (
          <i className="bi bi-music-note-beamed"></i>
        )}
        {track.isPlaying && (
          <span className="spotify-widget-bars" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </span>
        )}
      </div>
      <div className="spotify-widget-info">
        <span className="spotify-widget-label">
          <i className="bi bi-spotify"></i>
          {track.isPlaying ? "Sedang diputar" : "Terakhir didengarkan"}
        </span>
        <span className="spotify-widget-title">{track.title}</span>
        <span className="spotify-widget-artist">{track.artist}</span>
      </div>
    </>
  );

  return track.trackUrl ? (
    <a
      href={track.trackUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="spotify-widget"
    >
      {content}
    </a>
  ) : (
    <div className="spotify-widget">{content}</div>
  );
}

export default Spotify;
