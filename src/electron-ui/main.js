const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
});

ipcMain.handle('select-file', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openFile'] });
  return result.filePaths[0];
});

ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
  return result.filePaths[0];
});

ipcMain.on('split-stems', (event, args) => {
  const { inputPath, outputPath, model } = args;

  // Spawn the Python process with command-line arguments
  const pythonProcess = spawn('python3', [
    path.join(__dirname, '../python-backend/backend.py'),
    '--model', model,
    '--input', inputPath,
    '--output', outputPath,
  ]);

  // Handle standard output (logs)
  pythonProcess.stdout.on('data', (data) => {
    const log = data.toString();
    console.log(log);
    event.reply('process-log', log);
  });

  // Handle standard error (errors and warnings)
  pythonProcess.stderr.on('data', (data) => {
    const error = `Error: ${data.toString()}`;
    console.error(error);
    event.reply('process-log', error);
  });

  // Handle process close event
  pythonProcess.on('close', (code) => {
    const message = `Process finished with code ${code}`;
    console.log(message);
    event.reply('process-log', message);
  });
});
