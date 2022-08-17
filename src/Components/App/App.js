import React from 'react';
import './App.css';
import { SearchBar } from './SearchBar/SearchBar.js';
import { SearchResults } from './SearchResults/SearchResults.js';
import { Playlist } from './Playlist/Playlist.js';
import { Spotify } from '../../util/Spotify';
import { GetRandomWord } from '../../util/RandomWord';


export class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: '',
      playlistTracks: []
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.randomizePlaylist = this.randomizePlaylist.bind(this);
  }

  addTrack(track) {
    let trackIsNew = true;
    this.state.playlistTracks.forEach(playlistTrack => {
      if (playlistTrack.id === track.id) {
        trackIsNew = false;
      }
    })

    if (trackIsNew) {
      const updatedPlaylist = this.state.playlistTracks;
      updatedPlaylist.push(track);
      this.setState({ playlistTracks: updatedPlaylist });
    }
  }

  removeTrack(track) {
    this.state.playlistTracks.forEach((playlistTrack, i) => {
      if (playlistTrack.id === track.id) {
        const updatedPlaylist = this.state.playlistTracks;
        updatedPlaylist.splice(i, 1);
        this.setState(updatedPlaylist);
      }
    })
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name });
    //console.log('playlist name change to: ', name);
  }

  async savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    await Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.setState({ playlistName: 'New Playlist' });
  }

  async search(searchTerm) {
    const results = await Spotify.search(searchTerm);
    //console.log('searched for ', searchTerm, 'and got results ', results);
    this.setState({ searchResults: results });
  }

  async randomizePlaylist() {

    //CLEAR PLAYLIST
    this.setState({ playlistTracks: [] })

    //GET A RANDOM SEARCH TERM
    const searchTerm = await GetRandomWord();

    //CHANGE PLAYLIST NAME USING SEARCH TERM
    this.updatePlaylistName('Songs of the ' + (searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1)));

    //GET A SET OF TRACKS USING THE SEARCH TERM
    const tracks = await Spotify.search(searchTerm);

    //ADD EACH TRACK TO THE PLAYLIST
    tracks.forEach(track => {
      this.addTrack(track);
    });

  }

  render() {
    return (
      <div className='page'>
        <div className='header'>
          <h1>Playlist <span className="highlight">Random</span>izer</h1>
        </div>
        <div className="App">
          <Playlist
            playlistName={this.state.playlistName}
            playlistTracks={this.state.playlistTracks}
            onRemove={this.removeTrack}
            onNameChange={this.updatePlaylistName}
            onSave={this.savePlaylist}
            onRandomize={this.randomizePlaylist}
          />
        </div>
      </div>
    )
  }

  //RENDER WITH SEARCH BOX ETC
  // render() {
  //   return (
  //     <div>
  //       <div className='header'>
  //         <h1>Playlist <span className="highlight">Random</span>izer</h1>
  //         <h3>Generate spotify playlists based on a random word!</h3>
  //       </div>
  //       <div className="App">
  //         <SearchBar
  //           onSearch={this.search}
  //         />
  //         <div className="App-playlist">
  //           <SearchResults
  //             searchResults={this.state.searchResults}
  //             onAdd={this.addTrack}
  //           />
  //           <Playlist
  //             playlistName={this.state.playlistName}
  //             playlistTracks={this.state.playlistTracks}
  //             onRemove={this.removeTrack}
  //             onNameChange={this.updatePlaylistName}
  //             onSave={this.savePlaylist}
  //             onRandomize={this.randomizePlaylist}
  //           />
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

}

export default App;