const { contextBridge, ipcRenderer, shell } = require('electron');

contextBridge.exposeInMainWorld('api', {
    runDemucs: (inputPath, outputPath, model, mp3Preset) => {
        ipcRenderer.send('run-demucs', { inputPath, outputPath, model, mp3Preset });
    },
    receive: (channel, func) => {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
    },
    selectPath: async (type, callback) => {
        const path = await ipcRenderer.invoke('select-path', type);
        callback(path);
    },
    openLogFile: () => {
        ipcRenderer.invoke('open-log-file');
    },
    openExternal: (url) => {
        shell.openExternal(url);
    },

    // Software key methods
    saveSoftwareKey: async (key) => {
        return await ipcRenderer.invoke('save-software-key', key);
    },
    getSavedKey: async () => {
        return await ipcRenderer.invoke('get-saved-key');
    },
    removeSavedKey: async () => {
        return await ipcRenderer.invoke('remove-saved-key');
    },

    // Existing methods
    checkValidKey: async () => {
        return await ipcRenderer.invoke('check-valid-key');
    },
    activateSoftwareKey: async (encryptedKey) => {
        return await ipcRenderer.invoke('activate-software-key', encryptedKey);
    },
    checkSubscriptionStatus: async () => {
        return await ipcRenderer.invoke('check-subscription-status');
    }
});
