import React from 'react';
import readline from 'readline';
import fs from 'fs';
import os from 'os';

import {PythonShell} from 'python-shell';
import '@public/style.sass';

interface IState {
  input: string;
  songs: string[];
  isMenuOpen: boolean;
}

export default class App extends React.Component<{}, IState> {
  public state: IState = {
    input: '',
    songs: ['hello'],
    isMenuOpen: false,
  };

  componentDidMount(): void {
    const songsArray: string[] = fs
      .readFileSync('songs.txt', 'utf8')
      .split('\n');

    this.setState(prevState => ({
      songs: [...songsArray, ...prevState.songs],
    }));
  }

  render() {
    const {input, songs} = this.state;

    return (
      <div className="container">
        <header>
          <div className="given-songs">
            <h4>Current downloading queue:</h4>
            <ul>
              {songs.map(song => {
                return <li key={song}>{song}</li>;
              })}
            </ul>
          </div>
          <div className="settings">
            <button>
              <img
                src={require('@public/assets/svg/settings.svg')}
                alt="settings"
                onClick={e =>
                  this.setState({isMenuOpen: !this.state.isMenuOpen})
                }
              />
            </button>
            <div className={this.state.isMenuOpen ? 'open' : 'closed'}>
              <ul>
                <li>Choose download folder</li>
              </ul>
            </div>
          </div>
        </header>
        <div className="main">
          <h1>Youtube Downloader</h1>
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
                // Python reads songs.txt and handles the downloading part
                PythonShell.run(
                  'src/renderer/components/downloader.py',
                  {},
                  (error?: any) => {
                    if (error) throw error;
                  }
                )
              }
            >
              Download Songs
            </button>
          </div>
        </div>
      </div>
    );
  }
}
