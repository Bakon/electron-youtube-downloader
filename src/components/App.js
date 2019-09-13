import React from 'react';
import '../App.sass';
import fs from 'fs';
import os from 'os';
import {PythonShell} from 'python-shell';

export default class App extends React.Component {
  state = {
    input: '',
    songs: [],
    isMenuOpen: false,
  };

  render() {
    const {input, songs} = this.state;

    return (
      <div className="container">
        <div className="settings">
          <div className="settings-icon">
            <img
              src={require('../assets/svg/settings.svg')}
              alt="settings"
              onClick={e => this.setState({isMenuOpen: !this.state.isMenuOpen})}
            />
          </div>
          <div className={this.state.isMenuOpen ? 'open' : 'closed'}>
            <ul>
              <li>Choose download folder</li>
              <li>Your waifu is shit</li>
              <li>Placeholder</li>
              <li>My swamp</li>
              <li>Woof</li>
            </ul>
          </div>
        </div>
        <h1>Youtube Downloader</h1>
        <div className="user-options">
          <div className="user-input">
            <label htmlFor="music-input">Enter song(s):</label>
            <input
              type="text"
              name="music-input"
              value={input}
              placeholder="Enter YouTube video URL here..."
              onChange={event => this.setState({input: event.target.value})}
            />
          </div>
          <div className="button-wrapper">
            <button
              className="add-to-list"
              onClick={e => {
                if (input.trim() === '') return;
                fs.appendFile('./songs.txt', input.trim() + os.EOL, err => {
                  if (err) throw err;
                });
                this.setState(prevState => ({
                  input: '',
                  songs: [...songs, prevState.input],
                }));
              }}
            >
              Add to download list
            </button>
            <button
              className="download-button"
              onClick={e =>
                PythonShell.run('downloader.py', null, err => {
                  if (err) throw err;
                })
              }
            >
              Download Songs
            </button>
          </div>
        </div>
        <div className="given-songs">
          <ul>
            {songs.map(song => {
              return <li key={song}>{song}</li>;
            })}
          </ul>
        </div>
      </div>
    );
  }
}
