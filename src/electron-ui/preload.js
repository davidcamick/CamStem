const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectFile: () => ipcRenderer.invoke('select-file'),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  splitStems: (args) => ipcRenderer.send('split-stems', args),
  onProcessLog: (callback) => ipcRenderer.on('process-log', (event, log) => callback(log)),
});
