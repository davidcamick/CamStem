let currentStep = 1;
let projectConfig = {
    projectName: '',
    parentPath: '',
    selectedPreset: null,
    linkedFolders: [],
    settings: {
        versioning: false,
        metadata: true
    }
};

// Define available software options
const SOFTWARE_OPTIONS = [
    'Premiere Pro',
    'After Effects', 
    'DaVinci Resolve',
    'Blender',
    'C4D',
    'Final Cut Pro',
    'CapCut'
];

const DEFAULT_PRESETS = {
    'Basic Video': {
        name: 'Basic Video',
        folders: ['Footage', 'Assets', 'Exports', 'Project Files'],
        isDefault: true
    },
    'Advanced Project': {
        name: 'Advanced Project',
        folders: ['Footage', 'Assets', 'Song', 'Templates', 'Branding', 'Exports', 'Project Files', 'Deliverables'],
        isDefault: true
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadPresets();
    updateStepVisibility();
    updateProgressBar();
    
    // Load default location if exists
    const defaultLocation = localStorage.getItem('defaultOutputLocation');
    if (defaultLocation) {
        projectConfig.parentPath = defaultLocation;
        document.getElementById('selectedOutput').textContent = defaultLocation;
        document.getElementById('setDefaultLocation').checked = true;
    }
    
    // Add project name input handler
    document.getElementById('projectName').addEventListener('input', (e) => {
        projectConfig.projectName = e.target.value.trim();
    });
});

// Add these functions after the existing initialization code
function showResetConfirmation() {
    document.getElementById('resetModal').classList.remove('hidden');
}

function hideResetModal() {
    document.getElementById('resetModal').classList.add('hidden');
}

async function resetAllSettings() {
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
        
        // Reset current project config
        projectConfig = {
            projectName: '',
            parentPath: '',
            selectedPreset: null,
            linkedFolders: [],
            settings: {
                versioning: false,
                metadata: true
            }
        };

        // Update UI
        document.getElementById('projectName').value = '';
        document.getElementById('selectedOutput').textContent = '';
        document.getElementById('setDefaultLocation').checked = false;
        document.getElementById('linkedFolders').innerHTML = '';
        
        // Hide modal
        hideResetModal();
        
        // Refresh presets list
        await loadPresets();
        
        // Show success message
        alert('All settings have been reset successfully.');
        
        // Return to first step
        currentStep = 1;
        updateStepVisibility();
        updateProgressBar();
    } catch (error) {
        alert('Error resetting settings: ' + error.message);
    } finally {
        hideResetModal();
    }
}

// Step Navigation
function updateStepVisibility() {
    document.querySelectorAll('.step-container').forEach(container => {
        container.classList.remove('active');
    });
    document.getElementById(`step${currentStep}`).classList.add('active');
    
    // Update step indicators
    document.querySelectorAll('.step-indicator').forEach(indicator => {
        const step = parseInt(indicator.dataset.step);
        indicator.classList.toggle('text-blue-300', step === currentStep);
        indicator.classList.toggle('text-gray-400', step !== currentStep);
    });
}

function updateProgressBar() {
    const progress = (currentStep - 1) * (100/3); // 3 steps total
    document.getElementById('progress-bar').style.width = `${progress}%`;
}

function nextStep() {
    if (validateCurrentStep()) {
        currentStep = Math.min(currentStep + 1, 4);
        updateStepVisibility();
        updateProgressBar();
        if (currentStep === 4) {
            updatePathsReview();
        }
    }
}

function previousStep() {
    currentStep = Math.max(currentStep - 1, 1);
    updateStepVisibility();
    updateProgressBar();
}

// Step 1: Output Location
document.getElementById('selectOutputBtn').addEventListener('click', async () => {
    const path = await window.api.selectPath('folder');
    if (path) {
        projectConfig.parentPath = path;
        document.getElementById('selectedOutput').textContent = path;
    }
});

document.getElementById('setDefaultLocation').addEventListener('change', async (e) => {
    if (e.target.checked) {
        localStorage.setItem('defaultOutputLocation', projectConfig.parentPath);
    } else {
        localStorage.removeItem('defaultOutputLocation');
    }
});

// Step 2: Presets
async function loadPresets() {
    const userPresets = JSON.parse(localStorage.getItem('projectPresets') || '[]');
    const presetsList = document.getElementById('presetsList');
    presetsList.innerHTML = '';
    
    // First, add default presets
    Object.values(DEFAULT_PRESETS).forEach(preset => {
        const div = document.createElement('div');
        div.className = 'folder-item hover:border-blue-400';
        div.innerHTML = `
            <div class="flex justify-between items-center mb-3">
                <div class="flex items-center space-x-2">
                    <span class="font-bold text-lg">${preset.name}</span>
                    <span class="text-xs bg-blue-500 px-2 py-1 rounded">Default</span>
                </div>
                <div>
                    <button class="btn select-preset" data-preset="${preset.name}" data-default="true">Select</button>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-2 mt-2">
                ${preset.folders.map(folder => `
                    <div class="bg-gray-800 rounded px-3 py-2 text-sm">
                        📁 ${folder}
                    </div>
                `).join('')}
            </div>
        `;
        presetsList.appendChild(div);
    });
    
    // Then add user presets
    userPresets.forEach(preset => {
        const div = document.createElement('div');
        div.className = 'folder-item hover:border-blue-400';
        div.innerHTML = `
            <div class="flex justify-between items-center mb-3">
                <span class="font-bold text-lg">${preset.name}</span>
                <div>
                    <button class="btn select-preset" data-preset="${preset.name}">Select</button>
                    <button class="btn ml-2 delete-preset" data-preset="${preset.name}">Delete</button>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-2 mt-2">
                ${preset.folders.map(folder => `
                    <div class="bg-gray-800 rounded px-3 py-2 text-sm">
                        📁 ${folder}
                    </div>
                `).join('')}
            </div>
        `;
        presetsList.appendChild(div);
    });

    // Add event listeners after creating elements
    document.querySelectorAll('.select-preset').forEach(button => {
        button.addEventListener('click', (e) => {
            const presetName = e.target.dataset.preset;
            const isDefault = e.target.dataset.default === 'true';
            selectPreset(presetName, isDefault);
        });
    });

    document.querySelectorAll('.delete-preset').forEach(button => {
        button.addEventListener('click', (e) => {
            const presetName = e.target.dataset.preset;
            deletePreset(presetName);
        });
    });
}

// Update the preset selection function
async function selectPreset(presetName, isDefault = false) {
    let preset;
    if (isDefault) {
        preset = DEFAULT_PRESETS[presetName];
    } else {
        const presets = JSON.parse(localStorage.getItem('projectPresets') || '[]');
        preset = presets.find(p => p.name === presetName);
    }
    
    if (!preset) return;
    
    projectConfig.selectedPreset = preset;
    
    // Reset linked folders when changing presets
    projectConfig.linkedFolders = [];
    
    // Visual feedback
    document.querySelectorAll('.folder-item').forEach(item => {
        item.classList.remove('border-blue-500');
    });
    const selectedItem = document.querySelector(`[data-preset="${presetName}"]`).closest('.folder-item');
    selectedItem.classList.add('border-blue-500');

    // Update the linked folders view with preset folders
    updateLinkedFoldersFromPreset(preset);

    // Automatically advance to next step
    nextStep();
}

function showNewPresetForm() {
    document.getElementById('newPresetForm').classList.remove('hidden');
}

function addFolderToStructure() {
    const div = document.createElement('div');
    div.className = 'flex space-x-2';
    div.innerHTML = `
        <input type="text" placeholder="Folder Name" class="folder-name w-full p-2 bg-gray-800 rounded">
        <button onclick="this.parentElement.remove()" class="btn">Remove</button>
    `;
    document.getElementById('folderStructure').appendChild(div);
}

async function saveNewPreset() {
    const name = document.getElementById('presetName').value;
    if (!name) return;
    
    // Check if name conflicts with default presets
    if (DEFAULT_PRESETS[name]) {
        alert('This preset name is reserved for default presets. Please choose a different name.');
        return;
    }

    const folders = Array.from(document.querySelectorAll('.folder-name'))
        .map(input => input.value)
        .filter(name => name);

    const preset = {
        name,
        folders,
        created: new Date().toISOString()
    };

    const presets = JSON.parse(localStorage.getItem('projectPresets') || '[]');
    presets.push(preset);
    localStorage.setItem('projectPresets', JSON.stringify(presets));

    await loadPresets();
    document.getElementById('newPresetForm').classList.add('hidden');
    document.getElementById('presetName').value = '';
    document.getElementById('folderStructure').innerHTML = '';
}

// Add this new function to handle preset folder display
function updateLinkedFoldersFromPreset(preset) {
    const container = document.getElementById('linkedFolders');
    container.innerHTML = ''; // Clear existing content
    
    if (!preset || !preset.folders) return;

    // Create single column grid container
    const grid = document.createElement('div');
    grid.className = 'space-y-4'; // Changed from grid to vertical stack
    
    preset.folders.forEach(folderName => {
        const div = document.createElement('div');
        div.className = 'folder-item';
        div.setAttribute('data-folder', folderName);
        
        // Get saved path and locked status from localStorage
        const savedConfig = JSON.parse(localStorage.getItem(`folder-config-${folderName}`) || '{}');
        const isLocked = savedConfig.locked || false;
        const savedPath = savedConfig.locked ? (savedConfig.path || '') : '';
        const isEmpty = savedConfig.isEmpty || false;
        
        // If not locked, clear the saved config
        if (!isLocked) {
            localStorage.removeItem(`folder-config-${folderName}`);
        }
        
        div.innerHTML = `
            <div class="flex justify-between items-center mb-2">
                <span class="font-bold">${folderName}</span>
                <div class="flex space-x-2">
                    <button onclick="toggleLock('${folderName}')" class="btn-icon lock-btn ${isLocked ? 'locked' : ''}">
                        ${isLocked ? '🔒' : '🔓'}
                    </button>
                </div>
            </div>
            <div class="flex flex-col space-y-2">
                <div class="text-sm path-display ${savedPath ? 'text-green-300' : 'text-blue-300'}">
                    ${savedPath || 'No path selected'}
                </div>
                <div class="flex space-x-2">
                    <button onclick="linkFolder('${folderName}')" 
                        class="btn flex-1 ${savedPath ? 'bg-green-600 hover:bg-green-700' : isEmpty ? 'bg-red-600 hover:bg-red-700' : ''}">
                        ${savedPath ? 'Folder Linked' : isEmpty ? 'Empty (Click to Link)' : 'Link Folder'}
                    </button>
                    <button onclick="clearFolder('${folderName}')" 
                        class="btn flex-1 ${isEmpty ? 'bg-red-600 hover:bg-red-700' : ''}">
                        ${isEmpty ? 'Marked Empty' : 'Leave Empty'}
                    </button>
                </div>
            </div>
        `;
        
        grid.appendChild(div);

        // If folder is locked and has a saved path, automatically link it
        if (isLocked && savedPath) {
            projectConfig.linkedFolders.push({
                name: folderName,
                path: savedPath,
                action: 'copy',
                locked: true
            });
        }
    });
    
    container.appendChild(grid);
}

// Add these new helper functions
async function linkFolder(folderName) {
    const status = getFolderStatus(folderName);
    if (status.isLocked) return;

    const path = await window.api.selectPath('folder');
    if (!path) return;

    status.savedPath = path;
    status.isEmpty = false;

    // Update projectConfig first
    const folderConfig = {
        name: folderName,
        path: path,
        action: 'copy',
        locked: status.isLocked,
        isEmpty: false
    };

    // Remove any existing folder with same name
    projectConfig.linkedFolders = projectConfig.linkedFolders.filter(f => f.name !== folderName);
    
    // Add the new folder configuration
    projectConfig.linkedFolders.push(folderConfig);

    // Update localStorage and UI
    if (status.isLocked) {
        saveFolderConfig(folderName, status);
    } else {
        localStorage.removeItem(`folder-config-${folderName}`);
    }
    
    // Update UI
    const folderDiv = document.querySelector(`[data-folder="${folderName}"]`);
    if (folderDiv) {
        updateFolderUI(folderDiv, folderName, status);
    }

    logConfig(); // Add this for debugging
}

function clearFolder(folderName) {
    const folderDiv = document.querySelector(`[data-folder="${folderName}"]`);
    const status = getFolderStatus(folderName);
    
    if (status.isEmpty) {
        // If it's already empty, revert to default state
        localStorage.removeItem(`folder-config-${folderName}`);
        
        // Remove from projectConfig if exists
        projectConfig.linkedFolders = projectConfig.linkedFolders.filter(f => f.name !== folderName);
        
        // Update UI to default state
        const pathDisplay = folderDiv.querySelector('.path-display');
        const linkButton = folderDiv.querySelector('button');
        const clearButton = folderDiv.querySelectorAll('button')[1];
        
        pathDisplay.textContent = 'No path selected';
        pathDisplay.className = 'path-display text-blue-300';
        
        linkButton.textContent = 'Link Folder';
        linkButton.className = 'btn flex-1';
        
        clearButton.textContent = 'Leave Empty';
        clearButton.className = 'btn flex-1';
    } else {
        // Mark as empty
        const folderConfig = {
            path: '',
            locked: false,
            isEmpty: true
        };
        localStorage.setItem(`folder-config-${folderName}`, JSON.stringify(folderConfig));
        
        // Update projectConfig
        const existingIndex = projectConfig.linkedFolders.findIndex(f => f.name === folderName);
        if (existingIndex >= 0) {
            projectConfig.linkedFolders[existingIndex].isEmpty = true;
        } else {
            projectConfig.linkedFolders.push({
                name: folderName,
                isEmpty: true,
                action: 'copy'
            });
        }
        
        // Update UI to empty state
        const pathDisplay = folderDiv.querySelector('.path-display');
        const linkButton = folderDiv.querySelector('button');
        const clearButton = folderDiv.querySelectorAll('button')[1];
        
        pathDisplay.textContent = 'No path selected (Marked as empty)';
        pathDisplay.classList.remove('text-green-300');
        pathDisplay.classList.add('text-blue-300');
        
        linkButton.textContent = 'Empty (Click to Link)';
        linkButton.classList.remove('bg-green-600', 'hover:bg-green-700');
        linkButton.classList.add('bg-red-600', 'hover:bg-red-700');
        
        clearButton.textContent = 'Undo Empty';
        clearButton.classList.add('bg-red-600', 'hover:bg-red-700');
    }

    logConfig();
}

// Step 3: Link Directories
function addNewFolderLink() {
    const div = document.createElement('div');
    div.className = 'folder-item';
    const id = Date.now();
    div.innerHTML = `
        <div class="flex justify-between items-center">
            <input type="text" placeholder="Folder Name" 
                class="bg-transparent border-b border-gray-600 mr-2"
                onchange="updateFolderName(${id}, this.value)">
            <button onclick="selectLinkedFolder(${id})" class="btn">Select Folder</button>
        </div>
        <div class="mt-2 text-sm text-blue-300 path-display"></div>
        <div class="mt-2 flex items-center space-x-4">
            <label class="flex items-center space-x-2">
                <input type="radio" name="action-${id}" value="copy" checked 
                    onchange="updateFolderAction(${id}, 'copy')">
                <span>Copy</span>
            </label>
            <label class="flex items-center space-x-2">
                <input type="radio" name="action-${id}" value="move"
                    onchange="updateFolderAction(${id}, 'move')">
                <span>Move</span>
            </label>
        </div>
    `;
    document.getElementById('linkedFolders').appendChild(div);
}

// Add these helper functions for updating folder properties
function updateFolderName(id, name) {
    const folder = projectConfig.linkedFolders.find(f => f.id === id);
    if (folder) {
        folder.name = name || 'Untitled Folder';
    }
}

function updateFolderAction(id, action) {
    const folder = projectConfig.linkedFolders.find(f => f.id === id);
    if (folder) {
        folder.action = action;
    }
}

// Update the selectLinkedFolder function
async function selectLinkedFolder(id) {
    const containerDiv = event.target.closest('.folder-item');
    const path = await window.api.selectPath('folder');
    if (path) {
        containerDiv.querySelector('.path-display').textContent = path;
        
        // Remove any existing folder with the same ID
        projectConfig.linkedFolders = projectConfig.linkedFolders.filter(f => f.id !== id);
        
        // Add the new folder configuration
        projectConfig.linkedFolders.push({
            id,
            name: containerDiv.querySelector('input[type="text"]').value || 'Untitled Folder',
            path,
            action: containerDiv.querySelector(`input[name="action-${id}"]:checked`).value
        });
    }
}

// Step 4: Final Settings & Process
function updatePathsReview() {
    const review = document.getElementById('pathsReview');
    review.innerHTML = `
        <div class="mb-2">Project Name: ${projectConfig.projectName}</div>
        <div class="mb-2">Parent Directory: ${projectConfig.parentPath}</div>
        <div class="mb-2">Preset: ${projectConfig.selectedPreset?.name || 'None'}</div>
        <div>Linked Folders:</div>
        ${projectConfig.linkedFolders.map(folder => {
            if (folder.isProjectFiles) {
                return `
                    <div class="ml-4 mb-2">
                        • ${folder.name}: ${folder.isEmpty ? '(Empty)' : 'Creating subfolders for ' + folder.software.join(', ')}
                    </div>
                `;
            } else {
                return `
                    <div class="ml-4 mb-2">
                        • ${folder.name}: ${folder.path || ''} 
                        ${folder.locked ? '🔒' : ''} 
                        ${folder.isEmpty ? '(Empty)' : `(${folder.action})`}
                    </div>
                `;
            }
        }).join('')}
    `;
}

// Add this debug helper
function logToConsole(message, data = null) {
    console.log(`[AssetsAssistant] ${message}`, data || '');
}

// Update startProcess function with better error handling and logging
async function startProcess() {
    try {
        if (!validateCurrentStep()) return;

        logToConsole('Starting process with config:', projectConfig);

        const config = {
            projectName: projectConfig.projectName,
            parentPath: projectConfig.parentPath,
            selectedPreset: projectConfig.selectedPreset,
            linkedFolders: projectConfig.linkedFolders.filter(f => !f.isEmpty),
            settings: {
                versioning: document.getElementById('enableVersioning').checked,
                metadata: document.getElementById('createMetadata').checked
            }
        };

        logToConsole('Processed config:', config);

        // Create progress overlay
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        overlay.innerHTML = `
            <div class="bg-gray-900 p-6 rounded-lg shadow-xl max-w-lg w-full mx-4">
                <h3 class="text-xl font-bold mb-4">Setting up project...</h3>
                <div class="space-y-4">
                    <div class="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                        <div id="progress-bar-process" class="bg-blue-500 h-full transition-all duration-300" style="width: 0%"></div>
                    </div>
                    <div class="text-sm space-y-2">
                        <div id="current-operation" class="text-blue-300"></div>
                        <div id="current-file" class="text-gray-400 truncate"></div>
                        <div id="progress-status" class="text-gray-400"></div>
                        <div id="size-status" class="text-gray-400"></div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        logToConsole('Created overlay, setting up progress handler');

        // Setup progress handler
        window.api.onProcessProgress((data) => {
            logToConsole('Progress update:', data);
            const progressBar = document.getElementById('progress-bar-process');
            const currentOp = document.getElementById('current-operation');
            const currentFile = document.getElementById('current-file');
            const progressStatus = document.getElementById('progress-status');
            const sizeStatus = document.getElementById('size-status');

            if (progressBar && currentOp && currentFile && progressStatus) {
                progressBar.style.width = `${data.percent}%`;
                currentOp.textContent = data.operation;
                currentFile.textContent = data.currentItem || '';
                progressStatus.textContent = `${data.completed} of ${data.total} items processed`;
                
                if (data.totalGB > 0) {
                    sizeStatus.textContent = `${data.processedGB} GB of ${data.totalGB} GB processed`;
                }
            }
        });

        logToConsole('Calling processAssets');
        const result = await window.api.processAssets(config);
        logToConsole('Process result:', result);

        // Remove overlay
        overlay.remove();

        if (result.success) {
            logToConsole('Process successful, opening folder:', result.projectDir);
            await window.api.openAnyFolder(result.projectDir);
            alert('Project setup completed successfully!');
            window.location.href = 'dashboard.html';
        } else {
            throw new Error(result.error || 'Unknown error occurred');
        }
    } catch (error) {
        logToConsole('Error in startProcess:', error);
        // Remove overlay if exists
        document.querySelector('.fixed.inset-0')?.remove();
        alert('Error setting up project: ' + error.message);
    }
}

// Fix the validateCurrentStep function
function validateCurrentStep() {
    switch(currentStep) {
        case 1:
            if (!projectConfig.projectName) {
                alert('Please enter a project name');
                return false;
            }
            if (!projectConfig.parentPath) {
                alert('Please select a parent directory');
                return false;
            }
            break;
        case 2:
            if (!projectConfig.selectedPreset) {
                alert('Please select or create a preset');
                return false;
            }
            break;
        case 3:
            // All folders should either have a path, be marked as empty, or be a Project Files folder with software selected
            const invalidFolders = projectConfig.linkedFolders.filter(
                f => {
                    if (f.isProjectFiles) {
                        // Project Files folders are valid if they have software selected or are marked as empty
                        return !f.isEmpty && (!f.software || f.software.length === 0);
                    } else {
                        // Regular folders need a path or to be marked as empty
                        return !f.path && !f.isEmpty;
                    }
                }
            );
            if (invalidFolders.length > 0) {
                alert('Please link or configure all folders before continuing');
                return false;
            }
            break;
    }
    return true;
}

async function deletePreset(presetName) {
    if (!confirm(`Are you sure you want to delete the preset "${presetName}"?`)) {
        return;
    }

    const presets = JSON.parse(localStorage.getItem('projectPresets') || '[]');
    const updatedPresets = presets.filter(p => p.name !== presetName);
    localStorage.setItem('projectPresets', JSON.stringify(updatedPresets));
    
    // Clear selected preset if it was the one deleted
    if (projectConfig.selectedPreset?.name === presetName) {
        projectConfig.selectedPreset = null;
        projectConfig.linkedFolders = [];
        document.getElementById('linkedFolders').innerHTML = '';
    }
    
    await loadPresets();
}

// Add these helper functions for folder status
function getFolderStatus(folderName) {
    const config = JSON.parse(localStorage.getItem(`folder-config-${folderName}`) || '{}');
    return {
        isLocked: config.locked || false,
        savedPath: config.locked ? (config.path || '') : '',
        isEmpty: config.isEmpty || false,
        isUsed: !!projectConfig.linkedFolders.find(f => f.name === folderName)
    };
}

function saveFolderConfig(folderName, config) {
    localStorage.setItem(`folder-config-${folderName}`, JSON.stringify({
        locked: config.isLocked,
        path: config.savedPath,
        isEmpty: config.isEmpty
    }));
}

// Enhance the updateLinkedFoldersFromPreset function
function updateLinkedFoldersFromPreset(preset) {
    const container = document.getElementById('linkedFolders');
    container.innerHTML = '';
    
    if (!preset?.folders?.length) {
        container.innerHTML = `
            <div class="text-center text-gray-400 py-8">
                No folders defined in this preset. 
                <button onclick="previousStep()" class="text-blue-400 hover:text-blue-300">
                    Go back to create some
                </button>
            </div>
        `;
        return;
    }

    preset.folders.forEach(folderName => {
        const status = getFolderStatus(folderName);
        const div = createFolderItem(folderName, status);
        container.appendChild(div);
        
        // Auto-link if locked and has saved path
        if (status.isLocked && status.savedPath) {
            autoLinkFolder(folderName, status.savedPath);
        }
    });
}

function createFolderItem(folderName, status) {
    const div = document.createElement('div');
    div.className = 'folder-item';
    div.setAttribute('data-folder', folderName);
    
    // Check if this is a Project Files folder
    if (isProjectFilesFolder(folderName)) {
        // Get any saved software selections from localStorage
        const savedSoftware = JSON.parse(localStorage.getItem(`project-files-${folderName}`) || '[]');
        
        div.innerHTML = `
            <div class="flex justify-between items-center mb-3">
                <div class="flex items-center space-x-2">
                    <span class="font-bold text-lg">${folderName}</span>
                    <span class="bg-purple-600 text-xs px-2 py-1 rounded">Special</span>
                </div>
            </div>
            <div class="text-sm mb-3">
                Select software to create dedicated subfolders:
            </div>
            <div id="software-options-${folderName}" class="grid grid-cols-2 gap-2 mb-3">
                ${SOFTWARE_OPTIONS.map(software => `
                    <label class="flex items-center space-x-2 bg-gray-800 p-2 rounded hover:bg-gray-700 cursor-pointer">
                        <input type="checkbox" class="software-option" 
                            data-folder="${folderName}" 
                            data-software="${software}"
                            ${savedSoftware.includes(software) ? 'checked' : ''}>
                        <span>${software}</span>
                    </label>
                `).join('')}
            </div>
            <div class="flex items-center space-x-2 mt-2">
                <input type="text" id="custom-software-${folderName}" 
                    placeholder="Add custom software..." 
                    class="flex-1 p-2 bg-gray-800 rounded">
                <button onclick="addCustomSoftware('${folderName}')" class="btn">Add</button>
            </div>
            <div id="custom-software-list-${folderName}" class="mt-2 grid grid-cols-2 gap-2">
                ${getCustomSoftwareHTML(folderName)}
            </div>
        `;
        
        // After adding to DOM, add event listeners to checkboxes
        setTimeout(() => {
            const checkboxes = div.querySelectorAll('.software-option');
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', handleSoftwareSelection);
            });
            
            // Configure folder
            updateProjectFilesConfig(folderName);
        }, 0);
        
        return div;
    }
    
    // Regular folder (non-project files)
    const buttonClass = status.isEmpty ? 'bg-red-600 hover:bg-red-700' : 
                       status.savedPath ? 'bg-green-600 hover:bg-green-700' : '';
    
    div.innerHTML = `
        <div class="flex justify-between items-center mb-3">
            <div class="flex items-center space-x-2">
                <span class="font-bold text-lg">${folderName}</span>
                <span class="lock-indicator cursor-pointer" onclick="toggleLock('${folderName}')">
                    ${status.isLocked ? '🔒' : '🔓'}
                </span>
            </div>
        </div>
        <div class="flex flex-col space-y-3">
            <div class="path-display ${status.savedPath ? 'text-green-300' : 'text-blue-300'}">
                ${status.savedPath || 'No path selected'}
            </div>
            <div class="flex space-x-2">
                <button onclick="linkFolder('${folderName}')" 
                    class="btn flex-1 ${buttonClass}" ${status.isLocked ? 'disabled' : ''}>
                    ${getButtonText(status)}
                </button>
                <button onclick="clearFolder('${folderName}')" 
                    class="btn flex-1 ${status.isEmpty ? 'bg-red-600 hover:bg-red-700' : ''}"
                    ${status.isLocked ? 'disabled' : ''}>
                    ${status.isEmpty ? 'Marked Empty' : 'Leave Empty'}
                </button>
            </div>
        </div>
    `;
    
    return div;
}

// Helper function to check if a folder is a Project Files folder
function isProjectFilesFolder(folderName) {
    return folderName === 'Project Files' || folderName === 'Project File';
}

// Handle software checkbox changes
function handleSoftwareSelection(e) {
    const folderName = e.target.dataset.folder;
    const software = e.target.dataset.software;
    const isChecked = e.target.checked;
    
    // Get current selections
    const savedSoftware = JSON.parse(localStorage.getItem(`project-files-${folderName}`) || '[]');
    
    if (isChecked && !savedSoftware.includes(software)) {
        savedSoftware.push(software);
    } else if (!isChecked) {
        const index = savedSoftware.indexOf(software);
        if (index > -1) savedSoftware.splice(index, 1);
    }
    
    // Save updated selections
    localStorage.setItem(`project-files-${folderName}`, JSON.stringify(savedSoftware));
    
    // Update project config
    updateProjectFilesConfig(folderName);
}

// Add custom software
function addCustomSoftware(folderName) {
    const inputElem = document.getElementById(`custom-software-${folderName}`);
    const customSoftware = inputElem.value.trim();
    
    if (!customSoftware) return;
    
    // Get current custom software list
    const customSoftwareList = JSON.parse(localStorage.getItem(`custom-software-${folderName}`) || '[]');
    
    if (!customSoftwareList.includes(customSoftware)) {
        customSoftwareList.push(customSoftware);
        localStorage.setItem(`custom-software-${folderName}`, JSON.stringify(customSoftwareList));
        
        // Update the UI
        const listElem = document.getElementById(`custom-software-list-${folderName}`);
        listElem.innerHTML = getCustomSoftwareHTML(folderName);
        
        // Add event listeners to the new checkboxes
        setTimeout(() => {
            const checkboxes = listElem.querySelectorAll('.software-option');
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', handleSoftwareSelection);
            });
        }, 0);
        
        // Clear the input
        inputElem.value = '';
    }
    
    // Update project config
    updateProjectFilesConfig(folderName);
}

// Remove custom software
function removeCustomSoftware(folderName, software) {
    // Remove from custom software list
    const customSoftwareList = JSON.parse(localStorage.getItem(`custom-software-${folderName}`) || '[]');
    const index = customSoftwareList.indexOf(software);
    if (index > -1) {
        customSoftwareList.splice(index, 1);
        localStorage.setItem(`custom-software-${folderName}`, JSON.stringify(customSoftwareList));
    }
    
    // Also remove from selected software if it was selected
    const selectedSoftware = JSON.parse(localStorage.getItem(`project-files-${folderName}`) || '[]');
    const selectedIndex = selectedSoftware.indexOf(software);
    if (selectedIndex > -1) {
        selectedSoftware.splice(selectedIndex, 1);
        localStorage.setItem(`project-files-${folderName}`, JSON.stringify(selectedSoftware));
    }
    
    // Update the UI
    const listElem = document.getElementById(`custom-software-list-${folderName}`);
    listElem.innerHTML = getCustomSoftwareHTML(folderName);
    
    // Add event listeners to the remaining checkboxes
    setTimeout(() => {
        const checkboxes = listElem.querySelectorAll('.software-option');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', handleSoftwareSelection);
        });
    }, 0);
    
    // Update project config
    updateProjectFilesConfig(folderName);
}

// Generate HTML for custom software
function getCustomSoftwareHTML(folderName) {
    const customSoftwareList = JSON.parse(localStorage.getItem(`custom-software-${folderName}`) || '[]');
    const selectedSoftware = JSON.parse(localStorage.getItem(`project-files-${folderName}`) || '[]');
    
    if (customSoftwareList.length === 0) {
        return '';
    }
    
    return customSoftwareList.map(software => `
        <div class="flex items-center justify-between bg-gray-800 p-2 rounded">
            <label class="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" class="software-option" 
                    data-folder="${folderName}" 
                    data-software="${software}"
                    ${selectedSoftware.includes(software) ? 'checked' : ''}>
                <span>${software}</span>
            </label>
            <button onclick="removeCustomSoftware('${folderName}', '${software}')" class="text-red-500 hover:text-red-300">×</button>
        </div>
    `).join('');
}

// Update project config for project files folder
function updateProjectFilesConfig(folderName) {
    const selectedSoftware = JSON.parse(localStorage.getItem(`project-files-${folderName}`) || '[]');
    
    // Remove any existing project files folder config
    projectConfig.linkedFolders = projectConfig.linkedFolders.filter(f => f.name !== folderName);
    
    // Add the new config with selected software
    if (selectedSoftware.length > 0) {
        projectConfig.linkedFolders.push({
            name: folderName,
            isProjectFiles: true,
            software: selectedSoftware,
            isEmpty: false
        });
    } else {
        // If no software selected, mark as empty
        projectConfig.linkedFolders.push({
            name: folderName,
            isProjectFiles: true,
            software: [],
            isEmpty: true
        });
    }
    
    console.log('Updated project config:', projectConfig);
}

// Update the updatePathsReview function
function updatePathsReview() {
    const review = document.getElementById('pathsReview');
    review.innerHTML = `
        <div class="mb-2">Project Name: ${projectConfig.projectName}</div>
        <div class="mb-2">Parent Directory: ${projectConfig.parentPath}</div>
        <div class="mb-2">Preset: ${projectConfig.selectedPreset?.name || 'None'}</div>
        <div>Linked Folders:</div>
        ${projectConfig.linkedFolders.map(folder => {
            if (folder.isProjectFiles) {
                return `
                    <div class="ml-4 mb-2">
                        • ${folder.name}: ${folder.isEmpty ? '(Empty)' : 'Creating subfolders for ' + folder.software.join(', ')}
                    </div>
                `;
            } else {
                return `
                    <div class="ml-4 mb-2">
                        • ${folder.name}: ${folder.path || ''} 
                        ${folder.locked ? '🔒' : ''} 
                        ${folder.isEmpty ? '(Empty)' : `(${folder.action})`}
                    </div>
                `;
            }
        }).join('')}
    `;
}

// Rest of the functions remain unchanged
// ...existing code...

// Add this helper function
function updateProjectConfig(folderName, path, isLocked) {
    // Remove any existing folder with same name
    projectConfig.linkedFolders = projectConfig.linkedFolders.filter(f => f.name !== folderName);
    
    // Add the new folder configuration
    projectConfig.linkedFolders.push({
        name: folderName,
        path: path,
        action: 'copy', // Default to copy
        locked: isLocked,
        isEmpty: false
    });

    logToConsole('Updated projectConfig:', projectConfig);
}

// Add the missing toggleLock function that was referenced but not implemented
function toggleLock(folderName) {
    // Skip locking Project Files folders since they work differently
    if (isProjectFilesFolder(folderName)) {
        return;
    }
    
    const folderDiv = document.querySelector(`[data-folder="${folderName}"]`);
    const status = getFolderStatus(folderName);
    
    // Toggle lock status
    status.isLocked = !status.isLocked;
    
    // If locking, save current path (if any)
    if (status.isLocked && !status.isEmpty) {
        const folder = projectConfig.linkedFolders.find(f => f.name === folderName);
        if (folder && folder.path) {
            status.savedPath = folder.path;
        }
    }
    
    // Update localStorage
    saveFolderConfig(folderName, status);
    
    // Update UI
    const lockIcon = folderDiv.querySelector('.lock-indicator');
    const linkButton = folderDiv.querySelector('button');
    const clearButton = folderDiv.querySelectorAll('button')[1];
    
    lockIcon.textContent = status.isLocked ? '🔒' : '🔓';
    linkButton.disabled = status.isLocked;
    clearButton.disabled = status.isLocked;
    
    if (status.isLocked) {
        // Update projectConfig with locked path
        updateProjectConfig(folderName, status.savedPath, true);
    }
}

// Make sure the logConfig function exists (it's referenced but might not be defined)
function logConfig() {
    console.log('Current Project Config:', JSON.stringify(projectConfig, null, 2));
}

// Fix the createFolderItem function to properly handle both regular and Project Files folders
function createFolderItem(folderName, status) {
    const div = document.createElement('div');
    div.className = 'folder-item';
    div.setAttribute('data-folder', folderName);
    
    // Check if this is a Project Files folder
    if (isProjectFilesFolder(folderName)) {
        // Get any saved software selections from localStorage
        const savedSoftware = JSON.parse(localStorage.getItem(`project-files-${folderName}`) || '[]');
        
        div.innerHTML = `
            <div class="flex justify-between items-center mb-3">
                <div class="flex items-center space-x-2">
                    <span class="font-bold text-lg">${folderName}</span>
                    <span class="bg-purple-600 text-xs px-2 py-1 rounded">Special</span>
                </div>
            </div>
            <div class="text-sm mb-3">
                Select software to create dedicated subfolders:
            </div>
            <div id="software-options-${folderName}" class="grid grid-cols-2 gap-2 mb-3">
                ${SOFTWARE_OPTIONS.map(software => `
                    <label class="flex items-center space-x-2 bg-gray-800 p-2 rounded hover:bg-gray-700 cursor-pointer">
                        <input type="checkbox" class="software-option" 
                            data-folder="${folderName}" 
                            data-software="${software}"
                            ${savedSoftware.includes(software) ? 'checked' : ''}>
                        <span>${software}</span>
                    </label>
                `).join('')}
            </div>
            <div class="flex items-center space-x-2 mt-2">
                <input type="text" id="custom-software-${folderName}" 
                    placeholder="Add custom software..." 
                    class="flex-1 p-2 bg-gray-800 rounded">
                <button onclick="addCustomSoftware('${folderName}')" class="btn">Add</button>
            </div>
            <div id="custom-software-list-${folderName}" class="mt-2 grid grid-cols-2 gap-2">
                ${getCustomSoftwareHTML(folderName)}
            </div>
        `;
        
        // After adding to DOM, add event listeners to checkboxes
        setTimeout(() => {
            const checkboxes = div.querySelectorAll('.software-option');
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', handleSoftwareSelection);
            });
            
            // Configure folder
            updateProjectFilesConfig(folderName);
        }, 0);
        
        return div;
    }
    
    // Regular folder (non-project files)
    const buttonClass = status.isEmpty ? 'bg-red-600 hover:bg-red-700' : 
                       status.savedPath ? 'bg-green-600 hover:bg-green-700' : '';
    
    div.innerHTML = `
        <div class="flex justify-between items-center mb-3">
            <div class="flex items-center space-x-2">
                <span class="font-bold text-lg">${folderName}</span>
                <span class="lock-indicator cursor-pointer" onclick="toggleLock('${folderName}')">
                    ${status.isLocked ? '🔒' : '🔓'}
                </span>
            </div>
        </div>
        <div class="flex flex-col space-y-3">
            <div class="path-display ${status.savedPath ? 'text-green-300' : 'text-blue-300'}">
                ${status.savedPath || 'No path selected'}
            </div>
            <div class="flex space-x-2">
                <button onclick="linkFolder('${folderName}')" 
                    class="btn flex-1 ${buttonClass}" ${status.isLocked ? 'disabled' : ''}>
                    ${getButtonText(status)}
                </button>
                <button onclick="clearFolder('${folderName}')" 
                    class="btn flex-1 ${status.isEmpty ? 'bg-red-600 hover:bg-red-700' : ''}"
                    ${status.isLocked ? 'disabled' : ''}>
                    ${status.isEmpty ? 'Marked Empty' : 'Leave Empty'}
                </button>
            </div>
        </div>
    `;
    
    return div;
}

// Add the missing helper functions that were used but not properly defined

// Fix the getButtonText function which determines button labels
function getButtonText(status) {
    if (status.isLocked) return 'Path Locked';
    if (status.savedPath) return 'Folder Linked';
    if (status.isEmpty) return 'Empty (Click to Link)';
    return 'Link Folder';
}

// Add the missing autoLinkFolder function
function autoLinkFolder(folderName, path) {
    // Remove any existing folder with same name
    projectConfig.linkedFolders = projectConfig.linkedFolders.filter(f => f.name !== folderName);
    
    // Add the new folder configuration
    projectConfig.linkedFolders.push({
        name: folderName,
        path: path,
        action: 'copy', // Default to copy
        locked: true,
        isEmpty: false
    });
    
    console.log(`Auto-linked folder: ${folderName} -> ${path}`);
}

// Fix updateFolderUI function to update the UI elements correctly
function updateFolderUI(folderDiv, folderName, status) {
    if (isProjectFilesFolder(folderName)) return; // Skip for project files folders
    
    const pathDisplay = folderDiv.querySelector('.path-display');
    const linkButton = folderDiv.querySelector('button');
    const clearButton = folderDiv.querySelectorAll('button')[1];
    const lockIcon = folderDiv.querySelector('.lock-indicator');
    
    // Update path display
    pathDisplay.textContent = status.savedPath || 'No path selected';
    pathDisplay.className = `path-display ${status.savedPath ? 'text-green-300' : 'text-blue-300'}`;
    
    // Update link button
    linkButton.textContent = getButtonText(status);
    linkButton.disabled = status.isLocked;
    
    // Apply appropriate classes
    if (status.savedPath) {
        linkButton.classList.add('bg-green-600', 'hover:bg-green-700');
        linkButton.classList.remove('bg-red-600', 'hover:bg-red-700');
    } else if (status.isEmpty) {
        linkButton.classList.add('bg-red-600', 'hover:bg-red-700');
        linkButton.classList.remove('bg-green-600', 'hover:bg-green-700');
    } else {
        linkButton.classList.remove('bg-green-600', 'hover:bg-green-700', 'bg-red-600', 'hover:bg-red-700');
    }
    
    // Update clear button
    clearButton.textContent = status.isEmpty ? 'Marked Empty' : 'Leave Empty';
    clearButton.disabled = status.isLocked;
    clearButton.className = `btn flex-1 ${status.isEmpty ? 'bg-red-600 hover:bg-red-700' : ''}`;
    
    // Update lock icon
    if (lockIcon) {
        lockIcon.textContent = status.isLocked ? '🔒' : '🔓';
    }
}

// Make sure updateProjectFilesConfig exists earlier in the file
// to avoid any reference errors
function updateProjectFilesConfig(folderName) {
    const selectedSoftware = JSON.parse(localStorage.getItem(`project-files-${folderName}`) || '[]');
    
    // Remove any existing project files folder config
    projectConfig.linkedFolders = projectConfig.linkedFolders.filter(f => f.name !== folderName);
    
    // Add the new config with selected software
    if (selectedSoftware.length > 0) {
        projectConfig.linkedFolders.push({
            name: folderName,
            isProjectFiles: true,
            software: selectedSoftware,
            isEmpty: false
        });
    } else {
        // If no software selected, mark as empty
        projectConfig.linkedFolders.push({
            name: folderName,
            isProjectFiles: true,
            software: [],
            isEmpty: true
        });
    }
}