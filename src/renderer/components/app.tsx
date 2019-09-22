import React from 'react';
import url from 'url';
import fs from 'fs';
import os from 'os';

import '@public/style.sass';
import {PythonShell} from 'python-shell';
import {dialog} from 'electron';

interface IState {
  input: string;
  queue: any[];
  isMenuOpen: boolean;
  isDownloading: boolean;
  downloadLocation: string;
}

export default class App extends React.Component<{}, IState> {
  state: IState = {
    input: '',
    queue: [],
    isMenuOpen: true,
    isDownloading: false,
    downloadLocation: '',
  };

  // Gets invoked when clicked on 'Download Songs'
  executePython(file: string): void {
    const python = new PythonShell(`src/renderer/components/${file}.py`, {
      args: [`${this.state.downloadLocation}`],
    });

    python.send(JSON.stringify(this.state.queue));

    // Gets invoked when Python prints something
    python.on('message', (output: string) => {
      // Reads Python print statements as output
      console.log(output);
    });

    // Gets invoked when the script is done
    python.end((error: Error, code: number, signal: string) => {
      if (error) throw error;
      this.setState({isDownloading: false});
      console.log('Python script has finished');
    });
  }

  // Adds to queue if input isnt empty or already exists
  addToQueue(userInput: string): void {
    const {queue, input} = this.state;

    if (input.trim() === '') {
      // Todo: make an <p> element appear for X seconds displaying error
      return;
    }

    const videoId: string | null = new URL(userInput).searchParams.get('v');

    for (let i in queue) {
      if (queue[i].id === videoId) {
        // Todo: make an <p> element appear for X seconds displaying error
        return;
      }
    }

    this.fetchVideoData(userInput).then((json: any) =>
      this.setState(prevState => ({
        input: '',
        queue: [
          ...prevState.queue,
          {
            id: json.items[0].id,
            title: json.items[0].snippet.title,
            views: json.items[0].statistics.viewCount,
          },
        ],
      }))
    );
  }

  // Removes clicked items from the queue if the song id matches
  removeFromQueue(id: string): void {
    const formattedQueue: object[] = this.state.queue.filter(song => song.id !== id);

    this.setState({queue: formattedQueue});
  }

  // Gets data from the Google data Api & returns a resolved promise
  fetchVideoData(userInput: string): Promise<object | void> {
    const videoUrl = new URL(userInput);
    const videoId: string | null = videoUrl.searchParams.get('v');
    const videoList: string | null = videoUrl.searchParams.get('list');
    const videoIndex: string | null = videoUrl.searchParams.get('index');
    const apiKey = 'AIzaSyDqFA2ZNO0ijoxAWW4Xf_eOJYlGkHctJkU';
    const toFetchUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&fields=items(id,snippet(title),statistics)&part=snippet,statistics`;

    return Promise.resolve(fetch(toFetchUrl).then(response => response.json()));
  }

  render() {
    const {input, queue, isDownloading, downloadLocation} = this.state;

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
            <button className="add-to-list" onClick={() => this.addToQueue(input)}>
              Add to queue
            </button>
            <button
              className={`${
                isDownloading || downloadLocation === '' ? 'inactive ' : ''
              } download-button`}
              onClick={() => {
                this.setState({isDownloading: true});
                this.executePython('downloader');
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
                queue: [],
              })
            }
          >
            Clear queue
          </button>
          <ul>
            {queue.map((song, index) => (
              <li key={song.id} onClick={event => this.removeFromQueue(song.id)}>
                <span>{song.title}</span>
                <span>❌</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
