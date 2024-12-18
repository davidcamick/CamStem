const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const { execFile } = require('child_process');
const fs = require('fs');
const keytar = require('keytar');
const { webcrypto } = require('crypto');
const stripe = require('stripe')('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');

let isDev = false; // Default value for production mode
(async () => {
    // Dynamically import electron-is-dev
    const isDevModule = await import('electron-is-dev');
    isDev = isDevModule.default;
})();

let mainWindow;

// Hardcoded encryption key
const HARD_CODED_KEY = "DA3K9Y5kdGQ217dhKehCT4Jip0ehJ7rY";

// Get path to the log file in the Application Support directory
const logFilePath = path.join(app.getPath('userData'), 'demucs-log.txt');

// Function to log messages to the file
const logToFile = (message) => {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logFilePath, `[${timestamp}] ${message}\n`);
    console.log(message); // Also log to the console
};

// Dynamically set the assets path
const assetsPath = isDev
    ? path.join(__dirname, '../assets') // Dev mode
    : path.join(process.resourcesPath, 'assets'); // Production mode

// Create the main application window
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    // Load landing.html first
    mainWindow.loadFile(path.join(__dirname, '../frontend/landing.html'));

    // Send the assets path to the renderer process
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('set-assets-path', assetsPath);
    });
}

// Run the app when ready
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    logToFile('App started.');

    // AUTO-UPDATE CHANGES START
    // Require and initialize the auto-updater after app is ready
    const initAutoUpdater = require('./updater');
    initAutoUpdater();
    // AUTO-UPDATE CHANGES END
});

// Quit the app when all windows are closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        logToFile('App closed.');
        app.quit();
    }
});

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

// Decrypt and process the software key
async function processSoftwareKey(encryptedHex) {
    try {
        logToFile(`Encrypted Key Received: ${encryptedHex}`);

        // Convert hex to Uint8Array
        const cipherBytes = new Uint8Array(
            encryptedHex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
        );

        const enc = new TextEncoder();
        const dec = new TextDecoder();

        const keyData = enc.encode(HARD_CODED_KEY);
        const cryptoKey = await webcrypto.subtle.importKey(
            'raw',
            keyData,
            { name: 'AES-CTR', length: 256 },
            false,
            ['decrypt']
        );

        // Zero IV
        const iv = new Uint8Array(16);

        const decryptedBuffer = await webcrypto.subtle.decrypt(
            { name: 'AES-CTR', counter: iv, length: 64 },
            cryptoKey,
            cipherBytes
        );

        const decrypted = dec.decode(decryptedBuffer);
        logToFile(`Decrypted Key: ${decrypted}`);

        // Use `|` as the delimiter
        const parts = decrypted.split('|');
        logToFile(`Decrypted Key Parts: ${JSON.stringify(parts)}`);

        if (parts.length !== 4) {
            throw new Error('Invalid key format. Expected 4 parts.');
        }

        const [date, platformCodeStr, revClerkID, revStripeID] = parts;
        const platformCode = parseInt(platformCodeStr, 10);

        // Validate date
        if (!isKeyValid(date)) {
            throw new Error('Software key is expired. Please generate a new one.');
        }

        // Determine current platform
        const os = require('os');
        const currentPlatform = os.platform() === 'darwin' ? 1 : 2;
        logToFile(`Current platform: ${currentPlatform}, Key platform: ${platformCode}`);

        if (currentPlatform !== platformCode) {
            throw new Error('Software key does not match the current platform.');
        }

        // Reverse IDs
        const clerkID = reverseString(revClerkID);
        const stripeID = reverseString(revStripeID);
        logToFile(`Decrypted Clerk ID: ${clerkID}, Decrypted Stripe ID: ${stripeID}`);

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

// Reintroduce select-path handler
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

// Check if a valid key is already stored
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

// Activate the software key (decrypt, validate, store credentials)
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
        const { stripeID } = await getStoredCredentials();
        if (!stripeID) {
            throw new Error('Stripe ID not found in stored credentials.');
        }

        logToFile(`Checking subscription status for Stripe ID: ${stripeID}`);

        const subscriptions = await stripe.subscriptions.list({
            customer: stripeID,
            status: 'all',
        });

        const activeSubscription = subscriptions.data.find(
            (sub) => sub.status === 'active' || sub.status === 'trialing'
        );

        if (!activeSubscription) {
            logToFile('No active subscription found.');
            return { active: false, reason: 'Subscription is canceled or expired.' };
        }

        logToFile(`Active subscription found: ${activeSubscription.id}`);
        return { active: true };
    } catch (err) {
        logToFile(`Error checking subscription status: ${err.message}`);
        return { active: false, reason: err.message };
    }
});

// Save software key securely
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

// Retrieve saved software key
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

// Remove saved software key
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

// Reintroduce the getResourcePath function and run-demucs handler from old main.js
function getResourcePath(relativePath) {
    const basePath = app.isPackaged
        ? path.join(process.resourcesPath)
        : path.join(app.getAppPath());
    const resolvedPath = path.join(basePath, relativePath);
    logToFile(`Resolved Path: ${resolvedPath}`);
    return resolvedPath;
}

ipcMain.on('run-demucs', (event, args) => {
    const os = require('os');
    const platform = os.platform();

    let relativeDemucsPath;
    if (platform === 'darwin') {
        // macOS
        relativeDemucsPath = isDev
            ? 'src/backend/demucs-cxfreeze-mac/demucs-cxfreeze'
            : 'demucs-cxfreeze-mac/demucs-cxfreeze';
    } else if (platform === 'win32') {
        // Windows
        relativeDemucsPath = isDev
            ? 'src/backend/demucs-cxfreeze-win-cuda/demucs-cxfreeze.exe'
            : 'demucs-cxfreeze-win-cuda/demucs-cxfreeze.exe';
    } else {
        // Default to mac if an unknown platform (adjust as needed)
        relativeDemucsPath = isDev
            ? 'src/backend/demucs-cxfreeze-mac/demucs-cxfreeze'
            : 'demucs-cxfreeze-mac/demucs-cxfreeze';
    }

    const demucsPath = getResourcePath(relativeDemucsPath);
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

ipcMain.handle('open-log-file', () => {
    logToFile('Opening log file.');
    shell.showItemInFolder(logFilePath);
});
