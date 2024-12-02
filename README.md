

# CamStem Alpha v0.8.1

The **CamStem Stem Splitter** is a desktop application for splitting audio stems using **Demucs**, built with Electron. This guide provides instructions on how to set up, build, and run the application.

---

## Features
- User-friendly interface for audio stem splitting.
- Built-in support for various Demucs models.
- Adjustable MP3 quality settings.
- Available for macOS (and other platforms with modifications).

---

## Requirements
- **Node.js**: Version 16 or later (tested with Electron v25.1.0).
- **npm**: Included with Node.js.

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repository/CamStem.git
   cd CamStem
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

---

## Running the App in Development

To run the application in development mode:
```bash
npm start
```

This launches the Electron app with live reloading.

---

## Building the Application

To build the app for macOS:
```bash
npm run build:css && npm run build:mac
```

- This generates a `.dmg` file for macOS in the `release` folder.
- Make sure the `demucs-cxfreeze-mac` executable and models are correctly bundled.

---

## Running the Built App

If macOS shows an error like **"App is damaged and can’t be opened"**, this is due to macOS Gatekeeper. You can bypass this error by running the following command:
```bash
xattr -cr /path/to/CamStem.app
```

Replace `/path/to/CamStem.app` with the path to the `.app` file in the `release` folder.

After running this command, double-click the app to open it.

---

## Troubleshooting

### 1. Missing CSS or UI Issues
Ensure that the Tailwind CSS file is built before running or building the app:
```bash
npm run build:css
```

### 2. Logs
You can view application logs by clicking the **Open Log File** button in the app. This helps debug issues like missing files or Demucs errors.

### 3. Common Commands
- To build Tailwind CSS:
  ```bash
  npm run build:css
  ```
- To build the macOS app:
  ```bash
  npm run build:mac
  ```

---

## Release Notes
**Version 0.8.1**
- Initial release of the CamStem app.
- Features support for multiple Demucs models and adjustable MP3 quality.

---

## License
This project is licensed under the [MIT License](LICENSE).

---

## Author
**David Camick**  
Contact: [david@camick.org]  
```

