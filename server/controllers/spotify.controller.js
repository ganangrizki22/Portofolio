const crypto = require("crypto");

// ============================================================
// Integrasi Spotify "Now Playing" (OAuth 2.0 Authorization Code + PKCE)
//
// Kenapa PKCE, bukan Client Secret biasa?
// Karena kita cuma punya Client ID. PKCE memang didesain untuk
// public client seperti ini -- refresh token yang dihasilkan tetap
// bisa dipakai ulang (di-refresh) hanya dengan Client ID, tanpa secret.
//
// Alur satu kali (dilakukan manual oleh pemilik portofolio):
// 1. Buka GET /api/spotify/login di browser -> redirect ke Spotify.
// 2. Login & authorize di Spotify -> Spotify redirect balik ke
//    GET /api/spotify/callback dengan ?code=...
// 3. Callback menukar code -> access_token + refresh_token, lalu
//    menampilkan refresh_token di layar.
// 4. Refresh token itu ditempel ke server/.env (SPOTIFY_REFRESH_TOKEN)
//    lalu server di-restart. Setelah itu widget jalan otomatis,
//    karena access_token baru selalu diminta ulang pakai refresh_token.
// ============================================================

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
const SCOPE = "user-read-currently-playing user-read-recently-played";

// Menyimpan code_verifier sementara di memori server, dibutuhkan lagi
// saat Spotify redirect balik ke /callback. Cukup untuk pemakaian
// satu-orang (bukan aplikasi multi-user).
let pendingCodeVerifier = null;

// Cache access_token supaya tidak minta token baru di setiap request.
let cachedAccessToken = null;
let cachedAccessTokenExpiresAt = 0; // epoch ms

function base64url(buffer) {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function generatePkcePair() {
  const codeVerifier = base64url(crypto.randomBytes(32));
  const codeChallenge = base64url(
    crypto.createHash("sha256").update(codeVerifier).digest()
  );
  return { codeVerifier, codeChallenge };
}

function isSpotifyConfigured() {
  return Boolean(SPOTIFY_CLIENT_ID && SPOTIFY_REDIRECT_URI);
}

// GET /api/spotify/login
// Mulai proses otorisasi. Buka endpoint ini langsung di browser.
function login(req, res) {
  if (!isSpotifyConfigured()) {
    return res
      .status(500)
      .send("SPOTIFY_CLIENT_ID / SPOTIFY_REDIRECT_URI belum diatur di server/.env");
  }

  const { codeVerifier, codeChallenge } = generatePkcePair();
  pendingCodeVerifier = codeVerifier;

  const params = new URLSearchParams({
    response_type: "code",
    client_id: SPOTIFY_CLIENT_ID,
    scope: SCOPE,
    redirect_uri: SPOTIFY_REDIRECT_URI,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
  });

  res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
}

// GET /api/spotify/callback
// Dipanggil otomatis oleh Spotify setelah user login & authorize.
async function callback(req, res) {
  const { code, error } = req.query;

  if (error) {
    return res.status(400).send(`Otorisasi Spotify gagal: ${error}`);
  }
  if (!code) {
    return res.status(400).send("Parameter 'code' tidak ditemukan pada callback.");
  }
  if (!pendingCodeVerifier) {
    return res
      .status(400)
      .send("Sesi login kedaluwarsa. Buka /api/spotify/login lagi dari awal.");
  }

  try {
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: SPOTIFY_REDIRECT_URI,
      client_id: SPOTIFY_CLIENT_ID,
      code_verifier: pendingCodeVerifier,
    });

    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    const tokenData = await tokenRes.json();
    pendingCodeVerifier = null;

    if (!tokenRes.ok) {
      return res
        .status(400)
        .send(`Gagal menukar token: ${tokenData.error_description || tokenData.error}`);
    }

    // Cache access token yang baru didapat supaya langsung bisa dipakai.
    cachedAccessToken = tokenData.access_token;
    cachedAccessTokenExpiresAt = Date.now() + tokenData.expires_in * 1000;

    res.send(`
      <div style="font-family: sans-serif; max-width: 640px; margin: 40px auto; line-height: 1.6;">
        <h2>Berhasil terhubung ke Spotify ✅</h2>
        <p>Salin <strong>refresh token</strong> di bawah ini, lalu tempel ke file
        <code>server/.env</code> pada variabel <code>SPOTIFY_REFRESH_TOKEN</code>,
        kemudian restart server.</p>
        <textarea readonly style="width:100%; height:100px; font-family: monospace; padding:8px;">${tokenData.refresh_token}</textarea>
        <p>Setelah itu, widget "Now Playing" di portofolio akan otomatis aktif.</p>
      </div>
    `);
  } catch (err) {
    res.status(500).send(`Terjadi kesalahan: ${err.message}`);
  }
}

// Mengambil access_token yang valid, refresh otomatis jika perlu.
// Dipakai secara internal oleh getNowPlaying, bukan sebagai route.
async function getValidAccessToken() {
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!refreshToken) {
    return null; // belum pernah login/otorisasi
  }

  if (cachedAccessToken && Date.now() < cachedAccessTokenExpiresAt - 5000) {
    return cachedAccessToken;
  }

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: SPOTIFY_CLIENT_ID,
  });

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const tokenData = await tokenRes.json();

  if (!tokenRes.ok) {
    throw new Error(tokenData.error_description || "Gagal refresh access token Spotify");
  }

  cachedAccessToken = tokenData.access_token;
  cachedAccessTokenExpiresAt = Date.now() + tokenData.expires_in * 1000;

  return cachedAccessToken;
}

// GET /api/spotify/now-playing
// Dipanggil dari frontend (widget), di-poll berkala.
async function getNowPlaying(req, res, next) {
  try {
    if (!isSpotifyConfigured()) {
      return res.json({ success: true, data: { configured: false } });
    }

    const accessToken = await getValidAccessToken();
    if (!accessToken) {
      return res.json({ success: true, data: { configured: false } });
    }

    const headers = { Authorization: `Bearer ${accessToken}` };

    // 1. Coba ambil lagu yang sedang diputar.
    const nowRes = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      { headers }
    );

    if (nowRes.status === 200) {
      const nowData = await nowRes.json();
      if (nowData && nowData.item) {
        return res.json({
          success: true,
          data: {
            configured: true,
            isPlaying: Boolean(nowData.is_playing),
            title: nowData.item.name,
            artist: nowData.item.artists.map((a) => a.name).join(", "),
            albumArt: nowData.item.album?.images?.[0]?.url || null,
            trackUrl: nowData.item.external_urls?.spotify || null,
          },
        });
      }
    }

    // 2. Tidak ada yang sedang diputar -> tampilkan lagu terakhir didengarkan.
    const recentRes = await fetch(
      "https://api.spotify.com/v1/me/player/recently-played?limit=1",
      { headers }
    );
    const recentData = await recentRes.json();
    const lastItem = recentData?.items?.[0]?.track;

    if (lastItem) {
      return res.json({
        success: true,
        data: {
          configured: true,
          isPlaying: false,
          title: lastItem.name,
          artist: lastItem.artists.map((a) => a.name).join(", "),
          albumArt: lastItem.album?.images?.[0]?.url || null,
          trackUrl: lastItem.external_urls?.spotify || null,
        },
      });
    }

    res.json({ success: true, data: { configured: true, isPlaying: false } });
  } catch (err) {
    next(err);
  }
}

module.exports = { login, callback, getNowPlaying };
