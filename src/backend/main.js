// src/backend/main.js

// 1) Load environment variables from .env
require('dotenv').config();

// Add this check right after loading dotenv
if (!process.env.API_BASE_URL) {
  console.error('API_BASE_URL environment variable is missing');
  process.env.API_BASE_URL = 'https://stripe-backend.accounts-abd.workers.dev'; // Fallback URL
}

const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
// We spawn a process for demucs
const { spawn } = require('child_process');
const fs = require('fs');
const keytar = require('keytar');
const { webcrypto } = require('crypto');
const os = require('os');
const stripe = require('stripe');
let stripeInstance = null;

// 2) Import autoUpdater from electron-updater
const { autoUpdater } = require('electron-updater');
const apiClient = require(path.join(__dirname, 'apiClient'));

let isDev = false;

(async () => {
  const isDevModule = await import('electron-is-dev');
  isDev = isDevModule.default;
})();

let mainWindow;

// Update API_BASE_URL fallback
const API_BASE_URL = process.env.API_BASE_URL;

// Set up the log file path
const logFilePath = path.join(app.getPath('userData'), 'demucs-log.txt');

// Add error handling for file operations
function logToFile(message) {
  try {
    const timestamp = new Date().toISOString();
    const fullMsg = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(logFilePath, fullMsg);
    console.log(fullMsg.trim());
  } catch (err) {
    console.error('Failed to write to log file:', err);
  }
}

// Configure autoUpdater before setup
autoUpdater.setFeedURL({
  provider: 'github',
  owner: 'davidcamick',
  repo: 'CamStemReleases', // This is where updates will be looked for
  private: false // Since this is a public repo
});

// ---------- AUTO-UPDATER SETUP -----------
function setupAutoUpdaterLogs() {
  // Let the user decide when to install after download
  autoUpdater.autoInstallOnAppQuit = false;

  autoUpdater.on('checking-for-update', () => {
    logToFile('autoUpdater: Checking for updates...');
    if (mainWindow) {
      mainWindow.webContents.send('autoUpdater-event', {
        event: 'checking-for-update',
      });
    }
  });

  autoUpdater.on('update-available', (info) => {
    logToFile(`autoUpdater: Update available. Version: ${info.version}`);
    if (mainWindow) {
      mainWindow.webContents.send('autoUpdater-event', {
        event: 'update-available',
        version: info.version,
      });
    }
  });

  autoUpdater.on('update-not-available', () => {
    logToFile('autoUpdater: No updates available.');
    if (mainWindow) {
      mainWindow.webContents.send('autoUpdater-event', {
        event: 'update-not-available',
      });
    }
  });

  autoUpdater.on('error', (err) => {
    logToFile(`autoUpdater: Error - ${err.message}`);
    if (mainWindow) {
      mainWindow.webContents.send('autoUpdater-event', {
        event: 'error',
        message: err.message,
      });
    }
  });

  autoUpdater.on('download-progress', (progress) => {
    const msg = `autoUpdater: Download speed: ${progress.bytesPerSecond} - Progress: ${progress.percent}%`;
    logToFile(msg);

    if (mainWindow) {
      mainWindow.webContents.send('autoUpdater-event', {
        event: 'download-progress',
        percent: progress.percent,
      });
    }
  });

  autoUpdater.on('update-downloaded', (info) => {
    logToFile(`autoUpdater: Update downloaded. Release name: ${info.releaseName}`);
    if (mainWindow) {
      mainWindow.webContents.send('autoUpdater-event', {
        event: 'update-downloaded',
        version: info.version,
      });
    }
  });
}

// ---------- CREATE THE MAIN WINDOW -----------
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile(path.join(__dirname, '../frontend/landing.html'));

  mainWindow.webContents.on('did-finish-load', () => {
    // Example: if you want to send the assets path
    mainWindow.webContents.send('set-assets-path', assetsPath);
  });

  // Check for updates
  autoUpdater.checkForUpdatesAndNotify();
}

// Auto-updater events
autoUpdater.on('update-available', () => {
  console.log('Update available');
});

autoUpdater.on('update-downloaded', () => {
  console.log('Update downloaded');
  autoUpdater.quitAndInstall();
});

autoUpdater.on('error', (err) => {
  console.error('Error in auto-updater:', err);
});

// Dynamically set the assets path
const assetsPath = isDev
  ? path.join(__dirname, '../assets')
  : path.join(process.resourcesPath, 'assets');

// Reverse string utility
function reverseString(str) {
  return str.split('').reverse().join('');
}

// Check key validity (14-day window)
function isKeyValid(dateStr) {
  const keyDate = new Date(dateStr);
  const currentDate = new Date();
  const diffInDays = (currentDate - keyDate) / (1000 * 60 * 60 * 24);
  logToFile(`Key date: ${keyDate}, Current date: ${currentDate}, Difference in days: ${diffInDays}`);
  return diffInDays <= 14;
}

// Decrypt software key
async function processSoftwareKey(encryptedHex) {
  try {
    const apiKeys = await apiClient.getApiKeys();
    if (!apiKeys.success || !apiKeys.encryptionKey) {
      throw new Error('Failed to retrieve encryption key');
    }

    logToFile(`Using encryption key for decryption`); // Don't log the actual key

    const { encryptionKey } = apiKeys;

    logToFile(`Encrypted Key Received: ${encryptedHex}`);

    const cipherBytes = new Uint8Array(
      encryptedHex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
    );

    const enc = new TextEncoder();
    const dec = new TextDecoder();

    const keyData = enc.encode(encryptionKey);
    const cryptoKey = await webcrypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-CTR', length: 256 },
      false,
      ['decrypt']
    );

    const iv = new Uint8Array(16);

    const decryptedBuffer = await webcrypto.subtle.decrypt(
      { name: 'AES-CTR', counter: iv, length: 64 },
      cryptoKey,
      cipherBytes
    );

    const decrypted = dec.decode(decryptedBuffer);
    logToFile(`Decrypted Key: ${decrypted}`);

    const parts = decrypted.split('|');
    logToFile(`Decrypted Key Parts: ${JSON.stringify(parts)}`);

    if (parts.length !== 4) {
      throw new Error('Invalid key format. Expected 4 parts.');
    }

    const [date, platformCodeStr, revClerkID, revStripeID] = parts;
    const platformCode = parseInt(platformCodeStr, 10);

    if (!isKeyValid(date)) {
      throw new Error('Software key is expired. Please generate a new one.');
    }

    const currentPlatform = os.platform() === 'darwin' ? 1 : 2;
    logToFile(`Current platform: ${currentPlatform}, Key platform: ${platformCode}`);

    if (currentPlatform !== platformCode) {
      throw new Error('Software key does not match the current platform.');
    }

    const clerkID = reverseString(revClerkID);
    const stripeID = reverseString(revStripeID);
    
    // Generate a simple auth token from the Clerk ID
    const authToken = Buffer.from(clerkID).toString('base64');
    await keytar.setPassword('camstem-app', 'auth-token', authToken);
    
    logToFile(`Decrypted Clerk ID: ${clerkID}, Decrypted Stripe ID: ${stripeID}`);
    logToFile(`Auth token generated and stored: ${authToken}`);

    return { clerkID, stripeID };
  } catch (err) {
    logToFile(`Error in processSoftwareKey: ${err.message}`);
    throw err;
  }
}

async function getStoredCredentials() {
  const clerkID = await keytar.getPassword('camstem-app', 'clerkID');
  const stripeID = await keytar.getPassword('camstem-app', 'stripeID');
  logToFile(`Stored Credentials: Clerk ID: ${clerkID}, Stripe ID: ${stripeID}`);
  return { clerkID, stripeID };
}

// ------------- Resource Path Helper -------------
function getResourcePath(relativePath) {
  const basePath = app.isPackaged
    ? path.join(process.resourcesPath)
    : path.join(app.getAppPath());
  const resolvedPath = path.join(basePath, relativePath);
  logToFile(`Resolved Path: ${resolvedPath}`);
  return resolvedPath;
}

// ------------- Derive the demucs exec path (like in run-demucs code) -------------
function deriveDemucsExecPath() {
  const platform = os.platform();

  let relativeDemucsPath;
  if (platform === 'darwin') {
    relativeDemucsPath = isDev
      ? 'src/backend/demucs-cxfreeze-mac/demucs-cxfreeze'
      : 'demucs-cxfreeze-mac/demucs-cxfreeze';
  } else if (platform === 'win32') {
    relativeDemucsPath = isDev
      ? 'src/backend/demucs-cxfreeze-win-cuda/demucs-cxfreeze.exe'
      : 'demucs-cxfreeze-win-cuda/demucs-cxfreeze.exe';
  } else {
    // fallback for Linux, etc.
    relativeDemucsPath = isDev
      ? 'src/backend/demucs-cxfreeze-mac/demucs-cxfreeze'
      : 'demucs-cxfreeze-mac/demucs-cxfreeze';
  }

  return getResourcePath(relativeDemucsPath);
}

// ----------------- IPC HANDLERS -----------------
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

// -------------- NEW: getDemucsPaths --------------
ipcMain.handle('getDemucsPaths', async () => {
  try {
    const demucsExec = deriveDemucsExecPath();
    const modelsPath = getResourcePath('Models');

    // Return them to the front-end
    return {
      demucsExec,
      models: modelsPath,
    };
  } catch (err) {
    const msg = 'Error retrieving demucs or models path: ' + err.message;
    logToFile(msg);
    throw new Error(msg);
  }
});

ipcMain.handle('check-valid-key', async () => {
  try {
    const { clerkID, stripeID } = await getStoredCredentials();
    if (clerkID && stripeID) {
      return { valid: true };
    } else {
      return { valid: false, reason: 'No valid key found. Please enter a new one.' };
    }
  } catch (err) {
    logToFile(`Error in check-valid-key: ${err.message}`);
    return { valid: false, reason: 'An error occurred while checking the key.' };
  }
});

ipcMain.handle('activate-software-key', async (event, encryptedKey) => {
  try {
    const { clerkID, stripeID } = await processSoftwareKey(encryptedKey);
    await keytar.setPassword('camstem-app', 'clerkID', clerkID);
    await keytar.setPassword('camstem-app', 'stripeID', stripeID);

    logToFile(`Clerk ID: ${clerkID}`);
    logToFile(`Stripe Customer ID: ${stripeID}`);

    return { success: true };
  } catch (err) {
    logToFile(`Error processing software key: ${err.message}`);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('get-user-id', async () => {
  try {
    const { clerkID } = await getStoredCredentials();
    if (!clerkID) {
      throw new Error('Clerk ID not found in stored credentials.');
    }
    logToFile(`Retrieved User ID: ${clerkID}`);
    return { userId: clerkID };
  } catch (err) {
    logToFile(`Error in get-user-id handler: ${err.message}`);
    throw err;
  }
});

ipcMain.handle('check-subscription-status', async () => {
  try {
    if (!stripeInstance) {
      throw new Error('Stripe not initialized');
    }

    const { clerkID: userId } = await getStoredCredentials();
    logToFile(`Checking subscription for user ID: ${userId}`);
    
    if (!userId) {
      throw new Error('User ID not found in stored credentials.');
    }

    const token = await keytar.getPassword('camstem-app', 'auth-token');
    logToFile(`Using auth token: ${token}`);
    
    if (!token) {
      throw new Error('Authentication token not found.');
    }

    const result = await apiClient.verifySubscription(userId, token);
    logToFile(`Subscription check result: ${JSON.stringify(result, null, 2)}`);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to verify subscription');
    }

    return {
      active: result.hasSubscription,
      type: result.subscriptionType,
      expiresAt: result.expiresAt,
      reason: result.hasSubscription ? null : 'No active subscription found'
    };
  } catch (err) {
    logToFile(`Error checking subscription status: ${err.message}`);
    return { 
      active: false, 
      type: null,
      expiresAt: null,
      reason: err.message 
    };
  }
});

ipcMain.handle('save-software-key', async (event, key) => {
  try {
    await keytar.setPassword('camstem-app', 'softwareKey', key);
    logToFile(`Software key saved: ${key}`);
    return { success: true };
  } catch (err) {
    logToFile(`Error saving software key: ${err.message}`);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('get-saved-key', async () => {
  try {
    const savedKey = await keytar.getPassword('camstem-app', 'softwareKey');
    logToFile(`Retrieved software key: ${savedKey}`);
    return savedKey || null;
  } catch (err) {
    logToFile(`Error retrieving software key: ${err.message}`);
    throw err;
  }
});

ipcMain.handle('remove-saved-key', async () => {
  try {
    await keytar.deletePassword('camstem-app', 'softwareKey');
    logToFile('Software key removed.');
    return { success: true };
  } catch (err) {
    logToFile(`Error removing software key: ${err.message}`);
    return { success: false, error: err.message };
  }
});

// ---------- NEW IPC FOR AUTO-UPDATER CONTROL ----------
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('check-for-updates', () => {
  logToFile('Manual check-for-updates triggered');
  autoUpdater.checkForUpdates(); 
});

ipcMain.handle('install-update-now', () => {
  logToFile('User chose to install update now');
  autoUpdater.quitAndInstall();
});

// ---------- DEMUCS RUNNER -----------
ipcMain.on('run-demucs', (event, args) => {
  const { inputPath, outputPath, model, mp3Preset } = args;

  logToFile('Running Demucs with args:');
  logToFile(`Input Path: ${inputPath}`);
  logToFile(`Output Path: ${outputPath}`);
  logToFile(`Model: ${model}`);
  logToFile(`MP3 Preset: ${mp3Preset}`);

  const demucsPath = deriveDemucsExecPath();
  const modelRepo = getResourcePath('Models');

  logToFile(`Demucs Path: ${demucsPath}`);
  logToFile(`Model Repo: ${modelRepo}`);

  const commandArgs = [
    '-n', model,
    '--repo', modelRepo,
    '-o', outputPath,
    '--mp3',
    '--mp3-preset', mp3Preset,
    inputPath,
  ];

  logToFile(`Command Args: ${commandArgs.join(' ')}`);

  const demucsProcess = spawn(demucsPath, commandArgs, {
    shell: false,
    cwd: path.dirname(demucsPath),
  });

  demucsProcess.stdout.on('data', (data) => {
    const out = data.toString();
    logToFile(`Demucs stdout: ${out}`);
    event.reply('demucs-log', out);
  });

  demucsProcess.stderr.on('data', (data) => {
    const errOut = data.toString();
    logToFile(`Demucs stderr: ${errOut}`);
    event.reply('demucs-log', errOut);
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

// open log file
ipcMain.handle('open-log-file', () => {
  logToFile('Opening log file...');
  shell.showItemInFolder(logFilePath);
});

// ---------- APP LIFECYCLE ----------
app.whenReady().then(async () => {
  try {
    await initializeStripe();
    createWindow();
    setupAutoUpdaterLogs();
    
    // Check for updates on startup
    autoUpdater.checkForUpdates();
    
    // Check for updates every hour
    setInterval(() => {
      autoUpdater.checkForUpdates();
    }, 60 * 60 * 1000);

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });

    logToFile('App started.');
  } catch (err) {
    logToFile(`Failed to initialize app: ${err.message}`);
    dialog.showErrorBox(
      'Initialization Error',
      'Failed to initialize the application. Please check your internet connection and try again.'
    );
    app.quit();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    logToFile('App closed.');
    app.quit();
  }
});

/*************************************************************
 * TAILING THE LOG FILE 
 *************************************************************/
function tailLogFile(sender) {
  const logPath = logFilePath;
  let fileOffset = 0;

  fs.open(logPath, 'r', (err, fd) => {
    if (err) {
      console.error('Failed to open demucs-log.txt for tailing:', err);
      return;
    }

    const tailInterval = setInterval(() => {
      fs.stat(logPath, (statErr, stats) => {
        if (statErr) {
          console.error('stat error:', statErr);
          return;
        }
        if (stats.size > fileOffset) {
          const newSize = stats.size - fileOffset;
          const buffer = Buffer.alloc(newSize);

          fs.read(fd, buffer, 0, newSize, fileOffset, (readErr, bytesRead) => {
            if (readErr) {
              console.error('read error:', readErr);
              return;
            }
            fileOffset += bytesRead;

            const chunk = buffer.toString('utf8');
            const lines = chunk.split(/\r?\n/);

            lines.forEach((line) => {
              if (line.trim().length > 0) {
                sender.send('demucs-logfile-line', line);
              }
            });
          });
        }
      });
    }, 16);
  });
}

ipcMain.on('start-tail-log', (evt) => {
  tailLogFile(evt.sender);
});

// ---------- PREMIERE EXTENSION INSTALLER ----------
ipcMain.handle('installPremiereExtension', async (event, chosenPath) => {
  try {
    const extensionSource = path.join(__dirname, '../extension/CamStemExtension');
    const destination = path.join(chosenPath, 'CamStemExtension');

    logToFile(`Installing Premiere Extension from: ${extensionSource} => ${destination}`);

    function copyFolderSync(src, dest) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      const entries = fs.readdirSync(src, { withFileTypes: true });
      for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
          copyFolderSync(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    }

    copyFolderSync(extensionSource, destination);

    logToFile('Premiere Extension installed successfully!');
    return { success: true };
  } catch (err) {
    const msg = `Error installing Premiere Extension: ${err.message}`;
    logToFile(msg);
    return { success: false, error: msg };
  }
});

// ---------- OPEN ANY FOLDER IPC ----------
ipcMain.handle('openAnyFolder', async (event, folderPath) => {
  logToFile(`Request to open folder: ${folderPath}`);
  if (!folderPath) {
    return;
  }
  try {
    await shell.openPath(folderPath);
  } catch (err) {
    logToFile('Error opening path: ' + err.message);
  }
});

// ---------- GET DEFAULT EXTENSIONS FOLDER IPC ----------
ipcMain.handle('getDefaultExtensionsFolder', () => {
  const platform = os.platform();
  if (platform === 'win32') {
    // Windows
    return 'C:\\Program Files (x86)\\Common Files\\Adobe\\CEP\\extensions';
  } else if (platform === 'darwin') {
    // Mac
    const homeDir = os.homedir();
    return path.join(homeDir, 'Library', 'Application Support', 'Adobe', 'CEP', 'extensions');
  } else {
    // fallback, maybe Linux or unknown
    return '/tmp/AdobeCEP/extensions';
  }
});

// Initialize stripe with key from backend
async function initializeStripe() {
  try {
    const response = await apiClient.getApiKeys();
    if (response.success && response.stripeKey) {
      stripeInstance = stripe(response.stripeKey);
      logToFile('Stripe initialized successfully');
    } else {
      throw new Error('No Stripe key received from backend');
    }
  } catch (err) {
    logToFile(`Failed to initialize Stripe: ${err.message}`);
    throw err;
  }
}
