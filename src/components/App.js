import React from 'react';
import '../App.sass';

// File system & OS imports
import fs from 'fs';
import os from 'os';
import child_process from 'child_process';
const input = document.querySelector('input[type=text]');

export default function App() {
  return (
    <div className="container">
      <h1>Youtube Downloader</h1>
      <div className="user-options">
        <div className="user-input">
          <label htmlFor="music-input">Enter songs:</label>
          <input type="text" name="music-input" />
        </div>
        <div className="button-wrapper">
          <button
            className="add-to-list"
            onClick={e => {
              fs.appendFile('../songs.txt', input.value + os.EOL, err => {
                if (err) throw err;
              });
            }}
          >
            Add to download list
          </button>
          <button
            className="download-button"
            onClick={e => {
              child_process.execSync('python3 downloader.py songs.txt');
            }}
          >
            Download Songs
          </button>
        </div>
      </div>
    </div>
  );
}
