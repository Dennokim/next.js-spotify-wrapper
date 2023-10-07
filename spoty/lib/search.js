// lib/search.js
async function searchSpotify(query, accessToken) {
    const url = `https://api.spotify.com/v1/search?q=${query}&type=artist,track,album,playlist`;
  
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error(`Error searching Spotify: ${response.statusText}`);
    }
  }
  
  export { searchSpotify };
  