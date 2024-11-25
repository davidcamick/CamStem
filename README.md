# CamStem - Stem Splitter

CamStem is an audio stem-splitting application that uses **Electron** for its user interface and **Demucs** for high-quality audio separation. This app is ideal for music producers, DJs, and anyone looking to isolate instruments or vocals from a song.

---

## **Features**
- Split audio into multiple stems using the power of Demucs.
- Supports MP3 and WAV outputs.
- Lightweight and easy to use, with a clean UI.
- Compatible with macOS, Windows, and Linux.

---

## **System Requirements**
- **Operating System**: macOS 10.12+, Windows 10+, Linux with AppImage support.
- **Python Version**: Python 3.9 or later installed.
- **Internet Connection**: Required for downloading Demucs models if not already installed.

---

## **File Structure**
Here's the project directory structure for developers:

CamStemSoftware/ ├── dist/ # Output directory for built executables ├── release/ # Output directory for release builds ├── src/ # Source files │ ├── electron-ui/ # Frontend UI for Electron │ │ ├── index.html # Main HTML file │ │ ├── main.js # Electron main process │ │ └── preload.js # Preload script for secure IPC │ ├── python-backend/ # Backend for Demucs processing │ │ ├── backend.py # Main backend logic │ │ └── dist/ # Output for PyInstaller-built backend │ └── assets/ # Static assets (e.g., icons, styles) ├── node_modules/ # Node.js dependencies ├── package.json # NPM configuration and build scripts ├── .gitignore # Git ignored files and directories ├── README.md # Project documentation └── LICENSE # Project license


---

## **Installation Instructions**

### 1. **Install Python**
CamStem requires Python to run the backend processing. Follow these steps:
1. Download Python 3.9 or later from the official [Python website](https://www.python.org/downloads/).
2. During installation, make sure to check the box **Add Python to PATH**.
3. Verify the installation by running:
   ```bash
   python3 --version

## **Installation Instructions**

### 1. **Install Python**
CamStem requires Python to run the backend processing. Follow these steps:
1. Download Python 3.9 or later from the official [Python website](https://www.python.org/downloads/).
2. During installation, make sure to check the box **Add Python to PATH**.
3. Verify the installation by running:
   ```bash
   python3 --version
   ```

---

### 2. **Install Demucs**
Demucs is the core audio separation tool used by CamStem. Install it via pip:
1. Open a terminal or command prompt.
2. Run the following command:
   ```bash
   pip install demucs
   ```
3. Verify the installation:
   ```bash
   demucs --help
   ```

   You should see a help menu for Demucs. If not, ensure Python and pip are properly installed.

---

### 3. **Configure PATH for Demucs**
Ensure `demucs` is accessible from any environment by adding it to your `PATH`:
1. Determine where `demucs` is installed:
   ```bash
   which demucs
   ```
   Example Output:
   ```
   /Users/yourname/.pyenv/shims/demucs
   ```

2. Add this directory to your `PATH`:
   - **macOS/Linux**: Edit `~/.zshrc` (or `~/.bashrc`) and add:
     ```bash
     export PATH=$PATH:/Users/yourname/.pyenv/shims
     ```
     Then reload the shell:
     ```bash
     source ~/.zshrc
     ```
   - **Windows**: Add the directory to your system’s PATH in Environment Variables.

---

### 4. **Run CamStem**
1. Download the appropriate version for your OS:
   - macOS: `CamStem-1.0.0-arm64.dmg`
   - Windows: `CamStem Setup 1.0.0.exe`
   - Linux: `CamStem-1.0.0-arm64.AppImage`
2. Install the app:
   - On macOS, drag the `.app` file to your Applications folder.
   - On Windows, run the installer.
   - On Linux, make the AppImage executable:
     ```bash
     chmod +x CamStem-1.0.0-arm64.AppImage
     ```
3. Launch the app and follow these steps:
   - **Select Input File**: Choose an MP3 or WAV file to process.
   - **Select Output Folder**: Specify where the separated stems should be saved.
   - **Choose Model**: Select a Demucs model (default: `htdemucs`).
   - Click **Split Stems** to start processing.

---

## **Troubleshooting**

### Demucs Not Found
If you see an error like:
```
The 'demucs' command was not found. Please ensure it is installed and in your PATH.
```
1. Ensure Demucs is installed:
   ```bash
   pip install demucs
   ```
2. Check that `demucs` is in your `PATH`:
   ```bash
   which demucs
   ```
3. If the issue persists, manually add the directory to your PATH (see step 3 above).

### Python Not Found
If Python isn’t installed, download it from the [Python website](https://www.python.org/downloads/) and ensure it’s added to your `PATH`.

### Slow Stem Separation
Separation time depends on the complexity of the audio and your system's performance. Using a GPU for processing can significantly speed up Demucs. For advanced users, configure Demucs to use CUDA if you have a compatible GPU.

---

## **Building the App (For Developers)**
If you want to modify or rebuild CamStem:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/CamStem.git
   cd CamStem
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the backend:
   ```bash
   cd src/python-backend
   pyinstaller --onefile backend.py
   cd ../../
   ```

4. Package the app:
   ```bash
   npm run build
   ```

   The distributable files will be located in the `dist/` directory.

---

## **Support**
If you encounter any issues or have questions, feel free to open an issue on the [GitHub repository](https://github.com/yourusername/CamStem).

---

## **Credits**
- [Demucs](https://github.com/facebookresearch/demucs) for audio separation.
- All contributors and testers who made CamStem possible.
```