import React from 'react';
import fs from 'fs';
import os from 'os';

import {PythonShell} from 'python-shell';
import '@public/style.sass';

interface IState {
  input: string;
  songs: string[];
  isMenuOpen: boolean;
  downloadLocation: string;
}

export default class App extends React.Component<{}, IState> {
  public state: IState = {
    input: '',
    songs: [],
    isMenuOpen: false,
    downloadLocation: '',
  };

  // Adds user input to 'downloading queue' list
  updateQueue(): void {
    const {songs, input} = this.state;

    // If the song is already in the queue, return
    if (songs.includes(input.trim()) || input.trim() === '') return;
    fs.appendFile('./songs.txt', input.trim() + os.EOL, err => {
      if (err) throw err;
    });
    this.setState(prevState => ({
      input: '',
      songs: [...songs, prevState.input],
    }));
  }

  // Removes clicked items from the queue
  removeFromQueue(event: React.MouseEvent<HTMLElement>): void {
    const {songs} = this.state;
    const target = event.target as HTMLElement;
    const textNode: string = target.innerText;
    const index: number = songs.indexOf(textNode);
    const newState: string[] = songs.filter(song => song !== textNode);

    this.setState({
      songs: newState,
    });
  }

  componentDidMount(): void {
    // Reads the text file containing the previously added songs
    const fileOutput: string[] = fs
      .readFileSync('songs.txt', 'utf8')
      .split('\n');

    this.setState(prevState => ({
      songs: [...fileOutput, ...prevState.songs],
    }));
  }

  render() {
    const {input, songs} = this.state;

    return (
      <div className="container">
        <header>
          <div className="given-songs">
            <h4>Current downloading queue:</h4>
            <button
              onClick={() =>
                this.setState({
                  songs: [],
                })
              }
            >
              Clear queue
            </button>
            <ul>
              {songs.map(song => (
                <li key={song} onClick={event => this.removeFromQueue(event)}>
                  {song}
                </li>
              ))}
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
            <button className="add-to-list" onClick={() => this.updateQueue()}>
              Add to download list
            </button>
            <button
              className="download-button"
              onClick={e =>
                // Python reads songs.txt and handles the downloading part
                // Can be given arguments to pass down the selected
                //download folder and songs.txt location
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
