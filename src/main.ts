import {app, BrowserWindow} from 'electron';
import * as path from 'path';

let window: Electron.BrowserWindow;

function createWindow() {
  window = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
    height: 600,
    width: 800,
  });

  window.loadFile(path.join(__dirname, '../index.html'));

  window.webContents.openDevTools();

  window.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    window = null;
  });
}

// Will be called when done initializing
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

app.on('window-all-closed', () => {
  // On OS X it's common for applications to stay active in
  // the application bar until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // application icon is clicked and there are no other windows open.
  if (window === null) {
    createWindow();
  }
});
