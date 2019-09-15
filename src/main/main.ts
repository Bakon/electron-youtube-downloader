import {app, BrowserWindow} from 'electron';
import * as path from 'path';
import * as url from 'url';

let window: Electron.BrowserWindow | null;

function createWindow(): void {
    window = new BrowserWindow({
        height: 600,
        width: 800,
    });

    // and load the index.html of the app.
    window.loadURL(
        url.format({
            pathname: path.join(__dirname, './index.html'),
            protocol: 'file:',
            slashes: true
        })
    );

    window.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        window = null;
    });

    if (process.env.NODE_ENV === 'development') window.webContents.openDevTools();
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    // Most OS X applications stay active in the tray
    // until the user quits explicitly with Cmd + Q
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
