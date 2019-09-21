import React from 'react';
import fs from 'fs';
import os from 'os';

import '@public/style.sass';
import {PythonShell} from 'python-shell';
const {dialog} = require('electron').remote;

interface IState {
  input: string;
  songs: string[];
  isMenuOpen: boolean;
  isDownloading: boolean;
  downloadLocation: string;
}

export default class App extends React.Component<{}, IState> {
  state: IState = {
    input: '',
    songs: [],
    isMenuOpen: true,
    isDownloading: false,
    downloadLocation: '',
  };

  // Gets invoked when clicked on 'Download Songs'
  executeDownloader() {
    const python = new PythonShell('src/renderer/components/downloader.py', {
      args: [`${this.state.downloadLocation}`],
    });

    python.send(JSON.stringify(this.state.songs));

    // Gets invoked when Python prints something
    python.on('message', pythonOutput => {
      console.log(pythonOutput);
    });

    // Gets invoked when the script is done
    python.end((err, code, signal) => {
      if (err) throw err;
      this.setState({isDownloading: false});
      console.log('Python script has finished');
    });
  }

  // Adds to queue if input isnt empty or already exists
  addToQueue() {
    const {songs, input} = this.state;
    if (songs.includes(input) || input.trim() === '') return;
    this.setState(prevState => ({
      input: '',
      songs: [...songs, prevState.input],
    }));
  }

  // Removes clicked items from the queue
  removeFromQueue(event: React.MouseEvent<HTMLElement>) {
    const {songs} = this.state;
    const target = event.target as HTMLElement;
    const textNode: string = target.innerText;
    const newState: string[] = songs.filter(song => song !== textNode);

    this.setState({
      songs: newState,
    });
  }

  render() {
    const {input, songs, isDownloading, downloadLocation} = this.state;

    return (
      <div className="container">
        <div className="main">
          <h1>Youtube Downloader</h1>
          <div className="settings">
            <h3>Choose your download folder</h3>
            <button
              onClick={() =>
                this.setState({
                  downloadLocation: dialog.showOpenDialog({
                    properties: ['openDirectory'],
                  })[0],
                })
              }
            >
              Choose download folder
            </button>
            <h4>Selected folder: {downloadLocation === '' ? 'None :(' : downloadLocation}</h4>
          </div>
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
            <button className="add-to-list" onClick={() => this.addToQueue()}>
              Add to download list
            </button>
            <button
              className={`${
                isDownloading || downloadLocation === '' ? 'inactive ' : ''
              } download-button`}
              onClick={() => {
                this.setState({isDownloading: true});
                this.executeDownloader();
              }}
            >
              Download Songs
            </button>
          </div>
        </div>
        <div className="queue">
          <h3>Current downloading queue:</h3>
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
            {songs.map((song, index) => (
              <li key={song} onClick={event => this.removeFromQueue(event)}>
                <span>{song}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
