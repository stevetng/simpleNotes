const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});

ipcMain.on('get-notes', (event) => {
  fs.readFile(path.join(__dirname, 'notes.json'), 'utf-8', (err, data) => {
    if (err) {
      console.log("An error occurred reading the file :" + err.message);
      return;
    }

    event.sender.send('get-notes-response', JSON.parse(data));
  });
});

ipcMain.on('save-note', (event, note) => {
  fs.readFile(path.join(__dirname, 'notes.json'), 'utf-8', (err, data) => {
    if (err) {
      console.log("An error occurred reading the file :" + err.message);
      return;
    }

    let notes = JSON.parse(data);
    notes.push(note);

    fs.writeFile(path.join(__dirname, 'notes.json'), JSON.stringify(notes), (err) => {
      if (err) {
        console.log("An error occurred writing the file :" + err.message);
      }
    });
  });
});

ipcMain.on('delete-note', (event, noteId) => {
  fs.readFile(path.join(__dirname, 'notes.json'), 'utf-8', (err, data) => {
    if (err) {
      console.log("An error occurred reading the file :" + err.message);
      return;
    }

    let notes = JSON.parse(data);
    notes = notes.filter(note => note.id !== noteId);

    fs.writeFile(path.join(__dirname, 'notes.json'), JSON.stringify(notes), (err) => {
      if (err) {
        console.log("An error occurred writing the file :" + err.message);
      }
    });
  });
});
