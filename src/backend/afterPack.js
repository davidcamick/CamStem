// src/backend/afterPack.js
const fs = require("fs");
const path = require("path");

module.exports = async context => {
  // Only fix file permissions if we're building for mac
  if (context.electronPlatformName !== "darwin") {
    console.log("Skipping afterPack chmod for non-mac platform.");
    return;
  }

  // The output directory for the mac build
  const outDir = context.appOutDir;
  // Typically the .app is named after your productName, e.g. "CamStem.app"
  const appName = `${context.packager.appInfo.productFilename}.app`;
  // Construct the path to demucs-cxfreeze
  const demucsPath = path.join(
    outDir,
    appName,
    "Contents",
    "Resources",
    "demucs-cxfreeze-mac",
    "demucs-cxfreeze"
  );

  try {
    fs.chmodSync(demucsPath, 0o755);
    console.log(`afterPack.js: Marked demucs-cxfreeze as executable.`);
  } catch (err) {
    console.warn(`afterPack.js: Could not chmod +x demucs-cxfreeze: ${err.message}`);
  }
};
