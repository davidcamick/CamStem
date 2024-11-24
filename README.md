Certainly! Let’s include the **file directory structure** in the `README.md` and provide a comprehensive view of the app. Here's the revised and detailed `README.md`:

---

### **README.md**

```markdown
# CamStem - Stem Splitter Software

CamStem is a powerful stem-splitting tool designed to separate vocals, drums, bass, and other instrumentals from audio files. It leverages the advanced **Demucs** AI model for high-quality music source separation.

---

## How It Works

1. **Input Selection**:  
   Users can select an input audio file (e.g., `.mp3`, `.wav`) via the app’s UI.  

2. **Output Directory**:  
   Users choose a directory where the separated stems will be saved.  

3. **Model Selection**:  
   Users select the desired Demucs model for stem separation:
   - **htdemucs**: Standard high-quality model.
   - **htdemucs_ft**: Fine-tuned variant for better separation.
   - **demucs_quantized**: Optimized for performance.
   - **demucs_unquantized**: Original uncompressed version.

4. **Stem Splitting**:  
   The app processes the input file and saves the separated stems (e.g., vocals, drums, bass) in the selected output directory.  

5. **Logs**:  
   A detailed log of the backend process is saved dynamically in the appropriate location for the system:
   - macOS: `~/Library/Application Support/CamStemSoftware/backend-log.txt`
   - Windows: `%APPDATA%\CamStemSoftware\backend-log.txt`
   - Linux: `~/.config/CamStemSoftware/backend-log.txt`

---

## File Directory Structure

Below is the directory structure for the project:

```
CamStemSoftware/
├── release/                     # Packaged app output directory
│   └── CamStem-darwin-arm64/    # Packaged macOS app
│       └── CamStem.app/         
│           └── Contents/Resources/
│               ├── app/         # Electron frontend resources
│               ├── backend/     # Python backend executable
│               ├── locales/     # Language files for Electron
│               └── ...
├── src/                         # Source code directory
│   ├── electron-ui/             # Electron app files
│   │   ├── index.html           # Frontend HTML file
│   │   ├── main.js              # Main Electron backend logic
│   │   └── preload.js           # Preload script for secure IPC
│   ├── python-backend/          # Python backend files
│   │   ├── backend.py           # Backend logic for Demucs
│   │   ├── backend.spec         # PyInstaller spec file
│   │   └── dist/                # Packaged Python backend executable
│   │       └── backend          # Built backend executable
│   └── assets/                  # Additional assets (icons, etc.)
├── package.json                 # Node.js project configuration
├── README.md                    # Project documentation (this file)
└── ...
```

---

## Beta Tester Instructions

### Prerequisites
1. **Operating System**: macOS, Windows, or Linux (macOS is tested; Windows/Linux support pending).  
2. **Dependencies**: None. The app is fully packaged and self-contained.

### Steps to Run the App
1. Download the `.dmg` (macOS), `.exe` (Windows), or `.AppImage` (Linux) file provided by the developer.
2. Install the application:
   - macOS: Drag the `.app` file into the Applications folder.
   - Windows: Run the installer.
   - Linux: Make the `.AppImage` file executable (`chmod +x`) and run it.
3. Launch the application.
4. Test the following functionality:
   - Select an input audio file.
   - Choose an output folder.
   - Select a model and perform stem splitting.
5. Verify the logs:
   - Ensure the log file is created in the expected location (see above for log paths).
   - Confirm the logs include the backend process details.

6. Provide feedback on:
   - Ease of use.
   - Any errors encountered.
   - Performance of the stem-splitting process.

---

## Making Changes and Packaging the App

### Steps to Make Changes
1. **Frontend (Electron UI)**:
   - Modify `src/electron-ui/index.html` for UI changes.
   - Modify `src/electron-ui/main.js` for backend communication logic.
   - Modify `src/electron-ui/preload.js` for secure IPC changes.

2. **Backend (Python)**:
   - Update `src/python-backend/backend.py` for any changes to the stem-splitting logic or dependencies.
   - Modify `src/python-backend/backend.spec` to include new dependencies or files.

---

### Steps to Package the App
1. **Build the Python Backend**:
   - Ensure you are in the `src/python-backend/` directory:
     ```bash
     cd src/python-backend
     ```
   - Package the backend using PyInstaller:
     ```bash
     pyinstaller --onefile backend.py
     ```

2. **Package the Electron App**:
   - Return to the project root directory:
     ```bash
     cd ../../
     ```
   - Package the app using Electron Packager:
     ```bash
     npx @electron/packager . CamStem --platform=darwin --arch=arm64 --out=release --overwrite --electronVersion=33.2.0 --extra-resource ./src/python-backend/dist/backend
     ```

3. **Verify the Packaged App**:
   - Test the app in the `release/` directory:
     ```bash
     open release/CamStem-darwin-arm64/CamStem.app
     ```

---

## Troubleshooting

### Issue: `FileNotFoundError: [Errno 2] No such file or directory: 'demucs'`
**Solution**: Ensure the `demucs` dependency is installed and accessible in the environment where the backend is running. If needed, provide the full path to the `demucs` binary in `backend.py`.

### Issue: Logs Not Being Written
**Solution**: Verify that the log file directory (`~/Library/Application Support/CamStemSoftware/`) exists and is writable. Check for errors in `main.js` related to file permissions.

---

## Feedback
Please provide feedback or report issues via email or in the designated feedback form provided by the development team.

---

Enjoy using CamStem!
```
