import React from 'react';
import { TrackList } from '../TrackList/TrackList';
import './Playlist.css';

export class Playlist extends React.Component {

  constructor(props) {
    super(props);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  handleNameChange(e) {
    this.props.onNameChange(e.target.value);
  }

  render() {
    return (
      <div id='playlistContainer'>
        <div className='buttonContainer'>
          <button className="randomize" onClick={this.props.onRandomize}>RANDOMIZE</button>
          <button className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</button>
        </div>
        <div className="Playlist">
          <h2>{this.props.playlistName}</h2>
          {/* <input value={this.props.playlistName} onChange={this.handleNameChange} /> */}
          <TrackList tracks={this.props.playlistTracks} onRemove={this.props.onRemove} isRemoval={true} />
        </div>
      </div>
    );
  }
}