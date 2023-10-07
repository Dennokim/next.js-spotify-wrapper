import { useState } from "react";
import { useSession } from "next-auth/react";
import { searchSpotify } from "../lib/search";

export default function DisplaySearch() {
  const { data: session } = useSession();
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    try {
      const data = await searchSpotify(query, session.accessToken);
      setSearchResults(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Spotify Search</h1>
      <input
        type="text"
        placeholder="Search for artists, tracks, albums, or playlists"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {error && <p>Error: {error}</p>}

      <div>
        {searchResults && searchResults.tracks && (
          <div>
            <h2>Tracks</h2>
            {searchResults.tracks.items.map((track) => (
              <div key={track.id}>
                <img
                  src={track.album.images[0].url}
                  alt="Track cover"
                  width={100}
                  height={100}
                />
                <p>{track.name}</p>
              </div>
            ))}
          </div>
        )}

        {searchResults && searchResults.artists && (
          <div>
            <h2>Artists</h2>
            {searchResults.artists.items.map((artist) => (
              <div key={artist.id}>
                {artist.images && artist.images.length > 0 && (
                  <img
                    src={artist.images[0].url}
                    alt="Artist profile"
                    width={100}
                    height={100}
                  />
                )}
                <p>{artist.name}</p>
              </div>
            ))}
          </div>
        )}

        {searchResults && searchResults.albums && (
          <div>
            <h2>Albums</h2>
            {searchResults.albums.items.map((album) => (
              <div key={album.id}>
                <img
                  src={album.images[0].url}
                  alt="Album cover"
                  width={100}
                  height={100}
                />
                <p>{album.name}</p>
              </div>
            ))}
          </div>
        )}

        {searchResults && searchResults.playlists && (
          <div>
            <h2>Playlists</h2>
            {searchResults.playlists.items.map((playlist) => (
              <div key={playlist.id}>
                <img
                  src={playlist.images[0].url}
                  alt="Playlist cover"
                  width={100}
                  height={100}
                />
                <p>{playlist.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
