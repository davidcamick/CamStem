const { contextBridge, ipcRenderer } = require("electron");
const path = require("path");

try {
  const authPath = path.join(__dirname, "../login_process/auth.js");
  const { verifyLogin } = require(authPath);

  contextBridge.exposeInMainWorld("authAPI", {
    verifyLogin: (username, password) => verifyLogin(username, password),
  });

  console.log("preload.js: Successfully loaded auth.js and exposed verifyLogin.");
} catch (error) {
  console.error("preload.js: Failed to load auth.js", error);
}

// Expose functions to the renderer process
contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: {
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
    invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
  }
});
