import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function TopTracks() {
  const { data: session } = useSession();
  const [topTracksData, setTopTracks] = useState([]);
  const [topArtistsData, setTopArtists] = useState([]);
  const [timeRange, setTimeRange] = useState("short_term");
  const [topAlbumsData, setTopAlbums] = useState([]);

  // Define the fetchTopTracks function outside the useEffect
  async function fetchTopTracks() {
    if (session && session.accessToken) {
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );
        if (response.ok) {
          const topTracksData = await response.json();
          setTopTracks(topTracksData.items);

          // Fetch album information for each track
          const trackIds = topTracksData.items
            .map((track) => track.id)
            .join(",");
          const albumsResponse = await fetch(
            `https://api.spotify.com/v1/tracks/?ids=${trackIds}`,
            {
              headers: {
                Authorization: `Bearer ${session.accessToken}`,
              },
            }
          );

          if (albumsResponse.ok) {
            const albumsData = await albumsResponse.json();
            const albumIds = albumsData.tracks
              .map((track) => track.album.id)
              .join(",");

            // Call a function to fetch the user's top albums based on albumIds
            fetchTopAlbums(albumIds);
          } else {
            console.log(
              "Error fetching albums for tracks:",
              albumsResponse.statusText
            );
          }
        } else {
          console.log("Error fetching top tracks:", response.statusText);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  async function fetchTopAlbums(albumIds) {
    if (session && session.accessToken) {
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/albums?ids=${albumIds}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );
        if (response.ok) {
          const topAlbumsData = await response.json();
          setTopAlbums(topAlbumsData.albums);
        } else {
          console.log("Error fetching top albums:", response.statusText);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  // Define the fetchTopArtists function
  async function fetchTopArtists() {
    if (session && session.accessToken) {
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );
        if (response.ok) {
          const topArtistsData = await response.json();
          setTopArtists(topArtistsData.items);
        } else {
          console.log("Error fetching top artists:", response.statusText);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  useEffect(() => {
    // Call fetchTopTracks and fetchTopArtists when the session changes or the timeRange changes
    fetchTopTracks();
    fetchTopArtists();
  }, [session, timeRange]);

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  return (
    <div>
      <h1>Top Tracks</h1>
      <div>
        <label htmlFor="timeRange">Select Time Range:</label>
        <select
          id="timeRange"
          onChange={handleTimeRangeChange}
          value={timeRange}
        >
          <option value="short_term">4 Weeks</option>
          <option value="medium_term">6 Months</option>
          <option value="long_term">All Time</option>
        </select>
      </div>
      <h2>Top Tracks:</h2>
      <ul>
        {topTracksData.map((track, index) => (
          <li key={index}>
            <p>{track.name}</p>
            {track.album.images.length > 0 && (
              <img
                src={track.album.images[0].url}
                alt={`Album cover for ${track.album.name}`}
                width={100}
                height={100}
              />
            )}
          </li>
        ))}
      </ul>

      <h2>Top Artists:</h2>
      <ul>
        {topArtistsData.map((artist, index) => (
          <li key={index}>
            <p>{artist.name}</p>
            {artist.images.length > 0 && (
              <img
                src={artist.images[0].url}
                alt={`Image of ${artist.name}`}
                width={100}
                height={100}
              />
            )}
          </li>
        ))}
      </ul>

      <h2>Top Albums:</h2>
      <ul>
        {topAlbumsData.map((album, index) => (
          <li key={index}>
            <p>{album.name}</p>
            {album.images.length > 0 && (
              <img
                src={album.images[0].url}
                alt={`Album cover for ${album.name}`}
                width={100}
                height={100}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
