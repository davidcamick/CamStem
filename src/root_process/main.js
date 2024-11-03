const { app, BrowserWindow, Menu, shell } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, "../assets/logo.ico"), // Set app icon
    title: "CamStem v0.1",                            // Set app title
    webPreferences: {
      preload: path.join(__dirname, "../root_process/preload.js"), // Preload script in root_process folder
      contextIsolation: true,                                     // Keep context isolation for security
      enableRemoteModule: false,                                  // Disable remote module for security
      nodeIntegration: true,                                      // Enable Node.js modules in preload
    },
  });

  // Load the login page from the login_process folder
  win.loadFile(path.join(__dirname, "../login_process/login.html"));
}

// Set up the application menu with default options and custom Help links
const template = [
  {
    label: "File",
    submenu: [
      { role: "close" },
      { role: "quit" }
    ],
  },
  {
    label: "Edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      { role: "selectAll" }
    ],
  },
  {
    label: "View",
    submenu: [
      { role: "reload" },
      { role: "forceReload" },
      { role: "toggleDevTools" },
      { type: "separator" },
      { role: "resetZoom" },
      { role: "zoomIn" },
      { role: "zoomOut" },
      { type: "separator" },
      { role: "togglefullscreen" }
    ],
  },
  {
    label: "Window",
    submenu: [
      { role: "minimize" },
      { role: "zoom" },
      { role: "close" }
    ],
  },
  {
    label: "Help",
    submenu: [
      {
        label: "Documentation",
        click: async () => {
          await shell.openExternal("https://github.com/davidcamick/CamStem");
        },
      },
      {
        label: "Support",
        click: async () => {
          await shell.openExternal("https://www.instagram.com/davidcamick/");
        },
      },
    ],
  },
];

app.whenReady().then(() => {
  createWindow();

  // Set up and apply the complete menu
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
});

// Quit the app when all windows are closed, except on macOS
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// Re-create a window if the app is re-activated (for macOS)
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
