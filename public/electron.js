// We cannot use imports here!
const {app, BrowserWindow} = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let window;

function createWindow() {
  window = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`;

  window.loadURL(startUrl);

  if (isDev) window.webContents.openDevTools();

  window.once('ready-to-show', () => window.show());

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
