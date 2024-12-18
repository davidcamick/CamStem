const { autoUpdater } = require('electron-updater');
const { dialog } = require('electron');

// This file initializes the auto-updater. It checks GitHub Releases as configured in package.json.
// The electron-updater library automatically selects the correct binary for the user's platform
// based on what you have uploaded as release assets (e.g., .dmg for macOS, .exe/.msi for Windows).

function initAutoUpdater() {
    autoUpdater.on('update-available', () => {
        // You could notify the user here that an update is downloading if desired.
    });

    autoUpdater.on('update-downloaded', () => {
        const response = dialog.showMessageBoxSync({
            type: 'info',
            buttons: ['Restart', 'Later'],
            title: 'Update Available',
            message: 'An update has been downloaded. Restart now to apply the update?'
        });

        if (response === 0) {
            autoUpdater.quitAndInstall();
        }
    });

    autoUpdater.checkForUpdatesAndNotify();
}

module.exports = initAutoUpdater;
