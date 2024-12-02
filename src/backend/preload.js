const { contextBridge, ipcRenderer } = require('electron');

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
});
