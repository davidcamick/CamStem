const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

let mainWindow; // Reference to the main window

// Function to dynamically resolve the backend path
function getBackendPath() {
  return app.isPackaged
    ? path.join(process.resourcesPath, 'backend') // Production path
    : path.join(__dirname, '../../dist/backend'); // Development path
}

// Log file path
const logPath = path.join(app.getPath('userData'), 'backend-log.txt');

// Function to spawn the backend process
function spawnBackend(model, inputPath, outputPath) {
  const backendPath = getBackendPath();

  console.log(`Starting backend from: ${backendPath}`);
  console.log(`Model: ${model}, Input: ${inputPath}, Output: ${outputPath}`);
  console.log(`Logs are saved at: ${logPath}`);

  if (!fs.existsSync(backendPath)) {
    console.error(`Backend executable not found at: ${backendPath}`);
    return null;
  }

  try {
    const backendProcess = spawn(backendPath, ['--model', model, '--input', inputPath, '--output', outputPath], {
      stdio: ['ignore', 'pipe', 'pipe'], // Capture stdout and stderr
    });

    // Stream logs to a file
    const logStream = fs.createWriteStream(logPath, { flags: 'a' });
    backendProcess.stdout.pipe(logStream);
    backendProcess.stderr.pipe(logStream);

    backendProcess.on('error', (err) => {
      console.error(`Backend process error: ${err.message}`);
      logStream.write(`Backend process error: ${err.message}\n`);
    });

    backendProcess.on('close', (code) => {
      console.log(`Backend process exited with code: ${code}`);
      logStream.write(`Backend process exited with code: ${code}\n`);
      logStream.end();
    });

    return backendProcess;
  } catch (error) {
    console.error('Error launching backend:', error);
    return null;
  }
}

// App ready event
app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Preload script
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  console.log(`Logs are saved at: ${logPath}`);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
      },
    });
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
  }
});

// IPC Handlers
ipcMain.handle('select-file', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openFile'] });
  return result.filePaths[0];
});

ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
  return result.filePaths[0];
});

ipcMain.handle('split-stems', async (event, { inputPath, outputPath, model }) => {
  console.log(`Received split-stems request with:
    Input: ${inputPath},
    Output: ${outputPath},
    Model: ${model}`);

  if (!inputPath || !outputPath || !model) {
    console.error('Missing arguments for backend processing.');
    return;
  }

  spawnBackend(model, inputPath, outputPath);
});

ipcMain.handle('get-log-path', () => {
  console.log(`Log file path provided: ${logPath}`);
  return logPath;
});
