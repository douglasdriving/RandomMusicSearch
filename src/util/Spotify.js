const clientId = 'd6ca8adb5dd047ffba15f15ca9995231';
const redirectURI = (window.location.toString().includes('localhost:3000')) ? 'http://localhost:3000/' : 'https://randomplaylist.netlify.app/';
let accessToken;

let Spotify = {

  getAccessToken: async () => {
    // console.log('getting an access token');
    if (accessToken) {
      //console.log('aldreay exists, returning ', accessToken);
      return accessToken;
    }
    else {
      const url = window.location.href;
      const token = url.match(/access_token=([^&]*)/);
      const expiresIn = url.match(/expires_in=([^&]*)/);
      if (token && expiresIn) {
        accessToken = token[1];
        window.setTimeout(() => accessToken = '', expiresIn[1] * 1000);
        window.history.pushState('Access Token', null, '/');
        // console.log('found access token in URL and setting it to:', accessToken);
        // console.log('expires in: ', expiresIn[1]);
      }
      else {
        // console.log('did not find a token, so redirecting');
        window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`
      }
    }
  },

  search: async searchTerm => {
    const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`,
      {
        method: "GET",
        headers: {
          Authorization: 'Bearer ' + accessToken
        },
      })

    const responseJSON = await response.json();
    if (!response.ok) {
      console.error('could not get search results: ', responseJSON.error);
      return;
    }

    // console.log('responseJson:', responseJSON);
    // console.log('response:', response);
    // console.log('tracks:', responseJSON.tracks.items);

    const tracks = await responseJSON.tracks.items.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      uri: track.uri,
    }));

    //console.log('crafted search results to return: ', tracks);

    return tracks;
  },

  savePlaylist: async (playlistName, trackURIs) => {

    if (!playlistName || !trackURIs) return;
    const headers = { Authorization: 'Bearer ' + accessToken };

    //GET USER ID
    let uid = '';
    const uidResponse = await fetch(`https://api.spotify.com/v1/me`,
      {
        method: "GET",
        headers: headers
      })

    const uidResponseJSON = await uidResponse.json();
    if (!uidResponse.ok) {
      console.error('could not get search results: ', uidResponseJSON.error);
      return;
    }

    console.log('found user id: ', uidResponseJSON.id);
    uid = uidResponseJSON.id;

    //CREATE A PLAYLIST
    const createPlaylistResponse = await fetch(`https://api.spotify.com/v1/users/${uid}/playlists`,
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ name: playlistName })
      })
    const createPlaylistResponseJson = await createPlaylistResponse.json();
    if (!createPlaylistResponse.ok) {
      console.error('could not create new playlist: ', createPlaylistResponseJson);
      return;
    }
    let playlistId = createPlaylistResponseJson.id;
    console.log('created playlist with id: ', playlistId);

    //SAVE TRACKS TO PLAYLIST
    const saveTracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ uris: trackURIs })
      })
    const saveTracksResponseJson = await saveTracksResponse.json();
    if (!saveTracksResponse.ok) {
      console.error('could not create new playlist: ', saveTracksResponseJson);
      return;
    }
    playlistId = saveTracksResponseJson.id;
    console.log('added tracks to playlist: ', saveTracksResponseJson);
  }
};

Spotify.getAccessToken();
export { Spotify };