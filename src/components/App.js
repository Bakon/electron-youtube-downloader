import React, {useState} from 'react';
import '../App.sass';

// window.require because we're using React with Webpack
const fs = window.require('fs');
const os = window.require('os');
const child_process = window.require('child_process');

export default function App() {
  const [input, setInput] = useState('');

  return (
    <div className="container">
      <h1>Youtube Downloader</h1>
      <div className="user-options">
        <div className="user-input">
          <label htmlFor="music-input">Enter song(s):</label>
          <input
            type="text"
            name="music-input"
            value={input}
            placeholder="Enter YouTube video URL here..."
            onChange={event => setInput(event.target.value)}
          />
        </div>
        <div className="button-wrapper">
          <button
            className="add-to-list"
            onClick={e => {
              fs.appendFile('./songs.txt', input + os.EOL, err => {
                if (err) throw err;
              });
              setInput('');
            }}
          >
            Add to download list
          </button>
          <button
            className="download-button"
            onClick={e =>
              child_process.execSync('python3 downloader.py songs.txt')
            }
          >
            Download Songs
          </button>
        </div>
      </div>
    </div>
  );
}
