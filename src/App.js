import './App.css';
import React, { Component } from 'react';
import Spotify from 'spotify-web-api-js';
import axios from "axios";

import Navbar from './components/layout/Navbar';
import Index from './components/layout/Index';
import Lyrics from './components/tracks/Lyrics';
import { Provider } from './context';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const spotifyWebApi = new Spotify();
const axios1 = require('axios').default;
const { v4: uuidv4 } = require('uuid');

class App extends Component { 
  constructor(){
    super();
    const params = this.getHashParams();
    this.state = {
      loggedIn: params.access_token ? true : false,
      nowPlaying: {
        name: '',
        artistName: '',
        artistId: '',
        album: '',
        image: '',
        id: '',
        lyrics: '',
        
      }
    }
    if (params.access_token){
      spotifyWebApi.setAccessToken(params.access_token)
    }
  }

  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
   return hashParams;
  }

  getNowPlaying() {
    spotifyWebApi.getMyCurrentPlaybackState()
      .then((response) => {
        this.setState({
          nowPlaying: {
            name: response.item.name ,
            artistName: response.item.artists[0].name ,
            artistId: response.item.artists[0].id,
            image: response.item.album.images[0].url,
            album: response.item.album.name,
            id: '',
            lyrics: ''
          }
        });
      })
  }

  getArtTopTracks() {
    spotifyWebApi.getArtistTopTracks(this.state.nowPlaying.artistId,'CL')
      .then((response) => {
        console.log(response)
      })
  }

  getTrackId() {
    axios
      .get(`http://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/track.search?q_artist=${this.state.nowPlaying.artistName}&q_track=${this.state.nowPlaying.name}&f_has_lyrics=1&page_size=1&page=1&s_track_rating=desc&apikey=f08994772eed4c6e7bc9b01e7b8fc06b`)
      .then((res) => {
        this.setState({
          nowPlaying:{
            name: this.state.nowPlaying.name ,
            artistName: this.state.nowPlaying.artistName ,
            artistId: this.state.nowPlaying.artistId,
            image: this.state.nowPlaying.image,
            album: this.state.nowPlaying.album,
            id: res.data.message.body.track_list[0].track.track_id,
            lyrics: '',
            check: 'Loaded!'
          }
        })
      })
      .catch(err => console.log(err));
  }

  getLyrics() {
    axios
      .get(`http://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${this.state.nowPlaying.id}&apikey=f08994772eed4c6e7bc9b01e7b8fc06b`)
      .then((res) => {
        this.setState({
          nowPlaying:{
            name: this.state.nowPlaying.name ,
            artistName: this.state.nowPlaying.artistName ,
            artistId: this.state.nowPlaying.artistId,
            image: this.state.nowPlaying.image,
            album: this.state.nowPlaying.album,
            id: this.state.nowPlaying.id,
            lyrics: res.data.message.body.lyrics.lyrics_body
          }
        })
      })
      .catch(err => console.log(err));
  }
  
  getTranslatedLyrics() {
    axios1({
      baseURL: 'https://api.cognitive.microsofttranslator.com/',
      url: '/translate',
      method: 'post',
      headers: {
        'Ocp-Apim-Subscription-Key': 'fa3544f1b7e54202abd496560e981eea',
        'Ocp-Apim-Subscription-Region': 'global',
        'Content-type': 'application/json',
        'X-ClientTraceId': uuidv4().toString()
      },
      params: {
        'api-version': '3.0',
        'to': ['es']
      },
      data: [{
        'text': `${this.state.nowPlaying.lyrics}`
      }],
      responseType: 'json'
    }).then((res) => {
      this.setState({
        nowPlaying:{
          name: this.state.nowPlaying.name ,
          artistName: this.state.nowPlaying.artistName ,
          artistId: this.state.nowPlaying.artistId,
          image: this.state.nowPlaying.image,
          album: this.state.nowPlaying.album,
          id: this.state.nowPlaying.id,
          lyrics: this.state.nowPlaying.lyrics,
          translatedLyrics: res.data[0].translations[0].text
        }
      })
    })
    .catch(err => console.log(err));
  }

  render() {
    return (
      <Provider>
        <Router>
          <React.Fragment>
            <Navbar />
            <div className="container" style={{marginTop: 20 ,alignItems: 'center'}}>
              <div className='card card-body mb-4 p-5'>
                <br/>
                <a href='http://localhost:8888'>
                  <button className="btn btn-dark">Login with Spotify</button>
                </a><br/>
                
                <p className= "card-text">
                  <img src={ this.state.nowPlaying.image } style={{float:'left', width: 300, marginRight: 50}}/>
                  <span style={{alignItems:'center'}}>
                    <h5>{this.state.nowPlaying.name}</h5>
                    <strong><i className= "fas fa-user"></i> Artist</strong>: {this.state.nowPlaying.artistName}<br/>
                    <strong><i className= "fas fa-compact-disc"></i> Album</strong>: {this.state.nowPlaying.album}<br/><br/>
                    <button className="btn btn-primary mb-5 align-middle" onClick={() => this.getNowPlaying()}>Get Track</button><br/>
                    <button className="btn btn-primary" onClick={() => this.getTrackId()}>musixmatch check</button><span>   {this.state.nowPlaying.check}</span><br/><br/>
                  </span>
                </p><br/><br/>

                <p className= "card-text">
                  <button className="btn btn-dark" onClick={() => this.getLyrics()}> Get Lyrics!</button><br/><br/>
                  <strong><div> {this.state.nowPlaying.lyrics}</div></strong><br/><br/>

                  <button className="btn btn-dark" onClick={() => this.getTranslatedLyrics()}>Get Translated Lyrics!</button><br/><br/>
                  <strong><div> {this.state.nowPlaying.translatedLyrics}</div></strong><br/><br/>
                </p>

              </div>
              
              <button onClick={() => this.getArtTopTracks()} hidden>Get Artist Top Tracks</button><br></br><br></br>
              <Switch>
                <Route exact path="/" component={Index} />
                <Route exact path="/lyrics/track/:id" component={Lyrics} />
              </Switch>
              <br/>
            </div>
          </React.Fragment>
        </Router>
      </Provider>
    )
  }
}

export default App;
