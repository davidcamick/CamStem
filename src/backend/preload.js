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
  selectPath: async (type, callback) => {
    const path = await ipcRenderer.invoke('select-path', type);
    callback(path);
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
});
