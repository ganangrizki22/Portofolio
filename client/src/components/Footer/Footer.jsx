import useFetch from "../../hooks/useFetch.js";
import { getProfile } from "../../services/api.js";
import Spotify from "../Spotify/Spotify.jsx";

function Footer() {
  const { data: profile } = useFetch(getProfile, []);
  const year = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="container text-center py-4 d-flex flex-column align-items-center">
        <Spotify />
        <p className="mb-0 small">
          oleh {profile?.name || "Portofolio Pribadi"} &copy; {year}
        </p>
      </div>
    </footer>
  );
}

export default Footer;
