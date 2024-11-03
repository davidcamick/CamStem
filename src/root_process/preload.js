const { contextBridge } = require("electron");
const path = require("path");

try {
  // Dynamically require auth.js from login_process
  const authPath = path.join(__dirname, "../login_process/auth.js");
  const { verifyLogin } = require(authPath);

  // Expose the verifyLogin function to the renderer process securely
  contextBridge.exposeInMainWorld("authAPI", {
    verifyLogin: (username, password) => verifyLogin(username, password),
  });

  console.log("preload.js: Successfully loaded auth.js and exposed verifyLogin.");
} catch (error) {
  console.error("preload.js: Failed to load auth.js", error);
}
