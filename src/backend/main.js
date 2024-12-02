const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const { execFile } = require('child_process');
const fs = require('fs');

let mainWindow;

// Get path to the log file in the Application Support directory
const logFilePath = path.join(app.getPath('userData'), 'demucs-log.txt');

// Function to log messages to the file
const logToFile = (message) => {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logFilePath, `[${timestamp}] ${message}\n`);
    console.log(message); // Also log to the console
};

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    mainWindow.loadFile(path.join(__dirname, '../frontend/index.html'));
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    logToFile('App started.');
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        logToFile('App closed.');
        app.quit();
    }
});

// Resolve paths dynamically for both development and production
const getResourcePath = (relativePath) => {
    const basePath = app.isPackaged
        ? path.join(process.resourcesPath) // In a packaged app
        : path.join(app.getAppPath()); // During development
    const resolvedPath = path.join(basePath, relativePath);
    logToFile(`Resolved Path: ${resolvedPath}`);
    return resolvedPath;
};

// Handle Demucs execution
ipcMain.on('run-demucs', (event, args) => {
    const demucsPath = getResourcePath('demucs-cxfreeze-mac/demucs-cxfreeze');
    const modelRepo = getResourcePath('Models');

    const { inputPath, outputPath, model, mp3Preset } = args;

    logToFile('Running Demucs with args:');
    logToFile(`Demucs Path: ${demucsPath}`);
    logToFile(`Model Repo: ${modelRepo}`);
    logToFile(`Input Path: ${inputPath}`);
    logToFile(`Output Path: ${outputPath}`);
    logToFile(`Model: ${model}`);
    logToFile(`MP3 Preset: ${mp3Preset}`);

    const commandArgs = [
        '-n', model,
        '--repo', modelRepo,
        '-o', outputPath,
        '--mp3',
        '--mp3-preset', mp3Preset,
        inputPath,
    ];

    logToFile(`Command Args: ${commandArgs.join(' ')}`);

    const demucsProcess = execFile(demucsPath, commandArgs);

    demucsProcess.stdout.on('data', (data) => {
        logToFile(`Demucs stdout: ${data.toString()}`);
        event.reply('demucs-log', data.toString());
    });

    demucsProcess.stderr.on('data', (data) => {
        const stderrLog = `Demucs stderr: ${data.toString()}`;
        logToFile(stderrLog);
        event.reply('demucs-log', stderrLog);
    });

    demucsProcess.on('close', (code) => {
        if (code === 0) {
            logToFile('Demucs process completed successfully.');
            event.reply('demucs-success', 'Process completed successfully.');
        } else {
            logToFile(`Demucs process exited with code ${code}.`);
            event.reply('demucs-error', `Process exited with code ${code}.`);
        }
    });
});

// Handle file/directory selection
ipcMain.handle('select-path', async (event, type) => {
    const options = type === 'file'
        ? { properties: ['openFile'] }
        : { properties: ['openDirectory'] };

    const result = await dialog.showOpenDialog(options);

    if (!result.canceled && result.filePaths.length > 0) {
        logToFile(`Selected Path: ${result.filePaths[0]}`);
        return result.filePaths[0];
    }

    return null;
});

// Handle opening the log file
ipcMain.handle('open-log-file', () => {
    logToFile('Opening log file.');
    shell.showItemInFolder(logFilePath);
});
