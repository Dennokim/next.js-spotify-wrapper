import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const SPOTIFY_API_ENDPOINT = "https://api.spotify.com/v1/me/playlists";

export default function profile() {
  const { data: session } = useSession();
  const [playlists, setPlaylists] = useState([]);
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    async function f() {
      if (session && session.accessToken) {
        // Set the access token
        setAccessToken(session.accessToken);

        // Get the user's playlists
        const response = await fetch(SPOTIFY_API_ENDPOINT, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPlaylists(data.items);
        } else {
          console.log("Error fetching playlists:", response.statusText);
        }
      }
    }

    f();
  }, [session]);

  return (
    <main className="">
      <div className="">
        <div>access Token: {accessToken}</div>
        <div>Playlists:</div>
        <ul>
          {playlists.map((playlist) => (
            <li key={playlist.id}>{playlist.name}</li>
          ))}
        </ul>
      </div>
    </main>
  );
}
