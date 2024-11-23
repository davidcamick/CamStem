const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const os = require('os');
const fs = require('fs');
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

  const tempFilePath = path.join(os.tmpdir(), 'demucs_input.json');
  const jsonData = {
    model_name: model,
    input_file_path: inputPath,
    output_dir: outputPath,
  };

  fs.writeFileSync(tempFilePath, JSON.stringify(jsonData));

  const pythonProcess = spawn('python3', [
    path.join(__dirname, '../python-backend/backend.py'),
    tempFilePath,
  ]);

  pythonProcess.stdout.on('data', (data) => {
    const log = data.toString();
    console.log(log);
    event.reply('process-log', log);
  });

  pythonProcess.stderr.on('data', (data) => {
    const error = `Error: ${data.toString()}`;
    console.error(error);
    event.reply('process-log', error);
  });

  pythonProcess.on('close', (code) => {
    const message = `Process finished with code ${code}`;
    console.log(message);
    event.reply('process-log', message);

    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  });
});
