const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectFile: () => ipcRenderer.invoke('select-file'),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  splitStems: (args) => ipcRenderer.invoke('split-stems', args),
  getLogPath: () => ipcRenderer.invoke('get-log-path') // New API for log path
});
