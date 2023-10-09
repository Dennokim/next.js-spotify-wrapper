import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function TopAlbums() {
  const { data: session } = useSession();
  const [topAlbums, setTopAlbums] = useState([]);
  const [timeRange, setTimeRange] = useState("short_term"); // Default time range is 4 weeks

  // Define the fetchTopAlbums function
  async function fetchTopAlbums() {
    if (session && session.accessToken) {
      try {
        // Fetch user's top tracks and artists
        const tracksResponse = await fetch(
          `https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );

        const artistsResponse = await fetch(
          `https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );

        if (tracksResponse.ok && artistsResponse.ok) {
          const tracksData = await tracksResponse.json();
          const artistsData = await artistsResponse.json();

          // Extract album IDs from top tracks and artists
          const albumIds = [
            ...new Set([
              ...tracksData.items.map((track) => track.album.id),
              ...artistsData.items.flatMap((artist) =>
                artist.albums.map((album) => album.id)
              ),
            ]),
          ];

          // Fetch album details for each album ID
          const albumDetailsPromises = albumIds.map(async (albumId) => {
            const albumResponse = await fetch(
              `https://api.spotify.com/v1/albums/${albumId}`,
              {
                headers: {
                  Authorization: `Bearer ${session.accessToken}`,
                },
              }
            );

            if (albumResponse.ok) {
              return albumResponse.json();
            } else {
              console.log(
                "Error fetching album details:",
                albumResponse.statusText
              );
              return null;
            }
          });

          const albumDetails = await Promise.all(albumDetailsPromises);

          // Set the top albums based on album details
          setTopAlbums(albumDetails.filter((album) => album !== null));
        } else {
          console.log(
            "Error fetching top tracks or artists:",
            tracksResponse.statusText,
            artistsResponse.statusText
          );
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  useEffect(() => {
    // Call fetchTopAlbums when the session changes or the timeRange changes
    fetchTopAlbums();
  }, [session, timeRange]);

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  return (
    <div>
      <h1>Top Albums</h1>
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
      <ul>
        {topAlbums.map((album, index) => (
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
