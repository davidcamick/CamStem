// Define available software options (same as in assetsassistant.js)
const SOFTWARE_OPTIONS = [
    'Premiere Pro',
    'After Effects', 
    'DaVinci Resolve',
    'Blender',
    'C4D',
    'Final Cut Pro',
    'CapCut'
];

// Global settings object
let appSettings = {
    folderDefaults: {},
    defaultParentPath: '',
    folderOperations: {},
    defaultSoftware: []
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set up tabs
    setupTabs();
    
    // Load all settings
    loadAllSettings();
    
    // Add event listener for default parent directory button
    document.getElementById('selectDefaultParentBtn').addEventListener('click', selectDefaultParentPath);
});

// Setup tabs
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const tabId = button.dataset.tab;
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
}

// Load all settings
function loadAllSettings() {
    loadFolderDefaults();
    loadDefaultParentPath();
    loadFolderOperations();
    loadDefaultSoftware();
}

// ======================== FOLDER DEFAULTS TAB ========================
function loadFolderDefaults() {
    // Get saved folder defaults
    const savedDefaults = JSON.parse(localStorage.getItem('folder-defaults') || '{}');
    appSettings.folderDefaults = savedDefaults;
    
    // Update UI
    const folderDefaultsList = document.getElementById('folder-defaults-list');
    folderDefaultsList.innerHTML = '';
    
    // Create UI elements for each folder default
    Object.entries(savedDefaults).forEach(([folderName, config]) => {
        addFolderDefaultToUI(folderName, config);
    });

    // Show common folders
    showCommonFolders();
}

function addFolderDefaultToUI(folderName, config) {
    const folderDefaultsList = document.getElementById('folder-defaults-list');
    
    const div = document.createElement('div');
    div.className = 'folder-item';
    div.innerHTML = `
        <div class="flex justify-between items-center mb-3">
            <div class="font-medium">${folderName}</div>
            <div class="flex space-x-2 items-center">
                <label class="flex items-center space-x-2">
                    <span class="text-sm">Lock Path</span>
                    <span class="toggle-switch">
                        <input type="checkbox" class="folder-lock" data-folder="${folderName}" 
                            ${config.locked ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                    </span>
                </label>
                <button class="btn text-red-500" onclick="removeFolderDefault('${folderName}')">
                    Remove
                </button>
            </div>
        </div>
        <div class="flex space-x-2">
            <div class="path-display flex-1 ${config.path ? 'text-green-300' : 'text-blue-300'}">
                ${config.path || 'No path selected'}
            </div>
            <button class="btn select-path-btn" data-folder="${folderName}">
                Choose Path
            </button>
        </div>
    `;
    
    folderDefaultsList.appendChild(div);
    
    // Add event listeners
    div.querySelector('.folder-lock').addEventListener('change', (e) => {
        toggleFolderLock(folderName, e.target.checked);
    });
    
    div.querySelector('.select-path-btn').addEventListener('click', () => {
        selectFolderDefaultPath(folderName);
    });
}

function addFolderDefault() {
    const input = document.getElementById('new-folder-name');
    const folderName = input.value.trim();
    
    if (!folderName) {
        alert('Please enter a folder name');
        return;
    }
    
    if (appSettings.folderDefaults[folderName]) {
        alert('This folder type already exists');
        return;
    }
    
    appSettings.folderDefaults[folderName] = {
        path: '',
        locked: false
    };
    
    // Save to localStorage
    localStorage.setItem('folder-defaults', JSON.stringify(appSettings.folderDefaults));
    
    // Update UI
    addFolderDefaultToUI(folderName, appSettings.folderDefaults[folderName]);
    
    // Clear input
    input.value = '';
    
    // Also add to operations tab
    addFolderOperationToUI(folderName, 'copy');
}

// Add new function to show common folders
function showCommonFolders() {
    const commonFolders = new Set();
    
    // Get folders from built-in presets in assetsassistant.js
    const defaultPresets = {
        'Basic Video': ['Footage', 'Assets', 'Exports', 'Project Files'],
        'Advanced Project': ['Footage', 'Assets', 'Song', 'Templates', 'Branding', 'Exports', 'Project Files', 'Deliverables']
    };
    
    // Add all preset folders to the set
    Object.values(defaultPresets).forEach(folders => {
        folders.forEach(folder => commonFolders.add(folder));
    });
    
    // Get any user-created presets
    const userPresets = JSON.parse(localStorage.getItem('projectPresets') || '[]');
    userPresets.forEach(preset => {
        preset.folders?.forEach(folder => commonFolders.add(folder));
    });
    
    // Create the suggestions UI
    const commonFoldersList = document.createElement('div');
    commonFoldersList.className = 'flex flex-wrap gap-2 mt-2';
    
    Array.from(commonFolders).sort().forEach(folder => {
        const button = document.createElement('button');
        button.className = 'px-2 py-1 text-sm bg-gray-800 rounded hover:bg-gray-700 transition-colors';
        button.textContent = folder;
        button.onclick = () => {
            document.getElementById('new-folder-name').value = folder;
        };
        commonFoldersList.appendChild(button);
    });
    
    // Update the DOM
    const input = document.getElementById('new-folder-name');
    const existingList = document.getElementById('common-folders-list');
    if (existingList) {
        existingList.replaceWith(commonFoldersList);
    } else {
        input.parentNode.insertBefore(commonFoldersList, input.nextSibling);
    }
    commonFoldersList.id = 'common-folders-list';
}

function removeFolderDefault(folderName) {
    if (!confirm(`Are you sure you want to remove the ${folderName} folder default?`)) {
        return;
    }
    
    // Remove from settings
    delete appSettings.folderDefaults[folderName];
    
    // Save to localStorage
    localStorage.setItem('folder-defaults', JSON.stringify(appSettings.folderDefaults));
    
    // Update UI
    loadFolderDefaults();
    
    // Also update operations tab
    delete appSettings.folderOperations[folderName];
    localStorage.setItem('folder-operations', JSON.stringify(appSettings.folderOperations));
    loadFolderOperations();
}

function toggleFolderLock(folderName, isLocked) {
    appSettings.folderDefaults[folderName].locked = isLocked;
    localStorage.setItem('folder-defaults', JSON.stringify(appSettings.folderDefaults));
    
    // If we're unlocking, also clear the folder-config for this folder
    if (!isLocked) {
        localStorage.removeItem(`folder-config-${folderName}`);
    } else if (appSettings.folderDefaults[folderName].path) {
        // If locking and path exists, save to folder-config
        localStorage.setItem(`folder-config-${folderName}`, JSON.stringify({
            locked: true,
            path: appSettings.folderDefaults[folderName].path,
            isEmpty: false
        }));
    }
}

// Update the selectFolderDefaultPath function to check if folder exists
async function selectFolderDefaultPath(folderName) {
    const path = await window.api.selectPath('folder');
    if (path) {
        // Check if folder exists
        const result = await window.api.checkFolderExists(path);
        
        if (!result.exists) {
            alert(`Warning: The selected folder does not exist or is not accessible.`);
            return;
        }
        
        appSettings.folderDefaults[folderName].path = path;
        localStorage.setItem('folder-defaults', JSON.stringify(appSettings.folderDefaults));
        
        // If folder is locked, also update folder-config
        if (appSettings.folderDefaults[folderName].locked) {
            localStorage.setItem(`folder-config-${folderName}`, JSON.stringify({
                locked: true,
                path: path,
                isEmpty: false
            }));
        }
        
        // Save settings to backend for future use
        await window.api.saveSettings({ folderDefaults: appSettings.folderDefaults });
        
        // Refresh UI
        loadFolderDefaults(); 
    }
}

// ======================== DEFAULT PATHS TAB ========================
function loadDefaultParentPath() {
    const defaultPath = localStorage.getItem('defaultOutputLocation') || '';
    appSettings.defaultParentPath = defaultPath;
    
    const defaultPathEl = document.getElementById('defaultParentPath');
    defaultPathEl.textContent = defaultPath || 'No default path selected';
    defaultPathEl.className = `mt-2 ${defaultPath ? 'text-green-300' : 'text-blue-300'} path-display`;
}

// Update selectDefaultParentPath to check if folder exists
async function selectDefaultParentPath() {
    const path = await window.api.selectPath('folder');
    if (path) {
        // Check if folder exists
        const result = await window.api.checkFolderExists(path);
        
        if (!result.exists) {
            alert(`Warning: The selected folder does not exist or is not accessible.`);
            return;
        }
        
        appSettings.defaultParentPath = path;
        localStorage.setItem('defaultOutputLocation', path);
        
        // Save settings to backend for future use
        await window.api.saveSettings({ defaultParentPath: path });
        
        // Update UI
        const defaultPathEl = document.getElementById('defaultParentPath');
        defaultPathEl.textContent = path;
        defaultPathEl.className = 'mt-2 text-green-300 path-display';
    }
}

// ======================== FILE OPERATIONS TAB ========================
function loadFolderOperations() {
    // Get saved folder operations
    const savedOperations = JSON.parse(localStorage.getItem('folder-operations') || '{}');
    appSettings.folderOperations = savedOperations;
    
    // Update UI
    const folderOperationsList = document.getElementById('folder-operations-list');
    folderOperationsList.innerHTML = '';
    
    // Add operations for all folder defaults
    Object.keys(appSettings.folderDefaults).forEach(folderName => {
        const operation = savedOperations[folderName] || 'copy';
        addFolderOperationToUI(folderName, operation);
    });
}

function addFolderOperationToUI(folderName, operation) {
    const folderOperationsList = document.getElementById('folder-operations-list');
    
    const div = document.createElement('div');
    div.className = 'folder-item';
    div.innerHTML = `
        <div class="flex justify-between items-center">
            <div class="font-medium">${folderName}</div>
        </div>
        <div class="mt-3 flex space-x-4">
            <label class="flex items-center space-x-2">
                <input type="radio" name="operation-${folderName}" value="copy" data-folder="${folderName}" 
                    ${operation === 'copy' ? 'checked' : ''}>
                <span>Copy (keep original files)</span>
            </label>
            <label class="flex items-center space-x-2">
                <input type="radio" name="operation-${folderName}" value="move" data-folder="${folderName}" 
                    ${operation === 'move' ? 'checked' : ''}>
                <span>Move (relocate files)</span>
            </label>
        </div>
    `;
    
    folderOperationsList.appendChild(div);
    
    // Add event listeners
    div.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.checked) {
                updateFolderOperation(folderName, e.target.value);
            }
        });
    });
}

function updateFolderOperation(folderName, operation) {
    appSettings.folderOperations[folderName] = operation;
    localStorage.setItem('folder-operations', JSON.stringify(appSettings.folderOperations));
}

// ======================== PROJECT FILES TAB ========================
function loadDefaultSoftware() {
    // Get saved default software
    const savedDefaultSoftware = JSON.parse(localStorage.getItem('default-software') || '[]');
    appSettings.defaultSoftware = savedDefaultSoftware;
    
    // Update UI
    const defaultSoftwareOptions = document.getElementById('default-software-options');
    defaultSoftwareOptions.innerHTML = '';
    
    // Add built-in software options
    SOFTWARE_OPTIONS.forEach(software => {
        const isChecked = savedDefaultSoftware.includes(software);
        defaultSoftwareOptions.innerHTML += `
            <label class="flex items-center space-x-2 bg-gray-800 p-2 rounded hover:bg-gray-700 cursor-pointer">
                <input type="checkbox" class="default-software-option" 
                    data-software="${software}" ${isChecked ? 'checked' : ''}>
                <span>${software}</span>
            </label>
        `;
    });
    
    // Add event listeners
    document.querySelectorAll('.default-software-option').forEach(checkbox => {
        checkbox.addEventListener('change', handleDefaultSoftwareChange);
    });
    
    // Load custom software
    loadDefaultCustomSoftware();
}

function handleDefaultSoftwareChange(e) {
    const software = e.target.dataset.software;
    const isChecked = e.target.checked;
    
    if (isChecked && !appSettings.defaultSoftware.includes(software)) {
        appSettings.defaultSoftware.push(software);
    } else if (!isChecked) {
        const index = appSettings.defaultSoftware.indexOf(software);
        if (index > -1) {
            appSettings.defaultSoftware.splice(index, 1);
        }
    }
    
    localStorage.setItem('default-software', JSON.stringify(appSettings.defaultSoftware));
}

function loadDefaultCustomSoftware() {
    const customSoftwareList = JSON.parse(localStorage.getItem('custom-default-software') || '[]');
    const container = document.getElementById('custom-default-software-list');
    container.innerHTML = '';
    
    customSoftwareList.forEach(software => {
        const isChecked = appSettings.defaultSoftware.includes(software);
        container.innerHTML += `
            <div class="flex items-center justify-between bg-gray-800 p-2 rounded">
                <label class="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" class="default-software-option" 
                        data-software="${software}" ${isChecked ? 'checked' : ''}>
                    <span>${software}</span>
                </label>
                <button onclick="removeDefaultCustomSoftware('${software}')" class="text-red-500 hover:text-red-300">×</button>
            </div>
        `;
    });
    
    // Add event listeners
    document.querySelectorAll('.default-software-option').forEach(checkbox => {
        checkbox.addEventListener('change', handleDefaultSoftwareChange);
    });
}

function addDefaultCustomSoftware() {
    const input = document.getElementById('custom-default-software');
    const software = input.value.trim();
    
    if (!software) {
        return;
    }
    
    // Get existing custom software
    const customSoftwareList = JSON.parse(localStorage.getItem('custom-default-software') || '[]');
    
    // Check if it already exists
    if (customSoftwareList.includes(software)) {
        alert('This software is already in the list');
        return;
    }
    
    // Add to the list
    customSoftwareList.push(software);
    localStorage.setItem('custom-default-software', JSON.stringify(customSoftwareList));
    
    // Add to default software
    if (!appSettings.defaultSoftware.includes(software)) {
        appSettings.defaultSoftware.push(software);
        localStorage.setItem('default-software', JSON.stringify(appSettings.defaultSoftware));
    }
    
    // Clear input
    input.value = '';
    
    // Refresh UI
    loadDefaultCustomSoftware();
}

function removeDefaultCustomSoftware(software) {
    // Remove from custom software list
    const customSoftwareList = JSON.parse(localStorage.getItem('custom-default-software') || '[]');
    const index = customSoftwareList.indexOf(software);
    if (index > -1) {
        customSoftwareList.splice(index, 1);
        localStorage.setItem('custom-default-software', JSON.stringify(customSoftwareList));
    }
    
    // Remove from default software
    const softwareIndex = appSettings.defaultSoftware.indexOf(software);
    if (softwareIndex > -1) {
        appSettings.defaultSoftware.splice(softwareIndex, 1);
        localStorage.setItem('default-software', JSON.stringify(appSettings.defaultSoftware));
    }
    
    // Refresh UI
    loadDefaultCustomSoftware();
}

// ======================== RESET SETTINGS TAB ========================
function showResetConfirmation() {
    document.getElementById('resetModal').classList.remove('hidden');
}

function hideResetModal() {
    document.getElementById('resetModal').classList.add('hidden');
}

// Update confirmResetAllSettings to sync with backend
async function confirmResetAllSettings() {
    try {
        // Clear all project presets
        localStorage.removeItem('projectPresets');
        
        // Clear default location
        localStorage.removeItem('defaultOutputLocation');
        
        // Clear all folder configurations
        const allKeys = Object.keys(localStorage);
        allKeys.forEach(key => {
            if (key.startsWith('folder-config-')) {
                localStorage.removeItem(key);
            }
        });
        
        // Clear folder defaults
        localStorage.removeItem('folder-defaults');
        
        // Clear folder operations
        localStorage.removeItem('folder-operations');
        
        // Clear default software
        localStorage.removeItem('default-software');
        localStorage.removeItem('custom-default-software');
        
        // Reset app settings
        appSettings = {
            folderDefaults: {},
            defaultParentPath: '',
            folderOperations: {},
            defaultSoftware: []
        };
        
        // Sync reset with backend
        await window.api.saveSettings({ reset: true });
        
        // Reload settings panel
        loadAllSettings();
        
        // Show success message
        alert('All settings have been reset successfully.');
        
        // Hide reset modal
        hideResetModal();
    } catch (error) {
        alert('Error resetting settings: ' + error.message);
    } finally {
        hideResetModal();
    }
}
