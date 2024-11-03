const { contextBridge } = require("electron");
const path = require("path");

// Update authPath to point to auth.js in the login_process folder
const authPath = path.join(__dirname, "../login_process/auth");

try {
  const { verifyLogin } = require(authPath);

  contextBridge.exposeInMainWorld("authAPI", {
    verifyLogin: (username, password) => verifyLogin(username, password),
  });

  console.log("preload.js: Successfully loaded auth.js and exposed verifyLogin.");
} catch (error) {
  console.error("preload.js: Failed to load auth.js", error);
}
