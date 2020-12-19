import React, { Component } from 'react';
import axios from 'axios';
import Spinner from '../layout/Spinner';
import { Link } from 'react-router-dom';

class Lyrics extends Component {
    state = {
        track: {},
        lyrics: {}
    }

    componentDidMount() {
        axios.get(`http://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${this.props.match.params.id}&apikey=f08994772eed4c6e7bc9b01e7b8fc06b`)
            .then(res => {
                this.setState({ lyrics: res.data.message.body.lyrics });

                return axios.get(`http://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/track.get?track_id=${this.props.match.params.id}&apikey=f08994772eed4c6e7bc9b01e7b8fc06b`)
            })
            .then(res => {
                this.setState({ track: res.data.message.body.track });
            })
            .catch(err => console.log(err));
    }

    render() {
        const { track, lyrics } = this.state;
        if (track === undefined || lyrics === undefined || Object.keys(track).length === 0 || Object.keys(lyrics).length === 0) {
            return <Spinner />
        } else {
            return (
                <React.Fragment>
                    <Link to= '/' className='btn btn-dark btn-sm mb-4'>Go Back</Link>
                    <div className='card'>
                        <h5 className='card-header'>
                            {track.track_name} by <span className="text_secondary">{track.artist_name}</span>
                        </h5>
                        <div className="card-body">
                            <p className="card-text">{lyrics.lyrics_body}</p>
                        </div>
                    </div>
                </React.Fragment>
            )
        }
    }
}

export default Lyrics;