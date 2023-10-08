import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { countryCodes, genres } from "../utils/shazamCodes";
import TopTracks from "./topTracks";

export default function Profile() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState(null);
  const [shazamChartsCountry, setShazamChartsCountry] = useState([]);
  const [shazamChartsGenre, setShazamChartsGenre] = useState([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState("US"); // Default to USA
  const [selectedGenre, setSelectedGenre] = useState("HIP_HOP_RAP"); // Default to Hip-Hop/Rap

  const fetchShazamChartsCountry = async () => {
    try {
      const response = await fetch(
        `/api/shazamApi?country_code=${selectedCountryCode}`
      );
      const data = await response.json();
      setShazamChartsCountry(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchShazamChartsGenre = async () => {
    try {
      const response = await fetch(`/api/shazamApi?genre=${selectedGenre}`);
      const data = await response.json();
      setShazamChartsGenre(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    async function fetchProfile() {
      if (session && session.accessToken) {
        const profileResponse = await fetch("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setProfile(profileData);
        } else {
          console.log(
            "Error fetching user profile:",
            profileResponse.statusText
          );
        }
      }
    }

    fetchProfile();
  }, [session, selectedCountryCode, selectedGenre]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div>
          {profile && (
            <div>
              <img
                src={profile.images[0].url}
                alt="User profile"
                width={100}
                height={100}
              />
              <h2>Welcome: {profile.display_name}</h2>
              <div>Followers: {profile.followers.total}</div>
            </div>
          )}
        </div>

        <div>
          <h2>Shazam Top Tracks by Country</h2>
          <label>
            Select Country:
            <select
              value={selectedCountryCode}
              onChange={(e) => setSelectedCountryCode(e.target.value)}
            >
              {countryCodes.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.label}
                </option>
              ))}
            </select>
          </label>
          <button onClick={fetchShazamChartsCountry}>Get Top Tracks</button>

          <ul>
            {shazamChartsCountry.tracks &&
              shazamChartsCountry.tracks.map((track) => (
                <li key={track.id}>
                  <img
                    src={track.image_url} // Modify this to match the actual property in your API response
                    alt="Track cover"
                    width={100}
                    height={100}
                  />
                  <p>{track.title}</p>
                </li>
              ))}
          </ul>
        </div>

        <div>
          <h2>Shazam Top Tracks by Genre</h2>
          <label>
            Select Genre:
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              {genres.map((genre) => (
                <option key={genre.genre} value={genre.genre}>
                  {genre.label}
                </option>
              ))}
            </select>
          </label>
          <button onClick={fetchShazamChartsGenre}>Get Top Tracks</button>

          <ul>
            {shazamChartsGenre.tracks &&
              shazamChartsGenre.tracks.map((track) => (
                <li key={track.id}>
                  <img
                    src={track.image_url} // Modify this to match the actual property in your API response
                    alt="Track cover"
                    width={100}
                    height={100}
                  />
                  <p>{track.title}</p>
                </li>
              ))}
          </ul>

          <div>
            <h2>Top Tracks</h2>
            <TopTracks />
          </div>
        </div>
      </div>
    </main>
  );
}
