const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

let mainWindow; // Reference to the main window

// Function to spawn the backend process
function spawnBackend(model, inputPath, outputPath) {
  const backendPath = '/Users/david/Desktop/Project-CamStem/CamStemSoftware/dist/backend';

  console.log(`Starting backend from: ${backendPath}`);
  console.log(`Model: ${model}, Input: ${inputPath}, Output: ${outputPath}`);

  // Check if the backend executable exists
  if (!fs.existsSync(backendPath)) {
    console.error(`Backend executable not found at: ${backendPath}`);
    return null;
  }

  try {
    const backendProcess = spawn(backendPath, ['--model', model, '--input', inputPath, '--output', outputPath], {
      stdio: 'inherit',
    });

    backendProcess.on('error', (err) => {
      if (err.code === 'EACCES') {
        console.error(`Permission denied: ${backendPath}. Ensure it is executable.`);
        console.error('Try running the following commands:');
        console.error(`  chmod +x "${backendPath}"`);
        console.error(`  xattr -r -d com.apple.quarantine "${backendPath}"`);
      } else {
        console.error('Failed to start backend process:', err);
      }
    });

    backendProcess.on('close', (code) => {
      if (code === 0) {
        console.log('Backend process completed successfully.');
      } else {
        console.error(`Backend process exited with code ${code}`);
      }
    });

    return backendProcess;
  } catch (error) {
    console.error('Error launching backend:', error);
    return null;
  }
}

// App ready event
app.on('ready', () => {
  // Create the main Electron window
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Preload script for secure IPC
    },
  });

  // Load the frontend UI
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Handle window close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

// Quit the app when all windows are closed
app.on('window-all-closed', () => {
  // On macOS, apps usually stay active until explicitly quit
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // Re-create a window if none are open
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

  // Spawn the backend process with the provided arguments
  spawnBackend(model, inputPath, outputPath);
});
