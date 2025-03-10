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
const fsPromises = require('fs').promises;  // Add this for promise-based operations
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

// Fix the logToFile function to use synchronous fs
function logToFile(message) {
  try {
    const timestamp = new Date().toISOString();
    const fullMsg = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(logFilePath, fullMsg);  // Use regular fs for sync operations
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
    width: 1040,    // 800 * 1.3 = 1040px
    height: 660,    // 600 * 1.1 = 660px
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile(path.join(__dirname, '../frontend/landing.html'));

  mainWindow.webContents.on('did-finish-load', () => {
    logToFile('Dashboard loaded - Starting status check...');
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

// Add this with your other ipcMain handlers
ipcMain.on('log-message', (event, message) => {
    logToFile(message);
});

// Add status handler
ipcMain.handle('get-system-status', async () => {
  try {
    const response = await fetch('https://stripe-backend.accounts-abd.workers.dev/get-status');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching system status:', error);
    throw error;
  }
});

// Add these beta mode IPC handlers before app.whenReady()
ipcMain.handle('activate-beta-mode', async (event, password) => {
  try {
    if (password === 'CamStemBeta1') {
      await keytar.setPassword('camstem-app', 'beta-mode', 'true');
      logToFile('Beta mode activated');
      return { success: true };
    }
    return { success: false, error: 'Invalid beta password' };
  } catch (err) {
    logToFile(`Error activating beta mode: ${err.message}`);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('deactivate-beta-mode', async () => {
  try {
    await keytar.deletePassword('camstem-app', 'beta-mode');
    logToFile('Beta mode deactivated');
    return { success: true };
  } catch (err) {
    logToFile(`Error deactivating beta mode: ${err.message}`);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('check-beta-mode', async () => {
  try {
    const isBeta = await keytar.getPassword('camstem-app', 'beta-mode');
    return { isBeta: isBeta === 'true' };
  } catch (err) {
    logToFile(`Error checking beta mode: ${err.message}`);
    return { isBeta: false };
  }
});

// Add this new IPC handler before app.whenReady()
ipcMain.handle('move-stems', async (event, sourcePath, outputBase) => {
  try {
    // Get the original filename from the sourcePath
    const songFolders = await fsPromises.readdir(sourcePath);
    if (songFolders.length === 0) {
      throw new Error('No song folder found');
    }

    // Clean up the filename and create the new folder name
    const cleanedName = cleanupFileName(songFolders[0]);
    const newFolderName = `CamStem - ${cleanedName}`;
    const outputFolder = path.join(outputBase, newFolderName);

    // Create the new folder
    await fsPromises.mkdir(outputFolder, { recursive: true });

    // The song folder should be the only folder inside sourcePath
    const songFolder = path.join(sourcePath, songFolders[0]);
    
    // Get all the stem files from inside the song folder
    const stemFiles = await fsPromises.readdir(songFolder);
    
    // Move each stem file to the new folder with transformed name
    for (const file of stemFiles) {
      const sourceFile = path.join(songFolder, file);
      // Transform the stem filename using the cleaned song name
      const newFileName = transformStemName(cleanedName, file);
      const targetFile = path.join(outputFolder, newFileName);
      await fsPromises.rename(sourceFile, targetFile);
    }

    // Try to clean up empty directories
    try {
      await fsPromises.rmdir(songFolder);
      await fsPromises.rmdir(sourcePath);
    } catch (err) {
      logToFile(`Note: Could not remove empty directories: ${err.message}`);
    }

    logToFile(`Successfully moved stems to ${outputFolder}`);
    return { success: true };
  } catch (err) {
    logToFile(`Error moving stems: ${err.message}`);
    return { success: false, error: err.message };
  }
});

// Add this helper function for cleaning up filenames
function cleanupFileName(fileName) {
  // Remove the .mp3 extension if present
  let cleanName = fileName.replace('.mp3', '');

  // Array of prefixes to remove
  const prefixesToRemove = [
    'spotidownloader.com - ',
    'yts.com -'
  ];

  // Remove any matching prefixes
  prefixesToRemove.forEach(prefix => {
    if (cleanName.toLowerCase().startsWith(prefix.toLowerCase())) {
      cleanName = cleanName.substring(prefix.length);
    }
  });

  // Trim any extra spaces
  return cleanName.trim();
}

// Add this function to get the first word and transform stem names
function transformStemName(songName, stemFile) {
  // Get the first word of the song name
  const firstWord = songName.split(' ')[0].toLowerCase();
  
  // Get the stem type (vocals.mp3, drums.mp3, etc)
  const stemType = stemFile.toLowerCase();
  
  // Combine them, making first word capitalized
  return firstWord.charAt(0).toUpperCase() + firstWord.slice(1) + ' ' + stemType;
}

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

// Add this new IPC handler with your other handlers
ipcMain.handle('get-directory-from-path', (event, filePath) => {
    try {
        logToFile(`Getting directory from path: ${filePath}`);
        const directory = path.dirname(filePath);
        logToFile(`Resolved directory: ${directory}`);
        return directory;
    } catch (err) {
        logToFile(`Error getting directory from path: ${err.message}`);
        throw err;
    }
});

// Add this helper function to get file size in GB
async function getFileSize(filePath) {
  try {
    const stats = await fsPromises.stat(filePath);
    return stats.size / (1024 * 1024 * 1024); // Convert bytes to GB
  } catch (err) {
    logToFile(`Error getting file size for ${filePath}: ${err.message}`);
    return 0;
  }
}

// Add this helper function for Mac disk space checking
async function checkDiskSpaceMac(dirPath) {
  try {
    const { exec } = require('child_process');
    return new Promise((resolve, reject) => {
      exec(`df -k "${dirPath}" | tail -1 | awk '{print $2 " " $4}'`, (error, stdout) => {
        if (error) {
          reject(error);
          return;
        }
        
        const [size, free] = stdout.trim().split(' ').map(n => parseInt(n) * 1024); // Convert KB to bytes
        resolve({
          totalGB: size / (1024 * 1024 * 1024),
          freeGB: free / (1024 * 1024 * 1024),
          percentFree: (free / size) * 100
        });
      });
    });
  } catch (err) {
    logToFile(`Error checking disk space on Mac: ${err.message}`);
    throw err;
  }
}

// Update the process-assets handler to include Mac disk space check
ipcMain.handle('process-assets', async (event, config) => {
  try {
    const { projectName, parentPath, selectedPreset, linkedFolders, settings } = config;
    
    // Validate required fields
    if (!projectName || !parentPath) {
      throw new Error('Project name and parent directory are required');
    }

    logToFile(`Starting project setup: ${projectName}`);
    logToFile(`Parent directory: ${parentPath}`);
    logToFile(`Linked folders: ${JSON.stringify(linkedFolders)}`);

    // Check disk space on Mac only
    if (process.platform === 'darwin') {
      try {
        const diskSpace = await checkDiskSpaceMac(parentPath);
        logToFile(`Disk space check (Mac): ${diskSpace.freeGB.toFixed(2)} GB free of ${diskSpace.totalGB.toFixed(2)} GB (${diskSpace.percentFree.toFixed(2)}%)`);
        
        if (diskSpace.freeGB < 1) {
          throw new Error(`Low disk space: Only ${diskSpace.freeGB.toFixed(2)} GB available. Please free up at least 1 GB to continue.`);
        }
      } catch (err) {
        logToFile(`Warning: Could not check disk space on Mac: ${err.message}`);
        // Continue anyway on disk space check failure
      }
    }

    // Rest of your existing process-assets code...
    // Calculate sizes and track progress
    let totalItems = 0;
    let processedItems = 0;
    let totalSize = 0;
    let processedSize = 0;

    // Helper function for progress updates
    const sendProgress = (operation, percent, currentItem = null, completed = 0, total = 0, processedGB = 0, totalGB = 0) => {
      event.sender.send('process-progress', {
        operation,
        percent,
        currentItem,
        completed,
        total,
        processedGB: processedGB.toFixed(2),
        totalGB: totalGB.toFixed(2)
      });
    };

    // First, count total items and calculate total size
    sendProgress('Calculating total size...', 0, 'Scanning folders...');
    for (const folder of linkedFolders) {
      // Skip Project Files folders when calculating size as they don't have source paths
      if (folder.isProjectFiles) continue;
      
      if (!folder.isEmpty && folder.path && fs.existsSync(folder.path)) {
        try {
          const entries = await fsPromises.readdir(folder.path, { withFileTypes: true });
          totalItems += entries.length;
          
          // Calculate size for each file
          for (const entry of entries) {
            const filePath = path.join(folder.path, entry.name);
            totalSize += await getFileSize(filePath);
          }
        } catch (err) {
          logToFile(`Error scanning directory ${folder.path}: ${err.message}`);
        }
      }
    }

    logToFile(`Total items to process: ${totalItems}`);
    logToFile(`Total size to process: ${totalSize.toFixed(2)} GB`);

    // Create the project directory with project name
    const baseProjectDir = path.join(parentPath, projectName);
    
    // Add versioning if enabled
    let projectDir = baseProjectDir;
    if (settings.versioning) {
      let version = 1;
      while (fs.existsSync(projectDir)) {
        projectDir = path.join(parentPath, `${projectName}_V${version}`);
        version++;
      }
    } else if (fs.existsSync(projectDir)) {
      throw new Error('A project with this name already exists in the selected directory');
    }

    // Create base project directory
    logToFile(`Creating base project directory: ${projectDir}`);
    await fsPromises.mkdir(projectDir, { recursive: true });

    // Create all preset folders first
    if (selectedPreset?.folders) {
      const totalFolders = selectedPreset.folders.length;
      for (let i = 0; i < totalFolders; i++) {
        const folder = selectedPreset.folders[i];
        const folderPath = path.join(projectDir, folder);
        
        sendProgress(
          'Creating folder structure...', 
          (i / totalFolders) * 20,
          folder, 
          i + 1, 
          totalFolders,
          0,
          totalSize
        );
        
        await fsPromises.mkdir(folderPath, { recursive: true });
        logToFile(`Created preset folder: ${folderPath}`);
      }
    }

    // Process files and folders
    for (const folder of linkedFolders) {
      await processFolder(folder, projectDir, sendProgress, processedItems, totalItems, processedSize, totalSize);
    }

    // Create metadata file if enabled
    if (settings.metadata) {
      await createMetadataFile(projectDir, projectName, selectedPreset, linkedFolders);
    }

    logToFile('Project setup completed successfully');
    return { success: true, projectDir };

  } catch (err) {
    logToFile(`Error in process-assets: ${err.message}`);
    if (err.code === 'ENOSPC') {
      return { success: false, error: 'No space left on device. Please free up some disk space and try again.' };
    } else if (err.code === 'ENOENT') {
      return { success: false, error: 'Could not create folder structure: One or more parent directories do not exist.' };
    } else if (err.code === 'EACCES') {
      return { success: false, error: 'Permission denied. You do not have the required permissions to create files in the selected location.' };
    } else {
      return { success: false, error: err.message };
    }
  }
});

// Add back the processFolder function
async function processFolder(folder, projectDir, sendProgress, processedItems, totalItems, processedSize, totalSize) {
    // Special handling for Footage folder to preserve source folder names
    if (folder.name.toLowerCase() === 'footage' && !folder.isEmpty) {
        const targetDir = path.join(projectDir, folder.name);
        await fsPromises.mkdir(targetDir, { recursive: true });

        // Process main path if it exists
        if (folder.path) {
            const sourceName = path.basename(folder.path);
            const subfolderPath = path.join(targetDir, sourceName);
            await fsPromises.mkdir(subfolderPath, { recursive: true });
            await processPath(folder.path, subfolderPath, folder.action, sendProgress, processedItems, totalItems, processedSize, totalSize);
        }

        // Process additional paths if they exist
        if (folder.additionalPaths && Array.isArray(folder.additionalPaths)) {
            for (const sourcePath of folder.additionalPaths) {
                const sourceName = path.basename(sourcePath);
                const subfolderPath = path.join(targetDir, sourceName);
                await fsPromises.mkdir(subfolderPath, { recursive: true });
                await processPath(sourcePath, subfolderPath, folder.action, sendProgress, processedItems, totalItems, processedSize, totalSize);
            }
        }
        return;
    }

    // Regular folder handling (existing code)
    if (folder.isProjectFiles) {
        const targetDir = path.join(projectDir, folder.name);
        logToFile(`Processing Project Files folder: ${targetDir}`);
        
        try {
            // Create the base Project Files directory
            await fsPromises.mkdir(targetDir, { recursive: true });
            
            // If not empty and has software selections, create subfolders
            if (!folder.isEmpty && folder.software && folder.software.length > 0) {
                for (const software of folder.software) {
                    const softwareDir = path.join(targetDir, `${software} Project Files`);
                    logToFile(`Creating software subfolder: ${softwareDir}`);
                    await fsPromises.mkdir(softwareDir, { recursive: true });
                }
            }
        } catch (err) {
            logToFile(`Error creating Project Files structure: ${err.message}`);
            throw err;
        }
        return;
    }

    if (folder.isEmpty) {
        return;
    }

    const targetDir = path.join(projectDir, folder.name);
    logToFile(`Processing folder ${folder.name} from ${folder.path} to ${targetDir}`);

    try {
        // Make sure target directory exists
        await fsPromises.mkdir(targetDir, { recursive: true });

        // Process main folder path
        if (folder.path && fs.existsSync(folder.path)) {
            await processPath(folder.path, targetDir, folder.action, sendProgress, processedItems, totalItems, processedSize, totalSize);
        }

        // Process additional paths for Footage folder
        if (folder.name.toLowerCase() === 'footage' && folder.additionalPaths) {
            for (const additionalPath of folder.additionalPaths) {
                if (fs.existsSync(additionalPath)) {
                    await processPath(additionalPath, targetDir, folder.action, sendProgress, processedItems, totalItems, processedSize, totalSize);
                }
            }
        }

    } catch (err) {
        logToFile(`Error processing folder ${folder.name}: ${err.message}`);
        throw err;
    }
}

// Add helper function to process a single path
async function processPath(sourcePath, targetDir, action, sendProgress, processedItems, totalItems, processedSize, totalSize) {
    const entries = await fsPromises.readdir(sourcePath, { withFileTypes: true });
    
    for (const entry of entries) {
        const srcPath = path.join(sourcePath, entry.name);
        const targetPath = path.join(targetDir, entry.name);
        
        try {
            const fileSize = await getFileSize(srcPath);
            const operation = action === 'move' ? 'Moving' : 'Copying';
            
            sendProgress(
                `${operation} ${entry.name}`,
                20 + ((processedItems / totalItems) * 80),
                entry.name,
                processedItems + 1,
                totalItems,
                processedSize,
                totalSize
            );

            if (entry.isDirectory()) {
                logToFile(`Processing directory: ${entry.name}`);
                if (action === 'move') {
                    await fsPromises.rename(srcPath, targetPath);
                } else {
                    await copyFolderRecursive(srcPath, targetPath);
                }
            } else {
                logToFile(`Processing file: ${entry.name}`);
                if (action === 'move') {
                    await fsPromises.rename(srcPath, targetPath);
                } else {
                    await fsPromises.copyFile(srcPath, targetPath);
                }
            }
            
            processedItems++;
            processedSize += fileSize;
        } catch (err) {
            logToFile(`Error processing ${entry.name}: ${err.message}`);
            throw err;
        }
    }
}

// Add back createMetadataFile function that was also referenced
async function createMetadataFile(projectDir, projectName, selectedPreset, linkedFolders) {
    try {
        const metadata = {
            projectName,
            created: new Date().toISOString(),
            preset: selectedPreset?.name || 'None',
            folders: linkedFolders.map(f => {
                if (f.isProjectFiles) {
                    return {
                        name: f.name,
                        isProjectFiles: true,
                        software: f.software,
                        isEmpty: f.isEmpty
                    };
                } else {
                    return {
                        name: f.name,
                        originalPath: f.path,
                        action: f.action,
                        isEmpty: f.isEmpty
                    };
                }
            })
        };
        
        const metadataPath = path.join(projectDir, 'project_metadata.json');
        await fsPromises.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
        logToFile('Created metadata file');
    } catch (err) {
        logToFile(`Error creating metadata file: ${err.message}`);
        // We don't throw here since the project structure is already created
    }
}

// Remove the checkDiskSpace function since we're not using it anymore

// Add back the missing copyFolderRecursive function
async function copyFolderRecursive(src, dest) {
  try {
    await fsPromises.mkdir(dest, { recursive: true });
    logToFile(`Created directory: ${dest}`);

    const entries = await fsPromises.readdir(src, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      try {
        if (entry.isDirectory()) {
          await copyFolderRecursive(srcPath, destPath);
        } else {
          await fsPromises.copyFile(srcPath, destPath);
          logToFile(`Copied file: ${entry.name}`);
        }
      } catch (err) {
        if (err.code === 'ENOSPC') {
          // If disk is full, propagate error upward
          logToFile(`No space left on device when copying ${entry.name}`);
          throw err;
        } else {
          logToFile(`Error copying ${entry.name}: ${err.message}`);
          throw err;
        }
      }
    }
  } catch (err) {
    if (err.code === 'ENOSPC') {
      // Re-throw disk space errors
      throw err;
    }
    logToFile(`Error in copyFolderRecursive: ${err.message}`);
    throw err;
  }
}

// Settings window state
let settingsWindow = null;

// Add settings window creation function
function createSettingsWindow() {
    settingsWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    settingsWindow.loadFile(path.join(__dirname, '../frontend/assetsettings.html'));
}

// Add IPC handlers for settings
ipcMain.handle('save-settings', async (event, settings) => {
    try {
        const settingsPath = path.join(app.getPath('userData'), 'settings.json');
        await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2));
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('load-settings', async () => {
    try {
        const settingsPath = path.join(app.getPath('userData'), 'settings.json');
        const settings = await fs.readFile(settingsPath, 'utf8');
        return JSON.parse(settings);
    } catch (error) {
        return {};
    }
});

ipcMain.handle('check-folder-exists', async (event, folderPath) => {
    try {
        await fs.access(folderPath);
        return { exists: true };
    } catch {
        return { exists: false };
    }
});
