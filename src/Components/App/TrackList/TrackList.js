import React from 'react';
import { Track } from '../Track/Track';
import './TrackList.css';

export class TrackList extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
      <div className='TrackList'>
        {(this.props.tracks && Array.isArray(this.props.tracks)) ?
          this.props.tracks.map(track =>
            {
              //console.log('adding track: ', track);
              return <Track
                key={track.id}
                track={track}
                onAdd={this.props.onAdd}
                onRemove={this.props.onRemove}
                isRemoval={this.props.isRemoval}
              />;
          }
          )
          : console.log('could not render any tracks. This.props.tracks:', this.props.tracks.PromiseResult)
        }
      </div>
    );
  }
}