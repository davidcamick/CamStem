// src/backend/preload.js

const { contextBridge, ipcRenderer, shell } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // 1) Run Demucs
  runDemucs: (inputPath, outputPath, model, mp3Preset) => {
    ipcRenderer.send('run-demucs', { inputPath, outputPath, model, mp3Preset });
  },

  // 2) Generic 'receive' for demucs-log, demucs-success, etc.
  receive: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },

  // 3) Choose path
  selectPath: async (type) => {
    const path = await ipcRenderer.invoke('select-path', type);
    return path;
  },

  // 4) Open log file in Explorer/Finder
  openLogFile: () => {
    ipcRenderer.invoke('open-log-file');
  },

  // 5) External link
  openExternal: (url) => {
    shell.openExternal(url);
  },

  // 6) Key management
  saveSoftwareKey: async (key) => ipcRenderer.invoke('save-software-key', key),
  getSavedKey: async () => ipcRenderer.invoke('get-saved-key'),
  removeSavedKey: async () => ipcRenderer.invoke('remove-saved-key'),
  checkValidKey: async () => ipcRenderer.invoke('check-valid-key'),
  activateSoftwareKey: async (encryptedKey) => ipcRenderer.invoke('activate-software-key', encryptedKey),
  checkSubscriptionStatus: async () => ipcRenderer.invoke('check-subscription-status'),

  // 7) Auto-updater methods
  getAppVersion: async () => ipcRenderer.invoke('get-app-version'),
  checkForUpdates: async () => ipcRenderer.invoke('check-for-updates'),
  installUpdateNow: async () => ipcRenderer.invoke('install-update-now'),

  // 8) openFolder
  openFolder: (folderPath) => {
    shell.openPath(folderPath);
  },

  // 9) Start tailing the demucs-log file
  startTailLog: () => {
    ipcRenderer.send('start-tail-log');
  },

  // 10) On every new appended line from demucs-log, callback
  onLogFileLine: (callback) => {
    ipcRenderer.on('demucs-logfile-line', (event, line) => {
      callback(line);
    });
  },

  // 11) Premiere extension installation (existing from previous steps)
  installPremiereExtension: async (destinationPath) => {
    const result = await ipcRenderer.invoke('installPremiereExtension', destinationPath);
    return result;
  },

  // 12) We want to open an arbitrary folder from front-end
  openAnyFolder: async (folderPath) => {
    await ipcRenderer.invoke('openAnyFolder', folderPath);
  },

  // 13) Get the default OS extension folder
  getDefaultExtensionsFolder: async () => {
    const defPath = await ipcRenderer.invoke('getDefaultExtensionsFolder');
    return defPath;
  },

  // 14) NEW: Get demucs exec + model folder path
  getDemucsPaths: async () => {
    // main.js returns { demucsExec, models }
    return await ipcRenderer.invoke('getDemucsPaths');
  },

  // 15) NEW: Get system status
  getSystemStatus: async () => {
    try {
      ipcRenderer.send('log-message', 'Attempting to fetch system status from worker...');
      const response = await fetch('https://stripe-backend.accounts-abd.workers.dev/get-status');
      const data = await response.json();
      ipcRenderer.send('log-message', `Status response received: ${JSON.stringify(data)}`);
      return data;
    } catch (error) {
      ipcRenderer.send('log-message', `Error fetching status: ${error.message}`);
      throw error;
    }
  },

  // Replace the existing getSystemStatus and refreshSystemStatus functions with:
  getSystemStatus: async () => {
    try {
      const response = await ipcRenderer.invoke('get-system-status');
      return response;
    } catch (error) {
      console.error('Error getting system status:', error);
      throw error;
    }
  },

  refreshSystemStatus: async () => {
    // Force a fresh status check and update cache
    try {
      const status = await ipcRenderer.invoke('get-system-status');
      localStorage.setItem('systemStatus', JSON.stringify(status));
      return status;
    } catch (error) {
      console.error('Error refreshing system status:', error);
      throw error;
    }
  },

  // Add these new beta functions
  activateBetaMode: async (password) => ipcRenderer.invoke('activate-beta-mode', password),
  deactivateBetaMode: async () => ipcRenderer.invoke('deactivate-beta-mode'),
  checkBetaMode: async () => ipcRenderer.invoke('check-beta-mode'),
});
