this is my project, please read the contents and understand its functionality. once done, let me know and await my requests.

`.` (Root)
==============
- `tailwind.config.js`
- `filelocations.txt`
- `README.md`
- `package.json`
- `.env`
- `postcss.config.js`

`.github`
==============

  `workflows`
  ==============
    - `buildmac.yml`

`src`
==============

  `extension`
  ==============
    - `CamStemExtension.zip`

    `CamStemExtension`
    ==============
      - `index.html`
      - `index.js`
      - `index.jsx`
      - `CSInterface.js`

      `CSXS`
      ==============
        - `manifest.xml`

  `frontend`
  ==============
    - `premiere.html`
    - `update.html`
    - `about.html`
    - `auth.html`
    - `tailwind-output.css`
    - `index.css`
    - `splitter.css`
    - `dashboard.html`
    - `splitter.html`
    - `settings.html`
    - `landing.html`

  `backend`
  ==============
    - `preload.js`
    - `main.js`

  `assets`
  ==============
    - `installerHeader.bmp`
    - `icon.icns`
    - `output-vp9.webm`
    - `installerSidebar.bmp`
    - `icon.ico`
    - `logo.png`


## Included Files with Code

### tailwind.config.js

``` 
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      "./src/frontend/**/*.html",
      "./src/frontend/**/*.js",
  ],
  theme: {
      extend: {},
  },
  plugins: [],
};
```

### package.json

``` 
{
  "name": "CamStem",
  "version": "1.0.0",
  "description": "CamStem",
  "main": "src/backend/main.js",
  "scripts": {
    "start": "electron .",
    "build:mac": "electron-builder --mac --publish=always",
    "build:win": "electron-builder --win --publish=always",
    "build:all": "electron-builder --mac --win --publish=always",
    "build": "npm run build:all",
    "build:css": "npx tailwindcss -i ./src/frontend/index.css -o ./src/frontend/tailwind-output.css"
  },
  "author": "David Camick",
  "license": "MIT",
  "devDependencies": {
    "@babel/core": "^7.26.0",
    "@babel/preset-env": "^7.26.0",
    "@babel/preset-react": "^7.25.9",
    "@babel/standalone": "^7.26.2",
    "babel-loader": "^9.2.1",
    "electron": "^25.1.0",
    "electron-builder": "^25.1.8",
    "webpack": "^5.96.1",
    "webpack-cli": "^5.1.4"
  },
  "build": {
    "appId": "camstem.org",
    "productName": "CamStem",
    "asar": false,
    "compression": "maximum",
    "publish": [
      {
        "provider": "github",
        "owner": "davidcamick",
        "repo": "CamStemReleases"
      }
    ],
    "extraResources": [
      {
        "from": "src/assets",
        "to": "app/src/assets",
        "filter": [
          "**/*",
          "!icon.icns"
        ]
      },
      {
        "from": "Models",
        "to": "Models",
        "filter": [
          "**/*"
        ]
      }
    ],
    "win": {
      "icon": "assets/icon.ico",
      "forceCodeSigning": false,
      "target": [
        {
          "target": "nsis",
          "arch": [
            "x64"
          ]
        }
      ],
      "compression": "maximum",
      "extraFiles": [
        {
          "from": "src/backend/demucs-cxfreeze-win-cuda",
          "to": "resources/demucs-cxfreeze-win-cuda",
          "filter": [
            "**/*"
          ]
        }
      ]
    },
    "nsis": {
      "oneClick": false,
      "perMachine": false,
      "runAfterFinish": false,
      "allowToChangeInstallationDirectory": true,
      "artifactName": "${productName}-Setup-${version}.${ext}",
      "differentialPackage": false
    },
    "mac": {
      "icon": "src/assets/icon.icns",
      "target": [
        "zip"
      ],
      "category": "public.app-category.utilities",
      "artifactName": "${productName}-${version}-mac.${ext}",
      "hardenedRuntime": true,
      "extraFiles": [
        {
          "from": "src/backend/demucs-cxfreeze-mac",
          "to": "resources/demucs-cxfreeze-mac",
          "filter": [
            "**/*"
          ]
        }
      ]
    },
    "files": [
      "dist/**/*",
      "src/backend/main.js",
      "src/backend/preload.js",
      "src/frontend/**/*",
      "src/assets/**"
    ],
    "directories": {
      "output": "release"
    },
    "afterPack": "src/backend/afterPack.js"
  },
  "dependencies": {
    "autoprefixer": "^10.4.20",
    "choco": "^0.2.1",
    "dotenv": "^16.4.7",
    "electron-is-dev": "^3.0.1",
    "electron-updater": "^6.3.9",
    "keytar": "^7.9.0",
    "postcss": "^8.4.49",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "stripe": "^17.4.0",
    "tailwindcss": "^3.4.15"
  }
}
```

### postcss.config.js

``` 
module.exports = {
    plugins: {
        tailwindcss: {},
        autoprefixer: {},
    },
};
```

### src/extension/CamStemExtension/index.html

``` 
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CamStem</title>
  <style>
    /* 
      1) Full-screen gradient background, remove scrollbars,
         and white text for contrast.
    */
    html, body {
      margin: 0;
      padding: 0;
      font-family: sans-serif;
      min-height: 100vh;
      background: linear-gradient(135deg, #003554, #051923) no-repeat center center fixed;
      background-size: cover;
      color: #ffffff;

      /* Allow scrolling but hide scrollbars (all browsers) */
      overflow: auto; 
      scrollbar-width: none;            /* Firefox */
      -ms-overflow-style: none;         /* IE/Edge */
    }
    /* Hide scrollbars in WebKit browsers */
    ::-webkit-scrollbar {
      width: 0px;
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: transparent;
    }

    /* 
      2) .container
         Now uses width: 90%, max-width: 700px so it can scale as the panel is resized.
    */
    .container {
      width: 90%;
      max-width: 700px;
      margin: 1rem auto;
      background-color: rgba(255, 255, 255, 0.07);
      border-radius: 12px;
      padding: 1rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      min-height: 650px; 
      box-sizing: border-box;
      display: grid;
      grid-template-rows: auto auto auto auto; /* Title row, main row, logs row, message row */
      grid-template-columns: 1fr 1fr;    
      gap: 8px;
    }

    /* Title row + settings button in row 1, columns 1..2 */
    .title-row {
      grid-row: 1;
      grid-column: 1 / span 2;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }
    .title {
      font-size: 1.3rem;
      font-weight: bold;
      margin: 0;
      padding: 0;
    }

    /* Left column (row2,col1): Model + Quality */
    .left-column {
      grid-row: 2;
      grid-column: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 6px;
      padding: 0.75rem;
    }

    /* Right column (row2,col2): 2 small buttons side by side */
    .right-column {
      grid-row: 2;
      grid-column: 2;
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 6px;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      padding: 0.75rem;
      gap: 0.5rem;
    }
    .buttons-row {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    /* Row 3 => #status => col 1..2 */
    .status-area {
      grid-row: 3;
      grid-column: 1 / span 2;
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 6px;
      background-color: rgba(255,255,255,0.1);
      padding: 0.5rem;
      max-height: 160px;
      overflow-y: auto;
      box-sizing: border-box;
    }
    #status {
      white-space: pre-wrap;
      font-weight: bold;
      font-size: 0.85rem;
    }

    /* Row 4 => #userMessage => col 1..2 */
    .message-area {
      grid-row: 4;
      grid-column: 1 / span 2;
      min-height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 0.5rem;
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 6px;
      background-color: rgba(255,255,255,0.15);
    }
    #userMessage {
      font-size: 0.95rem;
      font-weight: bold;
      color: #ffcc00; /* a bright color to stand out */
    }

    /* Basic button styling */
    button {
      padding: 10px 14px;
      cursor: pointer;
      border: none;
      border-radius: 6px;
      background-color: #006494;
      color: #ffffff;
      transition: background-color 0.3s, transform 0.3s;
      font-size: 1rem;
    }
    button:hover {
      background-color: #004a66;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    /* Basic input + select styling */
    input[type="text"] {
      width: 100%;
      padding: 6px;
      box-sizing: border-box;
      margin: 0.25rem 0 0.5rem 0;
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 6px;
      background-color: rgba(0,0,0,0.4);
      color: #ffffff;
      outline: none;
      font-size: 0.9rem;
    }

    select {
      width: 100%;
      padding: 6px;
      box-sizing: border-box;
      margin: 0.25rem 0 0.5rem 0;
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 6px;
      background-color: rgba(0,0,0,0.4); /* So text is visible */
      color: #ffffff;
      outline: none;
      font-size: 0.9rem;
      appearance: none; /* Hide default arrow if you want a custom arrow or none */
    }

    label {
      margin-top: 0.25rem;
      margin-bottom: 0.25rem;
      font-size: 0.9rem;
      font-weight: bold;
    }

    /* The modals all share .modal-overlay style, hidden by default */
    .modal-overlay {
      display: none; /* shown via JS */
      position: fixed;
      z-index: 999;
      left: 0;
      top: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0,0,0,0.6);
      align-items: center;
      justify-content: center;
    }

    /* The generic .modal-content style */
    .modal-content {
      background-color: #003554;
      margin: auto;
      padding: 1.5rem;
      border-radius: 8px;
      width: 400px;
      color: #fff;
      text-align: left;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    }
    .confirm-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    /* The close button style reused for "Cancel" or "Close" */
    .close-btn,
    .cancel-btn {
      background-color: #8B0000;
      color: #fff;
      border: none;
      border-radius: 4px;
      padding: 0.5rem 1rem;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.3s ease, transform 0.3s ease;
    }
    .close-btn:hover,
    .cancel-btn:hover {
      background-color: #690000;
      transform: translateY(-3px);
    }
    .proceed-btn {
      background-color: #006494;
      color: #fff;
      border-radius: 4px;
      padding: 0.5rem 1rem;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.3s ease, transform 0.3s ease;
    }
    .proceed-btn:hover {
      background-color: #004a66;
      transform: translateY(-3px);
    }

    /* A grey-out overlay (for when user is not authenticated) */
    #greyOutOverlay {
      display: none; /* toggled on/off via JS */
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(128,128,128,0.7);
      z-index: 1000; /* above everything else */
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1.2rem;
      color: #ffffff;
      text-align: center;
      padding: 1rem;
      box-sizing: border-box;
      flex-direction: column;
    }
  </style>
</head>
<body>

  <!-- Grey-out overlay for unauthenticated users -->
  <div id="greyOutOverlay">
    <p style="font-weight: bold;">
      You must enter and validate an Auth Key in Settings to use this extension.
    </p>
    <!-- New button that opens settings modal -->
    <button id="goToSettingsBtn" style="margin-top: 1rem; background-color: #8B0000;">
      Open Settings
    </button>
  </div>

  <!-- ============== Settings Modal ============== -->
  <div id="settingsModal" class="modal-overlay">
    <div class="modal-content">
      <h2 style="margin-top:0;">Settings</h2>
      <label for="demucsPath">Path to Process:</label>
      <input
        type="text"
        id="demucsPath"
        placeholder="e.g. C:\\Program Files\\CamStem\\demucs-cxfreeze.exe"
      />
      <label for="modelDir">Assets Path:</label>
      <input
        type="text"
        id="modelDir"
        placeholder="e.g. F:\\Project-CamStem\\Models"
      />

      <!-- Auth Key -->
      <label for="authKeyInput">Auth Key:</label>
      <input
        type="text"
        id="authKeyInput"
        placeholder="Enter your Auth Key"
      />

      <!-- Buttons: keep 'Save Settings' plus new ones -->
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 1rem;">
        <button id="savePathBtn">Save Settings</button>
        <button id="validateKeyBtn">Validate Key</button>
        <button id="removeKeyBtn">Remove Key</button>
        <button id="closeSettings" class="close-btn" style="margin-left:auto;">Close</button>
      </div>
    </div>
  </div>

  <!-- ============== Split Audio Confirm Modal ============== -->
  <div id="splitConfirmModal" class="modal-overlay">
    <div class="modal-content">
      <h3>Split Audio Confirmation</h3>
      <p>
        If you ever get a Premiere Pro error when splitting stems, just click "OK" in that error box, 
        delete the newly created folder in Premiere, and then click "Split Audio" again. 
        It’s a known Premiere Pro bug that occasionally happens.
      </p>
      <div class="confirm-buttons">
        <button id="splitCancelBtn" class="cancel-btn">Cancel</button>
        <button id="splitProceedBtn" class="proceed-btn">Proceed</button>
      </div>
    </div>
  </div>

  <!-- ============== Place Stems Confirm Modal ============== -->
  <div id="placeStemsModal" class="modal-overlay">
    <div class="modal-content">
      <h3>Place Stems Confirmation</h3>
      <p id="placeStemsWarning">
        <!-- We'll fill it dynamically with 4 or 6 track info in index.js -->
      </p>
      <div class="confirm-buttons">
        <button id="placeCancelBtn" class="cancel-btn">Cancel</button>
        <button id="placeProceedBtn" class="proceed-btn">Proceed</button>
      </div>
    </div>
  </div>

  <!-- ============== Main Container ============== -->
  <div class="container">

    <!-- Row 1: Title + Settings button -->
    <div class="title-row">
      <h1 class="title">CamStem</h1>
      <button id="openSettingsBtn" style="margin-left: auto;">Settings</button>
    </div>

    <!-- Row 2, col1 => left-column (Model + Quality) -->
    <div class="left-column">
      <label for="modelSelect">Select Model:</label>
      <select id="modelSelect">
        <option value="htdemucs">Default 4stem</option>
        <option value="htdemucs_ft">High Quality 4stem</option>
        <option value="htdemucs_6s">Experimental 6stem</option>
      </select>

      <label for="qualitySelect">Quality Preset (lower is better)</label>
      <select id="qualitySelect">
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4" selected>4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
      </select>
    </div>

    <!-- Row 2, col2 => right-column (2 small buttons) -->
    <div class="right-column">
      <div class="buttons-row">
        <button id="splitAudioBtn">Split Audio</button>
        <button id="placeStemsBtn">Place Stems</button>
      </div>
    </div>

    <!-- Row 3 => Logs area -->
    <div class="status-area">
      <div id="status"></div>
    </div>

    <!-- Row 4 => Message area -->
    <div class="message-area">
      <div id="userMessage"></div>
    </div>

  </div> <!-- .container -->

  <!-- Adobe CEP + Your Scripts -->
  <script src="CSInterface.js"></script>
  <script src="index.js"></script>
</body>
</html>
```

### src/extension/CamStemExtension/index.js

``` 
(function() {
  var csInterface = new CSInterface();

  // We'll store some info for the extension usage:
  let lastAudioName   = null;   // for "Splitting Stems..." log
  let lastChosenModel = null;   // for 4 vs. 6-stem usage
  let hasSplitYet     = false;  // whether we've successfully run a split

  /******************************************************************************
   * PART A: HARDCODED ITEMS + DECRYPTION + PLATFORM CHECK
   * (As described in your main.js, but now all local to the extension.)
   ******************************************************************************/
  const HARD_CODED_KEY = "DA3K9Y5kdGQ217dhKehCT4Jip0ehJ7rY";  // from your main.js
  const STRIPE_SECRET_KEY = "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";

  // We'll allow a 14-day validity window for the key's date
  function isKeyValid(dateStr) {
    const keyDate = new Date(dateStr);
    const currentDate = new Date();
    const diffInDays = (currentDate - keyDate) / (1000 * 60 * 60 * 24);
    return diffInDays <= 14;
  }

  // Reverse string, used for clerk + stripe ID
  function reverseString(str) {
    return str.split('').reverse().join('');
  }

  // Decrypt + parse the key:
  // => date|platformCode|revClerkID|revStripeID
  // => date check, platform check
  async function processSoftwareKey(encryptedHex) {
    const cipherBytes = new Uint8Array(
      encryptedHex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
    );

    const enc = new TextEncoder();
    const dec = new TextDecoder();

    // Import the "HARD_CODED_KEY" as AES-CTR key
    const keyData = enc.encode(HARD_CODED_KEY);
    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-CTR', length: 256 },
      false,
      ['decrypt']
    );

    // IV of all zeroes
    const iv = new Uint8Array(16);

    // Decrypt
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-CTR', counter: iv, length: 64 },
      cryptoKey,
      cipherBytes
    );
    const decrypted = dec.decode(decryptedBuffer);

    // Split => 4 parts
    const parts = decrypted.split('|');
    if (parts.length !== 4) {
      throw new Error('Invalid key format. Expected 4 parts.');
    }
    const [ dateStr, platformCodeStr, revClerkID, revStripeID ] = parts;

    // 1) Date check
    if (!isKeyValid(dateStr)) {
      throw new Error('Software key is expired (older than 14 days).');
    }

    // 2) Platform check => Mac => 1, Windows => 2
    let currentPlatformCode = 2;
    const agent = navigator.userAgent.toLowerCase();
    if (agent.includes("mac os") || agent.includes("macintosh")) {
      currentPlatformCode = 1;
    }
    const neededPlatform = parseInt(platformCodeStr, 10);
    if (neededPlatform !== currentPlatformCode) {
      throw new Error('Software key does not match the current platform.');
    }

    // 3) Reverse clerk + stripe IDs
    const clerkID = reverseString(revClerkID);
    const stripeID = reverseString(revStripeID);

    return { clerkID, stripeID };
  }

  /******************************************************************************
   * PART B: STORING + REMOVING KEY + CLERK/STRIPE ID
   * We'll store them all in localStorage so the user doesn't re-enter each time.
   ******************************************************************************/
  async function saveSoftwareKey(encryptedHex) {
    localStorage.setItem("camstem_softwareKey", encryptedHex);
  }
  async function getSavedKey() {
    return localStorage.getItem("camstem_softwareKey") || null;
  }
  async function removeSavedKey() {
    localStorage.removeItem("camstem_softwareKey");
  }

  /******************************************************************************
   * PART C: STRIPE + CLERK CHECK
   * We'll do a real fetch call to Stripe using your live secret key.
   * Then we can store clerkID in localStorage if needed.
   ******************************************************************************/
  async function checkSubscriptionStatus(stripeID) {
    try {
      // Example: call Stripe's subscription list endpoint
      const url = "https://api.stripe.com/v1/subscriptions?customer=" + encodeURIComponent(stripeID);
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + STRIPE_SECRET_KEY
        }
      });
      const data = await res.json();
      if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
        return { active: false, reason: "No subscriptions found for that Stripe ID." };
      }
      // Check if there's an active or trialing sub
      const activeFound = data.data.some(
        (sub) => sub.status === 'active' || sub.status === 'trialing'
      );
      if (activeFound) {
        return { active: true };
      } else {
        return { active: false, reason: "Subscription is canceled or not active." };
      }
    } catch (err) {
      return { active: false, reason: err.message };
    }
  }

  /******************************************************************************
   * PART D: ON LOAD => set up DOM, overlay logic, etc.
   ******************************************************************************/
  window.addEventListener("load", function() {
    // DOM references
    const openSettingsBtn    = document.getElementById("openSettingsBtn");
    const settingsModal      = document.getElementById("settingsModal");
    const closeSettings      = document.getElementById("closeSettings");

    const demucsPathInput    = document.getElementById("demucsPath");
    const modelDirInput      = document.getElementById("modelDir");
    const modelSelect        = document.getElementById("modelSelect");
    const qualitySelect      = document.getElementById("qualitySelect");

    const saveBtn            = document.getElementById("savePathBtn");
    const splitAudioBtn      = document.getElementById("splitAudioBtn");
    const placeStemsBtn      = document.getElementById("placeStemsBtn");
    const statusEl           = document.getElementById("status");
    const userMessageEl      = document.getElementById("userMessage");

    // Auth
    const authKeyInput       = document.getElementById("authKeyInput");
    const validateKeyBtn     = document.getElementById("validateKeyBtn");
    const removeKeyBtn       = document.getElementById("removeKeyBtn");

    // Confirm modals
    const splitConfirmModal  = document.getElementById("splitConfirmModal");
    const splitCancelBtn     = document.getElementById("splitCancelBtn");
    const splitProceedBtn    = document.getElementById("splitProceedBtn");

    const placeStemsModal    = document.getElementById("placeStemsModal");
    const placeCancelBtn     = document.getElementById("placeCancelBtn");
    const placeProceedBtn    = document.getElementById("placeProceedBtn");
    const placeStemsWarning  = document.getElementById("placeStemsWarning");

    // Overlay
    const greyOutOverlay     = document.getElementById("greyOutOverlay");
    const goToSettingsBtn    = document.getElementById("goToSettingsBtn");

    // Helper
    function setUserMessage(msg) {
      userMessageEl.textContent = msg || "";
    }
    function showOverlayAndMessage(msg) {
      greyOutOverlay.style.display = "flex";
      greyOutOverlay.querySelector("p").textContent = msg || "";
    }
    function hideOverlay() {
      greyOutOverlay.style.display = "none";
    }

    /******************************************************************************
     * 1) Re-check auth on load
     ******************************************************************************/
    async function recheckAuthAndOverlay() {
      const existingKey = await getSavedKey();
      if (!existingKey) {
        showOverlayAndMessage("You must enter and validate an Auth Key in Settings to use this extension.");
        return;
      }
      try {
        // Decrypt / parse
        const { clerkID, stripeID } = await processSoftwareKey(existingKey);
        // Check subscription with real Stripe
        const subRes = await checkSubscriptionStatus(stripeID);
        if (!subRes.active) {
          showOverlayAndMessage("Subscription error: " + subRes.reason);
        } else {
          hideOverlay();
        }
      } catch (err) {
        showOverlayAndMessage("Auth error: " + err.message);
      }
    }
    recheckAuthAndOverlay();

    // 2) Opening + closing settings
    function openSettingsPanel() {
      hideOverlay();
      settingsModal.style.display = "flex";
      // load existing key
      getSavedKey().then((k) => {
        if (k) authKeyInput.value = k;
      });
    }
    goToSettingsBtn.addEventListener("click", openSettingsPanel);
    openSettingsBtn.addEventListener("click", openSettingsPanel);

    closeSettings.addEventListener("click", async function() {
      settingsModal.style.display = "none";
      await recheckAuthAndOverlay();
    });

    // if user clicks outside modals
    window.addEventListener("click", function(e) {
      if (e.target === settingsModal) {
        settingsModal.style.display = "none";
        recheckAuthAndOverlay();
      }
      if (e.target === splitConfirmModal) {
        splitConfirmModal.style.display = "none";
      }
      if (e.target === placeStemsModal) {
        placeStemsModal.style.display = "none";
      }
    });

    /******************************************************************************
     * 3) Save demucs + model paths to localStorage
     ******************************************************************************/
    const existingDemucs = localStorage.getItem("camstem_demucsPath");
    const existingModel  = localStorage.getItem("camstem_modelDir");
    if (existingDemucs) demucsPathInput.value = existingDemucs;
    if (existingModel)  modelDirInput.value   = existingModel;

    saveBtn.addEventListener("click", function() {
      const dp = demucsPathInput.value.trim();
      const md = modelDirInput.value.trim();
      if (!dp || !md) {
        statusEl.textContent += "[JS] Please fill in both paths.\n";
        setUserMessage("Please fill in both paths before saving.");
        return;
      }
      localStorage.setItem("camstem_demucsPath", dp);
      localStorage.setItem("camstem_modelDir", md);
      statusEl.textContent += "[JS] Saved settings:\n" + dp + "\n" + md + "\n";
      setUserMessage("Settings saved.");
    });

    /******************************************************************************
     * 4) Validate Key + Remove Key => real clerk + stripe check
     ******************************************************************************/
    validateKeyBtn.addEventListener("click", async function() {
      const softwareKey = authKeyInput.value.trim();
      if (!softwareKey) {
        setUserMessage("Please enter a software key.");
        return;
      }
      setUserMessage("");
      validateKeyBtn.disabled = true;
      try {
        // Decrypt
        const { clerkID, stripeID } = await processSoftwareKey(softwareKey);

        // Save the key
        await saveSoftwareKey(softwareKey);

        // Now check subscription with Stripe
        const subRes = await checkSubscriptionStatus(stripeID);
        if (!subRes.active) {
          setUserMessage("Subscription error: " + subRes.reason);
          validateKeyBtn.disabled = false;
          return;
        }

        // success
        setUserMessage("Software key validated and subscription is active!");
        hideOverlay();
      } catch (err) {
        setUserMessage("Key validation failed: " + err.message);
      } finally {
        validateKeyBtn.disabled = false;
      }
    });

    removeKeyBtn.addEventListener("click", async function() {
      await removeSavedKey();
      authKeyInput.value = "";
      setUserMessage("All saved keys have been removed.");
      showOverlayAndMessage("Please enter and validate an Auth Key in Settings.");
    });

    /******************************************************************************
     * 5) "Split Audio" => confirm modal
     ******************************************************************************/
    splitAudioBtn.addEventListener("click", function() {
      if (greyOutOverlay.style.display === "flex") {
        setUserMessage("Please validate an Auth Key first.");
        return;
      }
      splitConfirmModal.style.display = "flex";
    });
    splitCancelBtn.addEventListener("click", function() {
      splitConfirmModal.style.display = "none";
      setUserMessage("Split audio canceled.");
    });
    splitProceedBtn.addEventListener("click", function() {
      splitConfirmModal.style.display = "none";
      startSplitProcess();
    });

    function startSplitProcess() {
      setUserMessage("Split Process Started. Checking selected audio track...");

      const demucsExe = demucsPathInput.value.trim();
      const modelDir  = modelDirInput.value.trim();
      if (!demucsExe || !modelDir) {
        statusEl.textContent += "[JS] Must provide demucs path + model folder.\n";
        setUserMessage("Cannot split; please fill in paths first.");
        return;
      }

      statusEl.textContent += "[JS] Checking audio selection...\n";
      csInterface.evalScript("checkAudioSelection()", function(resultStr) {
        statusEl.textContent += "[JS] => checkAudioSelection returned:\n" + resultStr + "\n";

        const lines = resultStr.split("\n");
        let inputAudio = null;
        for (const line of lines) {
          if (line.includes("Selected Audio Path:")) {
            inputAudio = line.replace("Selected Audio Path:", "").trim();
          }
        }
        if (!inputAudio) {
          statusEl.textContent += "[JS] => No valid selected audio found. Aborting.\n";
          setUserMessage("No valid audio clip selected. Please select a clip in the timeline first.");
          return;
        }

        lastAudioName   = inputAudio;
        lastChosenModel = modelSelect.value;

        setTimeout(() => {
          statusEl.textContent += "[JS] Splitting Stems of " + lastAudioName + "\n";
          setUserMessage("Splitting Stems of " + lastAudioName + "...");
        }, 3000);

        runDemucsProcess(demucsExe, modelDir, lastChosenModel, qualitySelect.value, lastAudioName);
      });
    }

    /******************************************************************************
     * 6) "Place Stems" => confirm modal
     ******************************************************************************/
    placeStemsBtn.addEventListener("click", function() {
      if (greyOutOverlay.style.display === "flex") {
        setUserMessage("Please validate an Auth Key first.");
        return;
      }
      if (!hasSplitYet) {
        setUserMessage("No stems to place yet! Please split audio first.");
        return;
      }
      if (lastChosenModel === "htdemucs_6s") {
        placeStemsWarning.textContent = "Please ensure the first 6 audio tracks are empty...";
      } else {
        placeStemsWarning.textContent = "Please ensure the first 4 audio tracks are empty...";
      }
      placeStemsModal.style.display = "flex";
    });
    placeCancelBtn.addEventListener("click", function() {
      placeStemsModal.style.display = "none";
      setUserMessage("Place stems canceled.");
    });
    placeProceedBtn.addEventListener("click", function() {
      placeStemsModal.style.display = "none";
      doPlaceStemsNow();
    });

    function doPlaceStemsNow() {
      statusEl.textContent += "\n[JS] => Placing stems on timeline...\n";
      setUserMessage("Placing stems on timeline...");

      csInterface.evalScript("placeStemsManually()", function(resp) {
        statusEl.textContent += "[JS] => placeStemsManually returned:\n" + resp + "\n";
        setUserMessage("Stems placed on timeline (check your sequence).");
      });
    }

    /******************************************************************************
     * 7) runDemucsProcess => spawn demucs-cxfreeze
     ******************************************************************************/
    function runDemucsProcess(demucsExe, modelFolder, modelName, mp3Preset, inputPath) {
      statusEl.textContent += "[JS] runDemucsProcess called...\n";

      let childProc;
      try {
        childProc = require("child_process");
      } catch (e) {
        statusEl.textContent += "[JS] Node not available => " + e + "\n";
        setUserMessage("Error: Node not available in this environment.");
        return;
      }

      function getDir(fp) {
        const idx = Math.max(fp.lastIndexOf("\\"), fp.lastIndexOf("/"));
        return idx < 0 ? fp : fp.substring(0, idx);
      }
      function getBaseName(filePath) {
        const slash = Math.max(filePath.lastIndexOf("\\"), filePath.lastIndexOf("/"));
        const justFile = (slash < 0) ? filePath : filePath.substring(slash + 1);
        const dot = justFile.lastIndexOf(".");
        return dot < 0 ? justFile : justFile.substring(0, dot);
      }

      const outputDir = getDir(inputPath);
      const args = [
        "-n", modelName,
        "--repo", modelFolder,
        "-o", outputDir,
        "--mp3",
        "--mp3-preset", mp3Preset,
        inputPath
      ];

      statusEl.textContent += "[JS] DEMUCS CMD:\n" + demucsExe + " " + args.join(" ") + "\n";

      let logBuffer       = "";
      let finalBaseFolder = null;
      let trackBaseName   = null;

      const proc = childProc.spawn(demucsExe, args, { cwd: outputDir });

      proc.stdout.on("data", (chunk) => {
        const txt = chunk.toString();
        statusEl.textContent += txt;

        logBuffer += txt;
        const lines = logBuffer.split(/\r?\n/);
        logBuffer = lines.pop();
        lines.forEach((ln) => parseDemucsLine(ln));
      });

      proc.stderr.on("data", (chunk) => {
        statusEl.textContent += "\n[ERR] " + chunk.toString();
      });

      proc.on("close", (code) => {
        if (logBuffer.trim()) {
          parseDemucsLine(logBuffer);
          logBuffer = "";
        }
        statusEl.textContent += `\n[JS] Demucs exited with code ${code}\n`;

        if (code === 0 && finalBaseFolder && trackBaseName) {
          const subFolder = finalBaseFolder.replace(/\\/g, "/") + "/" + trackBaseName;
          statusEl.textContent += `[JS] => subFolder = ${subFolder}\n`;

          const escaped = subFolder
            .replace(/\\/g, "\\\\")
            .replace(/"/g, '\\"')
            .replace(/'/g, "\\'")
            .replace(/\r/g, "")
            .replace(/\n/g, "");

          const jsxCall = `importStemsFolder("${escaped}", "${modelName}")`;
          statusEl.textContent += "[JS] => evalScript => " + jsxCall + "\n";

          csInterface.evalScript(jsxCall, function(resp) {
            statusEl.textContent += "\n[JS] importStemsFolder response:\n" + resp + "\n";
            statusEl.textContent += "[JS] Split Process Complete\n";
            setUserMessage("Split Process Complete! Stems imported into Premiere.");
            hasSplitYet = true;
          });
        } else if (code === 0) {
          statusEl.textContent += "[JS] Demucs finished but no final folder/base name found.\n";
          setUserMessage("Demucs finished, but no final stems folder found. Check logs.");
        } else {
          setUserMessage("Demucs process ended with an error. Check logs for details.");
        }
      });

      proc.on("error", (err) => {
        statusEl.textContent += "\n[JS] spawn error => " + err.toString() + "\n";
        setUserMessage("Error spawning Demucs process. Check logs.");
      });

      function parseDemucsLine(line) {
        const stIdx = line.indexOf("Separated tracks will be stored in");
        if (stIdx >= 0) {
          let partial = line.substring(stIdx);
          const splitted = partial.split("in");
          if (splitted[1]) {
            let folder = splitted[1].trim();
            const dotPos = folder.indexOf(".");
            if (dotPos >= 0) {
              folder = folder.substring(0, dotPos);
            }
            finalBaseFolder = folder.trim();
            statusEl.textContent += `\n[JS] => finalBaseFolder: ${finalBaseFolder}\n`;
          }
        }

        const sepIdx = line.indexOf("Separating track ");
        if (sepIdx >= 0) {
          const partial2 = line.substring(sepIdx + "Separating track ".length).trim();
          trackBaseName = getBaseName(partial2);
          statusEl.textContent += `\n[JS] => trackBaseName: ${trackBaseName}\n`;
        }
      }
    }
  });
})();
```

### src/extension/CamStemExtension/index.jsx

``` 
/**
 * index.jsx
 *
 * 1) checkAudioSelection() - find selected clip in timeline
 * 2) importStemsFolder(folderPath, modelName) - import only (no timeline)
 *    - Removes duplicates so "drums.mp3" won't appear multiple times
 * 3) placeStemsManually() - user calls this manually after import
 *    - Finds the bin "CamStem - ???"
 *    - Looks for "drums.mp3", "bass.mp3", etc.
 *    - Places them on the timeline, removes original clip
 */

//--------------------------------------
// A) Utility: arrayContains
//--------------------------------------
function arrayContains(arr, val) {
    if (!arr || !val) return false;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === val) {
            return true;
        }
    }
    return false;
}

//--------------------------------------
// B) Utility: getBaseName(filePath)
//--------------------------------------
function getBaseName(filePath) {
    if (!filePath) return "";
    var slashPos = Math.max(filePath.lastIndexOf("\\"), filePath.lastIndexOf("/"));
    var justFile = (slashPos < 0) ? filePath : filePath.substring(slashPos + 1);
    var dotPos   = justFile.lastIndexOf(".");
    if (dotPos < 0) return justFile;
    return justFile.substring(0, dotPos);
}

//--------------------------------------
// C) checkAudioSelection()
//--------------------------------------
function checkAudioSelection() {
    var log = [];
    log.push("=== checkAudioSelection() ===");

    if (!app.project) {
        return "No app.project? Maybe no project open?";
    }
    var seq = app.project.activeSequence;
    if (!seq) {
        return "No active sequence found.";
    }

    log.push("Found an active sequence.");
    log.push("Checking " + seq.audioTracks.numTracks + " audio tracks for a selected clip...");

    var foundClip = null;
    for (var t = 0; t < seq.audioTracks.numTracks; t++) {
        var track = seq.audioTracks[t];
        log.push("  Track #" + t + " => " + track.clips.numItems + " clip(s)");
        for (var c = 0; c < track.clips.numItems; c++) {
            var clip = track.clips[c];
            if (clip.isSelected()) {
                foundClip = clip;
                log.push("    Found SELECTED clip at track " + t + ", clip " + c);
                break;
            }
        }
        if (foundClip) break;
    }

    if (!foundClip) {
        log.push("No audio clip is selected in the timeline. Exiting.");
        return log.join("\n");
    }
    if (!foundClip.projectItem) {
        log.push("Selected clip has no projectItem? Exiting.");
        return log.join("\n");
    }
    if (!foundClip.projectItem.canChangeMediaPath()) {
        log.push("Cannot retrieve file path (canChangeMediaPath=false). Exiting.");
        return log.join("\n");
    }

    var filePath = foundClip.projectItem.getMediaPath();
    if (!filePath) {
        log.push("No file path found for the selected clip. Exiting.");
        return log.join("\n");
    }

    log.push("Selected Audio Path: " + filePath);
    return log.join("\n");
}

//--------------------------------------
// D) importStemsFolder(folderPath, modelName)
//--------------------------------------
function importStemsFolder(folderPath, modelName) {
    var logs = [];
    logs.push("=== importStemsFolder() ===");
    logs.push("folderPath = " + folderPath);
    logs.push("modelName = " + modelName);

    try {
        if (!folderPath) {
            logs.push("Error: folderPath is empty/null.");
            return logs.join("\n");
        }

        logs.push("Recursively gathering .mp3/.wav from => " + folderPath);

        // 1) gather .mp3/.wav
        var allAudioFiles = [];

        function gatherFilesRecursively(fld) {
            if (!fld.exists) return;
            var items = fld.getFiles();
            if (!items) return;
            for (var i = 0; i < items.length; i++) {
                var it = items[i];
                if (it instanceof File) {
                    var nm = it.name.toLowerCase();
                    if (nm.length >= 4) {
                        var ext = nm.substring(nm.length - 4);
                        if (ext === ".mp3" || ext === ".wav") {
                            logs.push("[Audio] " + it.fsName);
                            allAudioFiles.push(it.fsName);
                            continue;
                        }
                    }
                    logs.push("[Skip] " + it.fsName);
                } else if (it instanceof Folder) {
                    gatherFilesRecursively(it);
                }
            }
        }

        var rootFolder = new Folder(folderPath);
        if (!rootFolder.exists) {
            logs.push("Folder doesn't exist => " + rootFolder.fsName);
            return logs.join("\n");
        }
        gatherFilesRecursively(rootFolder);

        if (allAudioFiles.length === 0) {
            logs.push("No audio files found => done.");
            return logs.join("\n");
        }

        logs.push("Found " + allAudioFiles.length + " file(s). Importing at project root...");

        // 2) create new bin
        var newBinName = "CamStem - " + rootFolder.name;
        logs.push("Creating bin => " + newBinName);
        var newBin = app.project.rootItem.createBin(newBinName);
        if (!newBin) {
            logs.push("Couldn't create bin => older PPro?");
            return logs.join("\n");
        }
        logs.push("Created bin => " + newBin.name);

        // 3) import them
        var importRes = app.project.importFiles(allAudioFiles);
        logs.push("importFiles => type: " + (typeof importRes));

        // 4) move them into new bin
        var newlyImported = [];

        function moveMatches(folderItem) {
            for (var c = 0; c < folderItem.children.numItems; c++) {
                var child = folderItem.children[c];
                if (child && typeof child.getMediaPath === "function") {
                    var mp = child.getMediaPath();
                    // see if mp is in allAudioFiles
                    for (var i = 0; i < allAudioFiles.length; i++) {
                        if (allAudioFiles[i] === mp) {
                            // move child into bin if not already
                            if (child.parent !== newBin && typeof child.moveBin === "function") {
                                logs.push("Moving => " + child.name + " => " + newBin.name);
                                child.moveBin(newBin);
                            }
                            newlyImported.push(child);

                            // remove from array so we don't match it again => fix duplicates
                            allAudioFiles.splice(i, 1);
                            break; // done with this child
                        }
                    }
                }
                if (child && child.children && child.children.numItems > 0) {
                    moveMatches(child);
                }
            }
        }

        logs.push("Scanning entire project for newly imported stems...");
        moveMatches(app.project.rootItem);

        logs.push("Found " + newlyImported.length + " newly imported item(s).");
        logs.push("Import completed. No timeline action taken yet.");

    } catch (ex) {
        logs.push("Exception => " + ex.toString());
    }

    return logs.join("\n");
}

//--------------------------------------
// E) placeStemsManually()
//--------------------------------------
function placeStemsManually() {
    var logs = [];
    logs.push("=== placeStemsManually() ===");

    var seq = app.project.activeSequence;
    if (!seq) {
        logs.push("No active sequence => cannot place stems.");
        return logs.join("\n");
    }

    // 1) find the original selected clip
    var foundClip = null;
    for (var t = 0; t < seq.audioTracks.numTracks; t++) {
        var trackObj = seq.audioTracks[t];
        for (var c = 0; c < trackObj.clips.numItems; c++) {
            var clip = trackObj.clips[c];
            if (clip.isSelected()) {
                foundClip = clip;
                break;
            }
        }
        if (foundClip) break;
    }
    if (!foundClip) {
        logs.push("No selected clip => won't remove anything, continuing...");
    }

    // 2) Find the last "CamStem - ..." bin
    var lastCamStemBin = null;
    for (var i = app.project.rootItem.children.numItems - 1; i >= 0; i--) {
        var item = app.project.rootItem.children[i];
        if (item && item.type === 2 && item.name.indexOf("CamStem - ") === 0) {
            lastCamStemBin = item;
            break;
        }
    }
    if (!lastCamStemBin) {
        logs.push("Did not find a 'CamStem - xxx' bin. Exiting.");
        return logs.join("\n");
    }

    logs.push("Using bin => " + lastCamStemBin.name);

    // 3) gather items from that bin
    var allProjectItems = [];
    function gatherAllItems(bin) {
        for (var c = 0; c < bin.children.numItems; c++) {
            var child = bin.children[c];
            allProjectItems.push(child);
            if (child && child.type === 2 && child.children && child.children.numItems > 0) {
                gatherAllItems(child);
            }
        }
    }
    gatherAllItems(lastCamStemBin);

    logs.push("Found " + allProjectItems.length + " item(s) in that bin.");

    // 4) place items named exactly "drums.mp3", "bass.mp3", etc.
    var desiredNames = ["drums.mp3", "bass.mp3", "vocals.mp3", "other.mp3", "piano.mp3", "guitar.mp3"];
    var matchedItems = [];

    for (var d = 0; d < desiredNames.length; d++) {
        var wantName = desiredNames[d].toLowerCase();
        var foundItem = null;
        for (var c = 0; c < allProjectItems.length; c++) {
            var pItem = allProjectItems[c];
            if (!pItem || !pItem.name) continue;

            var pName = pItem.name.toLowerCase();
            if (pName === wantName) {
                foundItem = pItem;
                break;
            }
        }
        if (foundItem) {
            matchedItems.push(foundItem);
            logs.push("Matched => " + wantName + " => " + foundItem.name);
        } else {
            logs.push("No project item matched => " + wantName);
        }
    }

    if (matchedItems.length === 0) {
        logs.push("No stems matched => done.");
        return logs.join("\n");
    }

    // 5) ensure enough tracks
    while (seq.audioTracks.numTracks < matchedItems.length) {
        seq.audioTracks.addTrack();
        logs.push("Created a new audio track => now have " + seq.audioTracks.numTracks);
    }

    // 6) insert each matched item
    var insertTime = foundClip ? foundClip.start : 0.0;
    for (var idx = 0; idx < matchedItems.length; idx++) {
        var trackObj2 = seq.audioTracks[idx];
        var pItem2    = matchedItems[idx];
        logs.push("Placing " + pItem2.name + " on track #" + idx);
        trackObj2.insertClip(pItem2, insertTime);
    }

    // 7) remove original
    if (foundClip && typeof foundClip.remove === "function") {
        foundClip.remove(false, false);
        logs.push("Removed the originally selected clip from the timeline.");
    }

    logs.push("All stems placed on timeline successfully.");
    return logs.join("\n");
}
```

### src/extension/CamStemExtension/CSInterface.js

``` 
/**************************************************************************************************
*
* ADOBE SYSTEMS INCORPORATED
* Copyright 2013 Adobe Systems Incorporated
* All Rights Reserved.
*
* NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
* terms of the Adobe license agreement accompanying it.  If you have received this file from a
* source other than Adobe, then your use, modification, or distribution of it requires the prior
* written permission of Adobe.
*
**************************************************************************************************/

/** CSInterface - v8.0.0 */

/**
 * Stores constants for the window types supported by the CSXS infrastructure.
 */
function CSXSWindowType()
{
}

/** Constant for the CSXS window type Panel. */
CSXSWindowType._PANEL = "Panel";

/** Constant for the CSXS window type Modeless. */
CSXSWindowType._MODELESS = "Modeless";

/** Constant for the CSXS window type ModalDialog. */
CSXSWindowType._MODAL_DIALOG = "ModalDialog";

/** EvalScript error message */
EvalScript_ErrMessage = "EvalScript error.";

/**
 * @class Version
 * Defines a version number with major, minor, micro, and special
 * components. The major, minor and micro values are numeric; the special
 * value can be any string.
 *
 * @param major   The major version component, a positive integer up to nine digits long.
 * @param minor   The minor version component, a positive integer up to nine digits long.
 * @param micro   The micro version component, a positive integer up to nine digits long.
 * @param special The special version component, an arbitrary string.
 *
 * @return A new \c Version object.
 */
function Version(major, minor, micro, special)
{
    this.major = major;
    this.minor = minor;
    this.micro = micro;
    this.special = special;
}

/**
 * The maximum value allowed for a numeric version component.
 * This reflects the maximum value allowed in PlugPlug and the manifest schema.
 */
Version.MAX_NUM = 999999999;

/**
 * @class VersionBound
 * Defines a boundary for a version range, which associates a \c Version object
 * with a flag for whether it is an inclusive or exclusive boundary.
 *
 * @param version   The \c #Version object.
 * @param inclusive True if this boundary is inclusive, false if it is exclusive.
 *
 * @return A new \c VersionBound object.
 */
function VersionBound(version, inclusive)
{
    this.version = version;
    this.inclusive = inclusive;
}

/**
 * @class VersionRange
 * Defines a range of versions using a lower boundary and optional upper boundary.
 *
 * @param lowerBound The \c #VersionBound object.
 * @param upperBound The \c #VersionBound object, or null for a range with no upper boundary.
 *
 * @return A new \c VersionRange object.
 */
function VersionRange(lowerBound, upperBound)
{
    this.lowerBound = lowerBound;
    this.upperBound = upperBound;
}

/**
 * @class Runtime
 * Represents a runtime related to the CEP infrastructure.
 * Extensions can declare dependencies on particular
 * CEP runtime versions in the extension manifest.
 *
 * @param name    The runtime name.
 * @param version A \c #VersionRange object that defines a range of valid versions.
 *
 * @return A new \c Runtime object.
 */
function Runtime(name, versionRange)
{
    this.name = name;
    this.versionRange = versionRange;
}

/**
* @class Extension
* Encapsulates a CEP-based extension to an Adobe application.
*
* @param id              The unique identifier of this extension.
* @param name            The localizable display name of this extension.
* @param mainPath        The path of the "index.html" file.
* @param basePath        The base path of this extension.
* @param windowType          The window type of the main window of this extension.
                 Valid values are defined by \c #CSXSWindowType.
* @param width           The default width in pixels of the main window of this extension.
* @param height          The default height in pixels of the main window of this extension.
* @param minWidth        The minimum width in pixels of the main window of this extension.
* @param minHeight       The minimum height in pixels of the main window of this extension.
* @param maxWidth        The maximum width in pixels of the main window of this extension.
* @param maxHeight       The maximum height in pixels of the main window of this extension.
* @param defaultExtensionDataXml The extension data contained in the default \c ExtensionDispatchInfo section of the extension manifest.
* @param specialExtensionDataXml The extension data contained in the application-specific \c ExtensionDispatchInfo section of the extension manifest.
* @param requiredRuntimeList     An array of \c Runtime objects for runtimes required by this extension.
* @param isAutoVisible       True if this extension is visible on loading.
* @param isPluginExtension   True if this extension has been deployed in the Plugins folder of the host application.
*
* @return A new \c Extension object.
*/
function Extension(id, name, mainPath, basePath, windowType, width, height, minWidth, minHeight, maxWidth, maxHeight,
                   defaultExtensionDataXml, specialExtensionDataXml, requiredRuntimeList, isAutoVisible, isPluginExtension)
{
    this.id = id;
    this.name = name;
    this.mainPath = mainPath;
    this.basePath = basePath;
    this.windowType = windowType;
    this.width = width;
    this.height = height;
    this.minWidth = minWidth;
    this.minHeight = minHeight;
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;
    this.defaultExtensionDataXml = defaultExtensionDataXml;
    this.specialExtensionDataXml = specialExtensionDataXml;
    this.requiredRuntimeList = requiredRuntimeList;
    this.isAutoVisible = isAutoVisible;
    this.isPluginExtension = isPluginExtension;
}

/**
 * @class CSEvent
 * A standard JavaScript event, the base class for CEP events.
 *
 * @param type        The name of the event type.
 * @param scope       The scope of event, can be "GLOBAL" or "APPLICATION".
 * @param appId       The unique identifier of the application that generated the event.
 * @param extensionId     The unique identifier of the extension that generated the event.
 *
 * @return A new \c CSEvent object
 */
function CSEvent(type, scope, appId, extensionId)
{
    this.type = type;
    this.scope = scope;
    this.appId = appId;
    this.extensionId = extensionId;
}

/** Event-specific data. */
CSEvent.prototype.data = "";

/**
 * @class SystemPath
 * Stores operating-system-specific location constants for use in the
 * \c #CSInterface.getSystemPath() method.
 * @return A new \c SystemPath object.
 */
function SystemPath()
{
}

/** The path to user data.  */
SystemPath.USER_DATA = "userData";

/** The path to common files for Adobe applications.  */
SystemPath.COMMON_FILES = "commonFiles";

/** The path to the user's default document folder.  */
SystemPath.MY_DOCUMENTS = "myDocuments";

/** @deprecated. Use \c #SystemPath.Extension.  */
SystemPath.APPLICATION = "application";

/** The path to current extension.  */
SystemPath.EXTENSION = "extension";

/** The path to hosting application's executable.  */
SystemPath.HOST_APPLICATION = "hostApplication";

/**
 * @class ColorType
 * Stores color-type constants.
 */
function ColorType()
{
}

/** RGB color type. */
ColorType.RGB = "rgb";

/** Gradient color type. */
ColorType.GRADIENT = "gradient";

/** Null color type. */
ColorType.NONE = "none";

/**
 * @class RGBColor
 * Stores an RGB color with red, green, blue, and alpha values.
 * All values are in the range [0.0 to 255.0]. Invalid numeric values are
 * converted to numbers within this range.
 *
 * @param red   The red value, in the range [0.0 to 255.0].
 * @param green The green value, in the range [0.0 to 255.0].
 * @param blue  The blue value, in the range [0.0 to 255.0].
 * @param alpha The alpha (transparency) value, in the range [0.0 to 255.0].
 *      The default, 255.0, means that the color is fully opaque.
 *
 * @return A new RGBColor object.
 */
function RGBColor(red, green, blue, alpha)
{
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.alpha = alpha;
}

/**
 * @class Direction
 * A point value  in which the y component is 0 and the x component
 * is positive or negative for a right or left direction,
 * or the x component is 0 and the y component is positive or negative for
 * an up or down direction.
 *
 * @param x     The horizontal component of the point.
 * @param y     The vertical component of the point.
 *
 * @return A new \c Direction object.
 */
function Direction(x, y)
{
    this.x = x;
    this.y = y;
}

/**
 * @class GradientStop
 * Stores gradient stop information.
 *
 * @param offset   The offset of the gradient stop, in the range [0.0 to 1.0].
 * @param rgbColor The color of the gradient at this point, an \c #RGBColor object.
 *
 * @return GradientStop object.
 */
function GradientStop(offset, rgbColor)
{
    this.offset = offset;
    this.rgbColor = rgbColor;
}

/**
 * @class GradientColor
 * Stores gradient color information.
 *
 * @param type          The gradient type, must be "linear".
 * @param direction     A \c #Direction object for the direction of the gradient
                (up, down, right, or left).
 * @param numStops          The number of stops in the gradient.
 * @param gradientStopList  An array of \c #GradientStop objects.
 *
 * @return A new \c GradientColor object.
 */
function GradientColor(type, direction, numStops, arrGradientStop)
{
    this.type = type;
    this.direction = direction;
    this.numStops = numStops;
    this.arrGradientStop = arrGradientStop;
}

/**
 * @class UIColor
 * Stores color information, including the type, anti-alias level, and specific color
 * values in a color object of an appropriate type.
 *
 * @param type          The color type, 1 for "rgb" and 2 for "gradient".
                The supplied color object must correspond to this type.
 * @param antialiasLevel    The anti-alias level constant.
 * @param color         A \c #RGBColor or \c #GradientColor object containing specific color information.
 *
 * @return A new \c UIColor object.
 */
function UIColor(type, antialiasLevel, color)
{
    this.type = type;
    this.antialiasLevel = antialiasLevel;
    this.color = color;
}

/**
 * @class AppSkinInfo
 * Stores window-skin properties, such as color and font. All color parameter values are \c #UIColor objects except that systemHighlightColor is \c #RGBColor object.
 *
 * @param baseFontFamily        The base font family of the application.
 * @param baseFontSize          The base font size of the application.
 * @param appBarBackgroundColor     The application bar background color.
 * @param panelBackgroundColor      The background color of the extension panel.
 * @param appBarBackgroundColorSRGB     The application bar background color, as sRGB.
 * @param panelBackgroundColorSRGB      The background color of the extension panel, as sRGB.
 * @param systemHighlightColor          The highlight color of the extension panel, if provided by the host application. Otherwise, the operating-system highlight color. 
 *
 * @return AppSkinInfo object.
 */
function AppSkinInfo(baseFontFamily, baseFontSize, appBarBackgroundColor, panelBackgroundColor, appBarBackgroundColorSRGB, panelBackgroundColorSRGB, systemHighlightColor)
{
    this.baseFontFamily = baseFontFamily;
    this.baseFontSize = baseFontSize;
    this.appBarBackgroundColor = appBarBackgroundColor;
    this.panelBackgroundColor = panelBackgroundColor;
    this.appBarBackgroundColorSRGB = appBarBackgroundColorSRGB;
    this.panelBackgroundColorSRGB = panelBackgroundColorSRGB;
    this.systemHighlightColor = systemHighlightColor;
}

/**
 * @class HostEnvironment
 * Stores information about the environment in which the extension is loaded.
 *
 * @param appName   The application's name.
 * @param appVersion    The application's version.
 * @param appLocale The application's current license locale.
 * @param appUILocale   The application's current UI locale.
 * @param appId     The application's unique identifier.
 * @param isAppOnline  True if the application is currently online.
 * @param appSkinInfo   An \c #AppSkinInfo object containing the application's default color and font styles.
 *
 * @return A new \c HostEnvironment object.
 */
function HostEnvironment(appName, appVersion, appLocale, appUILocale, appId, isAppOnline, appSkinInfo)
{
    this.appName = appName;
    this.appVersion = appVersion;
    this.appLocale = appLocale;
    this.appUILocale = appUILocale;
    this.appId = appId;
    this.isAppOnline = isAppOnline;
    this.appSkinInfo = appSkinInfo;
}

/**
 * @class HostCapabilities
 * Stores information about the host capabilities.
 *
 * @param EXTENDED_PANEL_MENU True if the application supports panel menu.
 * @param EXTENDED_PANEL_ICONS True if the application supports panel icon.
 * @param DELEGATE_APE_ENGINE True if the application supports delegated APE engine.
 * @param SUPPORT_HTML_EXTENSIONS True if the application supports HTML extensions.
 * @param DISABLE_FLASH_EXTENSIONS True if the application disables FLASH extensions.
 *
 * @return A new \c HostCapabilities object.
 */
function HostCapabilities(EXTENDED_PANEL_MENU, EXTENDED_PANEL_ICONS, DELEGATE_APE_ENGINE, SUPPORT_HTML_EXTENSIONS, DISABLE_FLASH_EXTENSIONS)
{
    this.EXTENDED_PANEL_MENU = EXTENDED_PANEL_MENU;
    this.EXTENDED_PANEL_ICONS = EXTENDED_PANEL_ICONS;
    this.DELEGATE_APE_ENGINE = DELEGATE_APE_ENGINE;
    this.SUPPORT_HTML_EXTENSIONS = SUPPORT_HTML_EXTENSIONS;
	this.DISABLE_FLASH_EXTENSIONS = DISABLE_FLASH_EXTENSIONS; // Since 5.0.0
}

/**
 * @class ApiVersion
 * Stores current api version.
 *
 * Since 4.2.0
 *
 * @param major  The major version
 * @param minor  The minor version.
 * @param micro  The micro version.
 *
 * @return ApiVersion object.
 */
function ApiVersion(major, minor, micro)
{
    this.major = major;
    this.minor = minor;
    this.micro = micro;
}

/**
 * @class MenuItemStatus
 * Stores flyout menu item status
 *
 * Since 5.2.0
 *
 * @param menuItemLabel  The menu item label.
 * @param enabled  		 True if user wants to enable the menu item.
 * @param checked  		 True if user wants to check the menu item.
 *
 * @return MenuItemStatus object.
 */
function MenuItemStatus(menuItemLabel, enabled, checked)
{
	this.menuItemLabel = menuItemLabel;
	this.enabled = enabled;
	this.checked = checked;
}

/**
 * @class ContextMenuItemStatus
 * Stores the status of the context menu item.
 *
 * Since 5.2.0
 *
 * @param menuItemID     The menu item id.
 * @param enabled  		 True if user wants to enable the menu item.
 * @param checked  		 True if user wants to check the menu item.
 *
 * @return MenuItemStatus object.
 */
function ContextMenuItemStatus(menuItemID, enabled, checked)
{
	this.menuItemID = menuItemID;
	this.enabled = enabled;
	this.checked = checked;
}
//------------------------------ CSInterface ----------------------------------

/**
 * @class CSInterface
 * This is the entry point to the CEP extensibility infrastructure.
 * Instantiate this object and use it to:
 * <ul>
 * <li>Access information about the host application in which an extension is running</li>
 * <li>Launch an extension</li>
 * <li>Register interest in event notifications, and dispatch events</li>
 * </ul>
 *
 * @return A new \c CSInterface object
 */
function CSInterface()
{
}

/**
 * User can add this event listener to handle native application theme color changes.
 * Callback function gives extensions ability to fine-tune their theme color after the
 * global theme color has been changed.
 * The callback function should be like below:
 *
 * @example
 * // event is a CSEvent object, but user can ignore it.
 * function OnAppThemeColorChanged(event)
 * {
 *    // Should get a latest HostEnvironment object from application.
 *    var skinInfo = JSON.parse(window.__adobe_cep__.getHostEnvironment()).appSkinInfo;
 *    // Gets the style information such as color info from the skinInfo,
 *    // and redraw all UI controls of your extension according to the style info.
 * }
 */
CSInterface.THEME_COLOR_CHANGED_EVENT = "com.adobe.csxs.events.ThemeColorChanged";

/** The host environment data object. */
CSInterface.prototype.hostEnvironment = window.__adobe_cep__ ? JSON.parse(window.__adobe_cep__.getHostEnvironment()) : null;

/** Retrieves information about the host environment in which the
 *  extension is currently running.
 *
 *   @return A \c #HostEnvironment object.
 */
CSInterface.prototype.getHostEnvironment = function()
{
    this.hostEnvironment = JSON.parse(window.__adobe_cep__.getHostEnvironment());
    return this.hostEnvironment;
};

/** Closes this extension. */
CSInterface.prototype.closeExtension = function()
{
    window.__adobe_cep__.closeExtension();
};

/**
 * Retrieves a path for which a constant is defined in the system.
 *
 * @param pathType The path-type constant defined in \c #SystemPath ,
 *
 * @return The platform-specific system path string.
 */
CSInterface.prototype.getSystemPath = function(pathType)
{
    var path = decodeURI(window.__adobe_cep__.getSystemPath(pathType));
    var OSVersion = this.getOSInformation();
    if (OSVersion.indexOf("Windows") >= 0)
    {
      path = path.replace("file:///", "");
    }
    else if (OSVersion.indexOf("Mac") >= 0)
    {
      path = path.replace("file://", "");
    }
    return path;
};

/**
 * Evaluates a JavaScript script, which can use the JavaScript DOM
 * of the host application.
 *
 * @param script    The JavaScript script.
 * @param callback  Optional. A callback function that receives the result of execution.
 *          If execution fails, the callback function receives the error message \c EvalScript_ErrMessage.
 */
CSInterface.prototype.evalScript = function(script, callback)
{
    if(callback === null || callback === undefined)
    {
        callback = function(result){};
    }
    window.__adobe_cep__.evalScript(script, callback);
};

/**
 * Retrieves the unique identifier of the application.
 * in which the extension is currently running.
 *
 * @return The unique ID string.
 */
CSInterface.prototype.getApplicationID = function()
{
    var appId = this.hostEnvironment.appId;
    return appId;
};

/**
 * Retrieves host capability information for the application
 * in which the extension is currently running.
 *
 * @return A \c #HostCapabilities object.
 */
CSInterface.prototype.getHostCapabilities = function()
{
    var hostCapabilities = JSON.parse(window.__adobe_cep__.getHostCapabilities() );
    return hostCapabilities;
};

/**
 * Triggers a CEP event programmatically. Yoy can use it to dispatch
 * an event of a predefined type, or of a type you have defined.
 *
 * @param event A \c CSEvent object.
 */
CSInterface.prototype.dispatchEvent = function(event)
{
    if (typeof event.data == "object")
    {
        event.data = JSON.stringify(event.data);
    }

    window.__adobe_cep__.dispatchEvent(event);
};

/**
 * Registers an interest in a CEP event of a particular type, and
 * assigns an event handler.
 * The event infrastructure notifies your extension when events of this type occur,
 * passing the event object to the registered handler function.
 *
 * @param type     The name of the event type of interest.
 * @param listener The JavaScript handler function or method.
 * @param obj      Optional, the object containing the handler method, if any.
 *         Default is null.
 */
CSInterface.prototype.addEventListener = function(type, listener, obj)
{
    window.__adobe_cep__.addEventListener(type, listener, obj);
};

/**
 * Removes a registered event listener.
 *
 * @param type      The name of the event type of interest.
 * @param listener  The JavaScript handler function or method that was registered.
 * @param obj       Optional, the object containing the handler method, if any.
 *          Default is null.
 */
CSInterface.prototype.removeEventListener = function(type, listener, obj)
{
    window.__adobe_cep__.removeEventListener(type, listener, obj);
};

/**
 * Loads and launches another extension, or activates the extension if it is already loaded.
 *
 * @param extensionId       The extension's unique identifier.
 * @param startupParams     Not currently used, pass "".
 *
 * @example
 * To launch the extension "help" with ID "HLP" from this extension, call:
 * <code>requestOpenExtension("HLP", ""); </code>
 *
 */
CSInterface.prototype.requestOpenExtension = function(extensionId, params)
{
    window.__adobe_cep__.requestOpenExtension(extensionId, params);
};

/**
 * Retrieves the list of extensions currently loaded in the current host application.
 * The extension list is initialized once, and remains the same during the lifetime
 * of the CEP session.
 *
 * @param extensionIds  Optional, an array of unique identifiers for extensions of interest.
 *          If omitted, retrieves data for all extensions.
 *
 * @return Zero or more \c #Extension objects.
 */
CSInterface.prototype.getExtensions = function(extensionIds)
{
    var extensionIdsStr = JSON.stringify(extensionIds);
    var extensionsStr = window.__adobe_cep__.getExtensions(extensionIdsStr);

    var extensions = JSON.parse(extensionsStr);
    return extensions;
};

/**
 * Retrieves network-related preferences.
 *
 * @return A JavaScript object containing network preferences.
 */
CSInterface.prototype.getNetworkPreferences = function()
{
    var result = window.__adobe_cep__.getNetworkPreferences();
    var networkPre = JSON.parse(result);

    return networkPre;
};

/**
 * Initializes the resource bundle for this extension with property values
 * for the current application and locale.
 * To support multiple locales, you must define a property file for each locale,
 * containing keyed display-string values for that locale.
 * See localization documentation for Extension Builder and related products.
 *
 * Keys can be in the
 * form <code>key.value="localized string"</code>, for use in HTML text elements.
 * For example, in this input element, the localized \c key.value string is displayed
 * instead of the empty \c value string:
 *
 * <code><input type="submit" value="" data-locale="key"/></code>
 *
 * @return An object containing the resource bundle information.
 */
CSInterface.prototype.initResourceBundle = function()
{
    var resourceBundle = JSON.parse(window.__adobe_cep__.initResourceBundle());
    var resElms = document.querySelectorAll('[data-locale]');
    for (var n = 0; n < resElms.length; n++)
    {
       var resEl = resElms[n];
       // Get the resource key from the element.
       var resKey = resEl.getAttribute('data-locale');
       if (resKey)
       {
           // Get all the resources that start with the key.
           for (var key in resourceBundle)
           {
               if (key.indexOf(resKey) === 0)
               {
                   var resValue = resourceBundle[key];
                   if (key.length == resKey.length)
                   {
                        resEl.innerHTML = resValue;
                   }
                   else if ('.' == key.charAt(resKey.length))
                   {
                        var attrKey = key.substring(resKey.length + 1);
                        resEl[attrKey] = resValue;
                   }
               }
           }
       }
    }
    return resourceBundle;
};

/**
 * Writes installation information to a file.
 *
 * @return The file path.
 */
CSInterface.prototype.dumpInstallationInfo = function()
{
    return window.__adobe_cep__.dumpInstallationInfo();
};

/**
 * Retrieves version information for the current Operating System,
 * See http://www.useragentstring.com/pages/Chrome/ for Chrome \c navigator.userAgent values.
 *
 * @return A string containing the OS version, or "unknown Operation System".
 * If user customizes the User Agent by setting CEF command parameter "--user-agent", only
 * "Mac OS X" or "Windows" will be returned. 
 */
CSInterface.prototype.getOSInformation = function()
{
    var userAgent = navigator.userAgent;

    if ((navigator.platform == "Win32") || (navigator.platform == "Windows"))
    {
        var winVersion = "Windows";
        var winBit = "";
        if (userAgent.indexOf("Windows") > -1)
        {
            if (userAgent.indexOf("Windows NT 5.0") > -1)
            {
                winVersion = "Windows 2000";
            }
            else if (userAgent.indexOf("Windows NT 5.1") > -1)
            {
                winVersion = "Windows XP";
            }
            else if (userAgent.indexOf("Windows NT 5.2") > -1)
            {
                winVersion = "Windows Server 2003";
            }
            else if (userAgent.indexOf("Windows NT 6.0") > -1)
            {
                winVersion = "Windows Vista";
            }
            else if (userAgent.indexOf("Windows NT 6.1") > -1)
            {
                winVersion = "Windows 7";
            }
            else if (userAgent.indexOf("Windows NT 6.2") > -1)
            {
                winVersion = "Windows 8";
            }
            else if (userAgent.indexOf("Windows NT 6.3") > -1)
            {
                winVersion = "Windows 8.1";
            }
            else if (userAgent.indexOf("Windows NT 10") > -1)
            {
                winVersion = "Windows 10";
            }

            if (userAgent.indexOf("WOW64") > -1 || userAgent.indexOf("Win64") > -1)
            {
                winBit = " 64-bit";
            }
            else
            {
                winBit = " 32-bit";			
            }
        }

        return winVersion + winBit;
    }
    else if ((navigator.platform == "MacIntel") || (navigator.platform == "Macintosh"))
    {        
        var result = "Mac OS X";

        if (userAgent.indexOf("Mac OS X") > -1)
        {
            result = userAgent.substring(userAgent.indexOf("Mac OS X"), userAgent.indexOf(")"));
            result = result.replace(/_/g, ".");
        }

        return result;        
    }

    return "Unknown Operation System";
};

/**
 * Opens a page in the default system browser.
 *
 * Since 4.2.0
 *
 * @param url  The URL of the page/file to open, or the email address.
 * Must use HTTP/HTTPS/file/mailto protocol. For example:
 *   "http://www.adobe.com"
 *   "https://github.com"
 *   "file:///C:/log.txt"
 *   "mailto:test@adobe.com"
 *
 * @return One of these error codes:\n
 *      <ul>\n
 *          <li>NO_ERROR - 0</li>\n
 *          <li>ERR_UNKNOWN - 1</li>\n
 *          <li>ERR_INVALID_PARAMS - 2</li>\n
 *          <li>ERR_INVALID_URL - 201</li>\n
 *      </ul>\n
 */
CSInterface.prototype.openURLInDefaultBrowser = function(url)
{
    return cep.util.openURLInDefaultBrowser(url);
};

/**
 * Retrieves extension ID.
 *
 * Since 4.2.0
 *
 * @return extension ID.
 */
CSInterface.prototype.getExtensionID = function()
{
     return window.__adobe_cep__.getExtensionId();
};

/**
 * Retrieves the scale factor of screen. 
 * On Windows platform, the value of scale factor might be different from operating system's scale factor,
 * since host application may use its self-defined scale factor.
 *
 * Since 4.2.0
 *
 * @return One of the following float number.
 *      <ul>\n
 *          <li> -1.0 when error occurs </li>\n
 *          <li> 1.0 means normal screen </li>\n
 *          <li> >1.0 means HiDPI screen </li>\n
 *      </ul>\n
 */
CSInterface.prototype.getScaleFactor = function()
{
    return window.__adobe_cep__.getScaleFactor();
};

/**
 * Set a handler to detect any changes of scale factor. This only works on Mac.
 *
 * Since 4.2.0
 *
 * @param handler   The function to be called when scale factor is changed.
 *
 */
CSInterface.prototype.setScaleFactorChangedHandler = function(handler)
{
    window.__adobe_cep__.setScaleFactorChangedHandler(handler);
};

/**
 * Retrieves current API version.
 *
 * Since 4.2.0
 *
 * @return ApiVersion object.
 *
 */
CSInterface.prototype.getCurrentApiVersion = function()
{
    var apiVersion = JSON.parse(window.__adobe_cep__.getCurrentApiVersion());
    return apiVersion;
};

/**
 * Set panel flyout menu by an XML.
 *
 * Since 5.2.0
 *
 * Register a callback function for "com.adobe.csxs.events.flyoutMenuClicked" to get notified when a 
 * menu item is clicked.
 * The "data" attribute of event is an object which contains "menuId" and "menuName" attributes. 
 *
 * Register callback functions for "com.adobe.csxs.events.flyoutMenuOpened" and "com.adobe.csxs.events.flyoutMenuClosed"
 * respectively to get notified when flyout menu is opened or closed.
 *
 * @param menu     A XML string which describes menu structure.
 * An example menu XML:
 * <Menu>
 *   <MenuItem Id="menuItemId1" Label="TestExample1" Enabled="true" Checked="false"/>
 *   <MenuItem Label="TestExample2">
 *     <MenuItem Label="TestExample2-1" >
 *       <MenuItem Label="TestExample2-1-1" Enabled="false" Checked="true"/>
 *     </MenuItem>
 *     <MenuItem Label="TestExample2-2" Enabled="true" Checked="true"/>
 *   </MenuItem>
 *   <MenuItem Label="---" />
 *   <MenuItem Label="TestExample3" Enabled="false" Checked="false"/>
 * </Menu>
 *
 */
CSInterface.prototype.setPanelFlyoutMenu = function(menu)
{
    if ("string" != typeof menu)
    {
        return;	
    }

	window.__adobe_cep__.invokeSync("setPanelFlyoutMenu", menu);
};

/**
 * Updates a menu item in the extension window's flyout menu, by setting the enabled
 * and selection status.
 *  
 * Since 5.2.0
 *
 * @param menuItemLabel	The menu item label. 
 * @param enabled		True to enable the item, false to disable it (gray it out).
 * @param checked		True to select the item, false to deselect it.
 *
 * @return false when the host application does not support this functionality (HostCapabilities.EXTENDED_PANEL_MENU is false). 
 *         Fails silently if menu label is invalid.
 *
 * @see HostCapabilities.EXTENDED_PANEL_MENU
 */
CSInterface.prototype.updatePanelMenuItem = function(menuItemLabel, enabled, checked)
{
	var ret = false;
	if (this.getHostCapabilities().EXTENDED_PANEL_MENU) 
	{
		var itemStatus = new MenuItemStatus(menuItemLabel, enabled, checked);
		ret = window.__adobe_cep__.invokeSync("updatePanelMenuItem", JSON.stringify(itemStatus));
	}
	return ret;
};


/**
 * Set context menu by XML string.
 *
 * Since 5.2.0
 *
 * There are a number of conventions used to communicate what type of menu item to create and how it should be handled.
 * - an item without menu ID or menu name is disabled and is not shown.
 * - if the item name is "---" (three hyphens) then it is treated as a separator. The menu ID in this case will always be NULL.
 * - Checkable attribute takes precedence over Checked attribute.
 * - a PNG icon. For optimal display results please supply a 16 x 16px icon as larger dimensions will increase the size of the menu item. 
     The Chrome extension contextMenus API was taken as a reference. 
     https://developer.chrome.com/extensions/contextMenus
 * - the items with icons and checkable items cannot coexist on the same menu level. The former take precedences over the latter.
 *
 * @param menu      A XML string which describes menu structure.
 * @param callback  The callback function which is called when a menu item is clicked. The only parameter is the returned ID of clicked menu item.
 *
 * @description An example menu XML:
 * <Menu>
 *   <MenuItem Id="menuItemId1" Label="TestExample1" Enabled="true" Checkable="true" Checked="false" Icon="./image/small_16X16.png"/>
 *   <MenuItem Id="menuItemId2" Label="TestExample2">
 *     <MenuItem Id="menuItemId2-1" Label="TestExample2-1" >
 *       <MenuItem Id="menuItemId2-1-1" Label="TestExample2-1-1" Enabled="false" Checkable="true" Checked="true"/>
 *     </MenuItem>
 *     <MenuItem Id="menuItemId2-2" Label="TestExample2-2" Enabled="true" Checkable="true" Checked="true"/>
 *   </MenuItem>
 *   <MenuItem Label="---" />
 *   <MenuItem Id="menuItemId3" Label="TestExample3" Enabled="false" Checkable="true" Checked="false"/>
 * </Menu>
 */
CSInterface.prototype.setContextMenu = function(menu, callback)
{
    if ("string" != typeof menu)
    {
        return;
    }
    
	window.__adobe_cep__.invokeAsync("setContextMenu", menu, callback);
};

/**
 * Set context menu by JSON string.
 *
 * Since 6.0.0
 *
 * There are a number of conventions used to communicate what type of menu item to create and how it should be handled.
 * - an item without menu ID or menu name is disabled and is not shown.
 * - if the item label is "---" (three hyphens) then it is treated as a separator. The menu ID in this case will always be NULL.
 * - Checkable attribute takes precedence over Checked attribute.
 * - a PNG icon. For optimal display results please supply a 16 x 16px icon as larger dimensions will increase the size of the menu item. 
     The Chrome extension contextMenus API was taken as a reference.
 * - the items with icons and checkable items cannot coexist on the same menu level. The former take precedences over the latter.
     https://developer.chrome.com/extensions/contextMenus
 *
 * @param menu      A JSON string which describes menu structure.
 * @param callback  The callback function which is called when a menu item is clicked. The only parameter is the returned ID of clicked menu item.
 *
 * @description An example menu JSON:
 *
 * { 
 *      "menu": [
 *          {
 *              "id": "menuItemId1",
 *              "label": "testExample1",
 *              "enabled": true,
 *              "checkable": true,
 *              "checked": false,
 *              "icon": "./image/small_16X16.png"
 *          },
 *          {
 *              "id": "menuItemId2",
 *              "label": "testExample2",
 *              "menu": [
 *                  {
 *                      "id": "menuItemId2-1",
 *                      "label": "testExample2-1",
 *                      "menu": [
 *                          {
 *                              "id": "menuItemId2-1-1",
 *                              "label": "testExample2-1-1",
 *                              "enabled": false,
 *                              "checkable": true,
 *                              "checked": true
 *                          }
 *                      ]
 *                  },
 *                  {
 *                      "id": "menuItemId2-2",
 *                      "label": "testExample2-2",
 *                      "enabled": true,
 *                      "checkable": true,
 *                      "checked": true
 *                  }
 *              ]
 *          },
 *          {
 *              "label": "---"
 *          },
 *          {
 *              "id": "menuItemId3",
 *              "label": "testExample3",
 *              "enabled": false,
 *              "checkable": true,
 *              "checked": false
 *          }
 *      ]
 *  }
 *
 */
CSInterface.prototype.setContextMenuByJSON = function(menu, callback)
{
    if ("string" != typeof menu)
    {
        return;	
    }
    
	window.__adobe_cep__.invokeAsync("setContextMenuByJSON", menu, callback);
};

/**
 * Updates a context menu item by setting the enabled and selection status.
 *  
 * Since 5.2.0
 *
 * @param menuItemID	The menu item ID. 
 * @param enabled		True to enable the item, false to disable it (gray it out).
 * @param checked		True to select the item, false to deselect it.
 */
CSInterface.prototype.updateContextMenuItem = function(menuItemID, enabled, checked)
{
	var itemStatus = new ContextMenuItemStatus(menuItemID, enabled, checked);
	ret = window.__adobe_cep__.invokeSync("updateContextMenuItem", JSON.stringify(itemStatus));
};

/**
 * Get the visibility status of an extension window. 
 *  
 * Since 6.0.0
 *
 * @return true if the extension window is visible; false if the extension window is hidden.
 */
CSInterface.prototype.isWindowVisible = function()
{
	return window.__adobe_cep__.invokeSync("isWindowVisible", "");
};

/**
 * Resize extension's content to the specified dimensions.
 * 1. Works with modal and modeless extensions in all Adobe products.
 * 2. Extension's manifest min/max size constraints apply and take precedence. 
 * 3. For panel extensions
 *    3.1 This works in all Adobe products except:
 *        * Premiere Pro
 *        * Prelude
 *        * After Effects
 *    3.2 When the panel is in certain states (especially when being docked),
 *        it will not change to the desired dimensions even when the
 *        specified size satisfies min/max constraints.
 *
 * Since 6.0.0
 *
 * @param width  The new width
 * @param height The new height
 */
CSInterface.prototype.resizeContent = function(width, height)
{
    window.__adobe_cep__.resizeContent(width, height);
};

/**
 * Register the invalid certificate callback for an extension. 
 * This callback will be triggered when the extension tries to access the web site that contains the invalid certificate on the main frame.
 * But if the extension does not call this function and tries to access the web site containing the invalid certificate, a default error page will be shown.
 *  
 * Since 6.1.0
 *
 * @param callback the callback function
 */
CSInterface.prototype.registerInvalidCertificateCallback = function(callback)
{
    return window.__adobe_cep__.registerInvalidCertificateCallback(callback);
};

/**
 * Register an interest in some key events to prevent them from being sent to the host application.
 *
 * This function works with modeless extensions and panel extensions. 
 * Generally all the key events will be sent to the host application for these two extensions if the current focused element
 * is not text input or dropdown,
 * If you want to intercept some key events and want them to be handled in the extension, please call this function
 * in advance to prevent them being sent to the host application.
 *
 * Since 6.1.0
 *
 * @param keyEventsInterest      A JSON string describing those key events you are interested in. A null object or
                                 an empty string will lead to removing the interest
 *
 * This JSON string should be an array, each object has following keys:
 *
 * keyCode:  [Required] represents an OS system dependent virtual key code identifying
 *           the unmodified value of the pressed key.
 * ctrlKey:  [optional] a Boolean that indicates if the control key was pressed (true) or not (false) when the event occurred.
 * altKey:   [optional] a Boolean that indicates if the alt key was pressed (true) or not (false) when the event occurred.
 * shiftKey: [optional] a Boolean that indicates if the shift key was pressed (true) or not (false) when the event occurred.
 * metaKey:  [optional] (Mac Only) a Boolean that indicates if the Meta key was pressed (true) or not (false) when the event occurred.
 *                      On Macintosh keyboards, this is the command key. To detect Windows key on Windows, please use keyCode instead.
 * An example JSON string:
 *
 * [
 *     {
 *         "keyCode": 48
 *     },
 *     {
 *         "keyCode": 123,
 *         "ctrlKey": true
 *     },
 *     {
 *         "keyCode": 123,
 *         "ctrlKey": true,
 *         "metaKey": true
 *     }
 * ]
 *
 */
CSInterface.prototype.registerKeyEventsInterest = function(keyEventsInterest)
{
    return window.__adobe_cep__.registerKeyEventsInterest(keyEventsInterest);
};

/**
 * Set the title of the extension window. 
 * This function works with modal and modeless extensions in all Adobe products, and panel extensions in Photoshop, InDesign, InCopy, Illustrator, Flash Pro and Dreamweaver.
 *
 * Since 6.1.0
 *
 * @param title The window title.
 */
CSInterface.prototype.setWindowTitle = function(title)
{
    window.__adobe_cep__.invokeSync("setWindowTitle", title);
};

/**
 * Get the title of the extension window. 
 * This function works with modal and modeless extensions in all Adobe products, and panel extensions in Photoshop, InDesign, InCopy, Illustrator, Flash Pro and Dreamweaver.
 *
 * Since 6.1.0
 *
 * @return The window title.
 */
CSInterface.prototype.getWindowTitle = function()
{
    return window.__adobe_cep__.invokeSync("getWindowTitle", "");
};
```

### src/frontend/premiere.html

``` 
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>CamStem - Premiere Integration Setup</title>
  <!-- Include Tailwind + Custom Index CSS -->
  <link rel="stylesheet" href="tailwind-output.css">
  <link rel="stylesheet" href="index.css">
  <style>
    /* Global style for steps container */
    .step {
      display: none; /* hidden by default */
      position: relative;
      padding-bottom: 50px; /* extra space at bottom if needed */
    }

    .buttons-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      justify-content: center;
      margin-top: 1rem;
    }

    .container {
      max-width: 480px; /* override if needed */
    }

    :root {
      --step4-container-height: 450px; /* used for step5 below */
    }

    #step5 {
      height: var(--step4-container-height);
      box-sizing: border-box;
    }
  </style>
</head>
<body>
  <!-- Main Container -->
  <div class="container">

    <!-- STEP 1 -->
    <div id="step1" class="step">
      <h1 class="page-title">Set Up Premiere Pro Integration</h1>
      <p style="margin-bottom:1rem;">
        This extension requires Adobe Premiere Pro 2020 or newer (officially tested with Creative Cloud).
      </p>
      <p style="margin-bottom:1.5rem;">
        Follow these steps to install and configure CamStem for Premiere.
      </p>
      <div class="buttons-row">
        <button id="step1ContinueBtn" class="actionButton">
          OK, Let's Set It Up
        </button>
        <button id="step1CancelBtn" class="actionButton">
          Nevermind, Back to Main Menu
        </button>
      </div>
    </div>

    <!-- STEP 2 => Download Extension -->
    <div id="step2" class="step">
      <h1 class="page-title">Download Extension</h1>
      <p style="margin-bottom:1.5rem;">
        Please go to <strong>camstem.org</strong>, log in, then head to your dashboard.
        Download the CamStem Premiere Extension (.zip), unzip it, and return here once it's ready.
      </p>
      <!-- Removed the external link button; only the Next button remains -->
      <div class="buttons-row">
        <button id="step2NextBtn" class="actionButton">
          Next
        </button>
      </div>
    </div>

    <!-- STEP 3 => Install Extension -->
    <div id="step3" class="step">
      <h1 class="page-title">Install Extension in Extensions Folder</h1>
      <p style="margin-bottom:1.5rem;">
        First, install the extension into your Adobe Extensions folder.
        Use the buttons below to open the default/custom folder,
        then drag (or copy) the "CamStemExtension" folder into it.
      </p>
      <div class="buttons-row">
        <button id="openExtensionsFolderBtn" class="actionButton">
          Open Extensions Folder
        </button>
        <button id="chooseExtensionsFolderBtn" class="actionButton">
          Choose My Own Folder
        </button>
        <button id="step3NextBtn" class="actionButton">
          Next
        </button>
      </div>
    </div>

    <!-- STEP 4 => Add Splitter Path -->
    <div id="step4" class="step">
      <h1 class="page-title">Add Splitter Path</h1>
      <p style="margin-bottom:1.5rem;">
        Copy the Splitter and Model paths into the Premiere extension's fields.
      </p>
      <div class="buttons-row">
        <button id="copySplitterPathBtn" class="actionButton">
          Copy Splitter Path
        </button>
        <button id="copyModelsPathBtn" class="actionButton">
          Copy Model Path
        </button>
        <button id="step4NextBtn" class="actionButton">
          Next
        </button>
      </div>
    </div>

    <!-- STEP 5 => Usage Explanation -->
    <div id="step5" class="step">
      <h1 class="page-title">You Are All Set Up! Here's How to Use It</h1>
      <ul style="text-align:left; margin-left:1.5rem; margin-bottom:1.5rem;">
        <li style="margin-bottom:0.5rem;">
          1) Select the audio clip in Premiere that you want to split.
        </li>
        <li style="margin-bottom:0.5rem;">
          2) In the CamStem extension, click “Split” and wait for the process to finish.
        </li>
        <li style="margin-bottom:0.5rem;">
          3) Make sure the first 4-6 audio tracks are empty; placing stems overwrites them.
        </li>
        <li style="margin-bottom:0.5rem;">
          4) Once placed, you can edit or move the stems as you like.
        </li>
      </ul>
      <div class="buttons-row">
        <button id="step5CompleteBtn" class="actionButton">
          Complete Setup
        </button>
      </div>
    </div>

    <!-- STEP 6 => Completed -->
    <div id="step6" class="step">
      <h1 class="page-title">Premiere Integration Completed</h1>
      <p style="margin-bottom:1.5rem;">
        Now open Adobe Premiere Pro and find the “CamStem” extension. Follow the steps
        to split your audio clips. Happy editing!
      </p>
      <div class="buttons-row">
        <button id="restartSetupBtn" class="actionButton">
          Restart Setup
        </button>
        <button id="step6MenuBtn" class="actionButton">
          Go Back to Main Menu
        </button>
      </div>
    </div>

  </div>

  <script>
    // Step references
    const stepOne   = document.getElementById('step1');
    const stepTwo   = document.getElementById('step2');
    const stepThree = document.getElementById('step3');
    const stepFour  = document.getElementById('step4');
    const stepFive  = document.getElementById('step5');
    const stepSix   = document.getElementById('step6');

    // Step 1
    const step1ContinueBtn = document.getElementById('step1ContinueBtn');
    const step1CancelBtn   = document.getElementById('step1CancelBtn');

    // Step 2 => Download Extension
    // Removed the external link button, so there's only step2NextBtn left
    const step2NextBtn           = document.getElementById('step2NextBtn');

    // Step 3 => Install Extension
    const openExtensionsFolderBtn   = document.getElementById('openExtensionsFolderBtn');
    const chooseExtensionsFolderBtn = document.getElementById('chooseExtensionsFolderBtn');
    const step3NextBtn             = document.getElementById('step3NextBtn');

    // Step 4 => Add Paths
    const copySplitterPathBtn = document.getElementById('copySplitterPathBtn');
    const copyModelsPathBtn   = document.getElementById('copyModelsPathBtn');
    const step4NextBtn        = document.getElementById('step4NextBtn');

    // Step 5 => Usage
    const step5CompleteBtn = document.getElementById('step5CompleteBtn');

    // Step 6 => Completed
    const restartSetupBtn = document.getElementById('restartSetupBtn');
    const step6MenuBtn    = document.getElementById('step6MenuBtn');

    let demucsExecPath   = '';
    let demucsModelsPath = '';

    function switchToStep(num) {
      stepOne.style.display   = 'none';
      stepTwo.style.display   = 'none';
      stepThree.style.display = 'none';
      stepFour.style.display  = 'none';
      stepFive.style.display  = 'none';
      stepSix.style.display   = 'none';

      if (num === 1) stepOne.style.display   = 'block';
      if (num === 2) stepTwo.style.display   = 'block';
      if (num === 3) stepThree.style.display = 'block';
      if (num === 4) stepFour.style.display  = 'block';
      if (num === 5) stepFive.style.display  = 'block';
      if (num === 6) stepSix.style.display   = 'block';
    }

    // On load => jump to step 6 if done, else step 1
    window.addEventListener('load', async () => {
      const done = localStorage.getItem('premiereSetupComplete');
      if (done === 'true') {
        switchToStep(6);
      } else {
        switchToStep(1);
      }

      try {
        const paths = await window.api.getDemucsPaths();
        demucsExecPath   = paths.demucsExec || '';
        demucsModelsPath = paths.models    || '';
      } catch (err) {
        console.error('Error retrieving Demucs paths:', err);
      }
    });

    // Step 1
    step1ContinueBtn.addEventListener('click', () => {
      switchToStep(2);
    });
    step1CancelBtn.addEventListener('click', () => {
      window.location.href = 'dashboard.html';
    });

    // Step 2 => Download Extension
    // Only next button
    step2NextBtn.addEventListener('click', () => {
      switchToStep(3);
    });

    // Step 3 => Install Extension
    openExtensionsFolderBtn.addEventListener('click', async () => {
      try {
        const custom = localStorage.getItem('camstem_customExtensionsPath') || '';
        if (custom) {
          await window.api.openAnyFolder(custom);
        } else {
          const defPath = await window.api.getDefaultExtensionsFolder();
          await window.api.openAnyFolder(defPath);
        }
      } catch (err) {
        alert('Error opening folder:\n' + err);
      }
    });
    chooseExtensionsFolderBtn.addEventListener('click', async () => {
      try {
        const selected = await window.api.selectPath('directory');
        if (selected) {
          localStorage.setItem('camstem_customExtensionsPath', selected);
          alert('Custom folder selected:\n' + selected + '\nThis will now be used.');
        }
      } catch (err) {
        alert('Error choosing folder:\n' + err);
      }
    });
    step3NextBtn.addEventListener('click', () => {
      switchToStep(4);
    });

    // Step 4 => Add Paths
    copySplitterPathBtn.addEventListener('click', async () => {
      try {
        if (!demucsExecPath) {
          alert('Splitter path not found.');
          return;
        }
        await navigator.clipboard.writeText(demucsExecPath);
        alert('Splitter path copied!');
      } catch (err) {
        alert('Error copying splitter path:\n' + err);
      }
    });
    copyModelsPathBtn.addEventListener('click', async () => {
      try {
        if (!demucsModelsPath) {
          alert('Model path not found.');
          return;
        }
        await navigator.clipboard.writeText(demucsModelsPath);
        alert('Model path copied!');
      } catch (err) {
        alert('Error copying model path:\n' + err);
      }
    });
    step4NextBtn.addEventListener('click', () => {
      switchToStep(5);
    });

    // Step 5 => Usage
    step5CompleteBtn.addEventListener('click', () => {
      localStorage.setItem('premiereSetupComplete', 'true');
      switchToStep(6);
    });

    // Step 6 => Completed
    restartSetupBtn.addEventListener('click', () => {
      localStorage.removeItem('premiereSetupComplete');
      switchToStep(1);
    });
    step6MenuBtn.addEventListener('click', () => {
      window.location.href = 'dashboard.html';
    });
  </script>
</body>
</html>
```

### src/frontend/update.html

``` 
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>CamStem - Update</title>
  <!-- Include Tailwind + Custom Index CSS -->
  <link rel="stylesheet" href="tailwind-output.css">
  <link rel="stylesheet" href="index.css">
</head>
<body>
  <!-- Container with a max-width for consistency -->
  <div class="container" style="max-width: 480px;">
    <!-- Use your .page-title class to match other pages -->
    <h1 class="page-title">Update Page</h1>

    <p id="updateStatus" class="hidden"></p>
    <progress id="updateProgress" max="100" value="0" style="display:none;"></progress>

    <div class="buttons">
      <button id="checkForUpdatesButton" class="btn">
        Check for Updates
      </button>
      <button id="installUpdateButton" class="btn">
        Install Update
      </button>
    </div>

    <!-- Back to Menu link -->
    <a href="dashboard.html" class="back-btn">Back to Menu</a>
  </div>

  <!-- Error Modal -->
  <div class="modal" id="errorModal">
    <div class="modal-content">
      <h2>Error</h2>
      <p id="errorMessage"></p>
      <button id="errorModalCloseButton" class="close-btn">Close</button>
    </div>
  </div>

  <script>
    // Grab elements
    const updateStatus = document.getElementById('updateStatus');
    const updateProgress = document.getElementById('updateProgress');
    const checkUpdatesButton = document.getElementById('checkForUpdatesButton');
    const installUpdateButton = document.getElementById('installUpdateButton');

    // Modal
    const errorModal = document.getElementById('errorModal');
    const errorMessageElem = document.getElementById('errorMessage');
    const errorModalCloseButton = document.getElementById('errorModalCloseButton');

    function showErrorModal(message) {
      errorMessageElem.textContent = message;
      errorModal.style.display = 'flex';
    }

    errorModalCloseButton.addEventListener('click', () => {
      errorModal.style.display = 'none';
    });
    window.addEventListener('click', (event) => {
      if (event.target === errorModal) {
        errorModal.style.display = 'none';
      }
    });

    // Listen for autoUpdater events from main.js
    window.api.receive('autoUpdater-event', (data) => {
      console.log('autoUpdater-event:', data);
      switch (data.event) {
        case 'checking-for-update':
          updateStatus.classList.remove('hidden');
          updateStatus.textContent = 'Checking for updates...';
          break;
        case 'update-available':
          updateStatus.classList.remove('hidden');
          updateStatus.textContent = `Update available! New version: ${data.version}. Downloading...`;
          updateProgress.style.display = 'block';
          break;
        case 'download-progress':
          updateProgress.value = data.percent.toFixed(2);
          break;
        case 'update-downloaded':
          updateStatus.classList.remove('hidden');
          updateStatus.textContent = `Update downloaded (v${data.version}). Click "Install Update" to proceed.`;
          break;
        case 'update-not-available':
          updateStatus.classList.remove('hidden');
          updateStatus.textContent = 'No updates available.';
          break;
        case 'error':
          console.error('autoUpdater error:', data.message);
          showErrorModal(`AutoUpdater Error: ${data.message}`);
          break;
        default:
          break;
      }
    });

    // Check for updates on load
    (async () => {
      try {
        await window.api.checkForUpdates();
      } catch (err) {
        console.error('Error checking for updates automatically:', err);
      }
    })();

    // Button handlers
    checkUpdatesButton.addEventListener('click', async () => {
      // Reset UI
      updateStatus.textContent = '';
      updateStatus.classList.add('hidden');
      updateProgress.value = 0;
      updateProgress.style.display = 'none';
      try {
        await window.api.checkForUpdates();
      } catch (err) {
        console.error('Error checking for updates:', err);
        showErrorModal(`Error checking for updates: ${err.message}`);
      }
    });

    installUpdateButton.addEventListener('click', async () => {
      // This will quit and install the new version if available
      try {
        await window.api.installUpdateNow();
      } catch (err) {
        console.error('Error installing update:', err);
        showErrorModal(`Error installing update: ${err.message}`);
      }
    });
  </script>
</body>
</html>
```

### src/frontend/about.html

``` 
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>About CamStem</title>
  <!-- Include Tailwind + Custom Index CSS -->
  <link rel="stylesheet" href="tailwind-output.css">
  <link rel="stylesheet" href="index.css">
  <style>
    /* Restore old gradient background, remove scroll bar */
    html, body {
      margin: 0;
      padding: 0;
      height: 100vh;       /* fill the viewport vertically */
      overflow: hidden;    /* no scroll bar */
      background: linear-gradient(135deg, #006494, #051923);
      color: white;
      text-align: center;
      font-family: Arial, sans-serif; /* or default from index.css */
    }

    /* Container at 576px */
    .container {
      max-width: 576px;
      margin: 0 auto; /* center horizontally */
      padding: 2rem;  /* some spacing inside */
    }

    .carouselWrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .carouselSlide {
      text-align: center;
      padding: 1rem;
      background-color: rgba(255,255,255,0.07);
      border-radius: 8px;
      width: 320px; /* ensures each name line stays on one line */
    }

    .carouselNameLine {
      margin-bottom: 0.5rem;
      font-weight: bold;
      white-space: nowrap; /* keep names on one line */
    }

    .arrowBtn {
      font-size: 1.8rem;
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      transition: transform 0.2s ease;
    }
    .arrowBtn:hover {
      transform: scale(1.2);
    }

    /* Title styling, if needed */
    .page-title {
      font-size: 2.25rem;
      line-height: 2.5rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1 class="page-title">About CamStem</h1>

    <p style="margin-bottom: 1.5rem;">
      CamStem is the first stem splitter built for videography, integrated with Adobe Premiere Pro.
      Developed by David Camick, it uses advanced audio separation to simplify editing so you can quickly
      isolate and manipulate audio. Below are the people who have contributed to the project:
    </p>

    <!-- Carousel -->
    <div class="carouselWrapper">
      <button id="prevSlide" class="arrowBtn">←</button>
      <div style="position: relative;">
        <!-- Slide 1 -->
        <div class="carouselSlide" data-slide="0" style="display: block;">
          <div class="carouselNameLine">Developer: David Camick</div>
          <div class="carouselNameLine">Consultant: Kagen Jensen</div>
          <div class="carouselNameLine">Consultant: Russell Page</div>
          <div class="carouselNameLine">Consultant: Stevie Maloof</div>
          <div class="carouselNameLine">Primary Beta Tester: Ben Gladstone</div>
        </div>

        <!-- Slide 2 -->
        <div class="carouselSlide" data-slide="1" style="display: none;">
          <div class="carouselNameLine">Beta Tester: Cooper Hill</div>
          <div class="carouselNameLine">Beta Tester: Tre Production</div>
          <div class="carouselNameLine">Beta Tester: Physccoo</div>
          <div class="carouselNameLine">Beta Tester: kv.visuals</div>
          <div class="carouselNameLine">Beta Tester: Andrew Schwallier</div>
        </div>

        <!-- Slide 3 -->
        <div class="carouselSlide" data-slide="2" style="display: none;">
          <div class="carouselNameLine">Beta Tester: A Hero's Vision</div>
          <div class="carouselNameLine">Beta Tester: Lude Zombo</div>
          <div class="carouselNameLine">Beta Tester: Taylor Denise</div>
          <div class="carouselNameLine">Beta Tester: Nasir Butler</div>
          <div class="carouselNameLine">Beta Tester: Devin Paschall</div>
        </div>

        <!-- Slide 4 -->
        <div class="carouselSlide" data-slide="3" style="display: none;">
          <div class="carouselNameLine"></div>
          <div class="carouselNameLine"></div>
          <div class="carouselNameLine"></div>
          <div class="carouselNameLine"></div>
          <div class="carouselNameLine"></div>
        </div>

        <!-- Slide 5 -->
        <div class="carouselSlide" data-slide="4" style="display: none;">
          <div class="carouselNameLine"></div>
          <div class="carouselNameLine"></div>
          <div class="carouselNameLine"></div>
          <div class="carouselNameLine"></div>
          <div class="carouselNameLine"></div>
        </div>
      </div>
      <button id="nextSlide" class="arrowBtn">→</button>
    </div>

    <!-- Back to Menu button -->
    <button
      class="actionButton"
      onclick="window.location.href='dashboard.html'"
      style="width: 100%;"
    >
      Back to Menu
    </button>
  </div>

  <!-- Basic Carousel JS -->
  <script>
    (function() {
      let currentSlideIndex = 0;
      const slides = document.querySelectorAll('.carouselSlide');
      const totalSlides = slides.length;
      const prevBtn = document.getElementById('prevSlide');
      const nextBtn = document.getElementById('nextSlide');

      function showSlide(index) {
        slides.forEach((slide, i) => {
          slide.style.display = (i === index) ? 'block' : 'none';
        });
      }

      prevBtn.addEventListener('click', () => {
        currentSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
        showSlide(currentSlideIndex);
      });

      nextBtn.addEventListener('click', () => {
        currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
        showSlide(currentSlideIndex);
      });
    })();
  </script>
</body>
</html>
```

### src/frontend/auth.html

``` 
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Software Key Authentication</title>
  <!-- Include Tailwind + Custom Index CSS -->
  <link rel="stylesheet" href="tailwind-output.css">
  <link rel="stylesheet" href="index.css">
</head>
<body>
  <!-- Container from index.css (max-width override) -->
  <div class="container" style="max-width: 480px;">
    <!-- Same style as landing.html: text-4xl font-bold mb-4 -->
    <h1 class="text-4xl font-bold mb-4">Software Key Authentication</h1>

    <input
      type="text"
      id="softwareKey"
      placeholder="Enter your software key"
      style="
        width: 100%;
        padding: 0.75rem 1rem;
        margin-bottom: 1rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
        color: #333;
      "
    />

    <!-- Buttons side by side, matching landing page style (.actionButton) -->
    <div style="display: flex; gap: 1rem; justify-content: center;">
      <button id="validateButton" class="actionButton">Validate Key</button>
      <button id="logoutButton" class="actionButton">Remove Saved Keys</button>
    </div>

    <p id="statusMessage" class="message" style="margin-top: 1rem;"></p>
  </div>

  <script>
    const softwareKeyInput = document.getElementById('softwareKey');
    const validateButton = document.getElementById('validateButton');
    const logoutButton = document.getElementById('logoutButton');
    const statusMessage = document.getElementById('statusMessage');

    // Load saved key on page load and auto-submit if key exists
    window.addEventListener('load', async () => {
      try {
        const savedKey = await window.api.getSavedKey();
        if (savedKey) {
          softwareKeyInput.value = savedKey;
          validateButton.click(); // Automatically trigger validation
        }
      } catch (error) {
        console.error('Error loading saved key:', error);
      }
    });

    validateButton.addEventListener('click', async () => {
      const softwareKey = softwareKeyInput.value.trim();
      if (!softwareKey) {
        statusMessage.textContent = 'Please enter a software key.';
        statusMessage.classList.remove('success');
        return;
      }

      // Clear the message and disable the button
      statusMessage.textContent = '';
      statusMessage.classList.remove('success');
      validateButton.disabled = true;

      try {
        // 1) Activate the software key
        const keyResult = await window.api.activateSoftwareKey(softwareKey);
        if (!keyResult.success) {
          statusMessage.textContent = `Key validation failed: ${keyResult.error}`;
          validateButton.disabled = false;
          return;
        }

        // 2) Save the software key
        await window.api.saveSoftwareKey(softwareKey);

        // 3) Check subscription status
        const subscriptionStatus = await window.api.checkSubscriptionStatus();
        if (!subscriptionStatus.active) {
          statusMessage.textContent = `Subscription error: ${subscriptionStatus.reason}`;
          validateButton.disabled = false;
          return;
        }

        // Success
        statusMessage.classList.add('success');
        statusMessage.textContent = 'Software key validated and subscription is active!';

        // Proceed to main application
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 2000);
      } catch (error) {
        statusMessage.textContent = `An error occurred: ${error.message}`;
      } finally {
        validateButton.disabled = false;
      }
    });

    logoutButton.addEventListener('click', async () => {
      try {
        await window.api.removeSavedKey();
        softwareKeyInput.value = '';
        statusMessage.textContent = 'All saved keys have been removed.';
        statusMessage.classList.remove('success');
        statusMessage.style.color = '#ffdddd';
      } catch (error) {
        statusMessage.textContent = `An error occurred: ${error.message}`;
      }
    });
  </script>
</body>
</html>
```

### src/frontend/tailwind-output.css

``` 
/* =======================
   Tailwind Directives
   (Already present in your file)
   ======================= */

*, ::before, ::after {
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x:  ;
  --tw-pan-y:  ;
  --tw-pinch-zoom:  ;
  --tw-scroll-snap-strictness: proximity;
  --tw-gradient-from-position:  ;
  --tw-gradient-via-position:  ;
  --tw-gradient-to-position:  ;
  --tw-ordinal:  ;
  --tw-slashed-zero:  ;
  --tw-numeric-figure:  ;
  --tw-numeric-spacing:  ;
  --tw-numeric-fraction:  ;
  --tw-ring-inset:  ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur:  ;
  --tw-brightness:  ;
  --tw-contrast:  ;
  --tw-grayscale:  ;
  --tw-hue-rotate:  ;
  --tw-invert:  ;
  --tw-saturate:  ;
  --tw-sepia:  ;
  --tw-drop-shadow:  ;
  --tw-backdrop-blur:  ;
  --tw-backdrop-brightness:  ;
  --tw-backdrop-contrast:  ;
  --tw-backdrop-grayscale:  ;
  --tw-backdrop-hue-rotate:  ;
  --tw-backdrop-invert:  ;
  --tw-backdrop-opacity:  ;
  --tw-backdrop-saturate:  ;
  --tw-backdrop-sepia:  ;
  --tw-contain-size:  ;
  --tw-contain-layout:  ;
  --tw-contain-paint:  ;
  --tw-contain-style:  ;
}

::backdrop {
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x:  ;
  --tw-pan-y:  ;
  --tw-pinch-zoom:  ;
  --tw-scroll-snap-strictness: proximity;
  --tw-gradient-from-position:  ;
  --tw-gradient-via-position:  ;
  --tw-gradient-to-position:  ;
  --tw-ordinal:  ;
  --tw-slashed-zero:  ;
  --tw-numeric-figure:  ;
  --tw-numeric-spacing:  ;
  --tw-numeric-fraction:  ;
  --tw-ring-inset:  ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur:  ;
  --tw-brightness:  ;
  --tw-contrast:  ;
  --tw-grayscale:  ;
  --tw-hue-rotate:  ;
  --tw-invert:  ;
  --tw-saturate:  ;
  --tw-sepia:  ;
  --tw-drop-shadow:  ;
  --tw-backdrop-blur:  ;
  --tw-backdrop-brightness:  ;
  --tw-backdrop-contrast:  ;
  --tw-backdrop-grayscale:  ;
  --tw-backdrop-hue-rotate:  ;
  --tw-backdrop-invert:  ;
  --tw-backdrop-opacity:  ;
  --tw-backdrop-saturate:  ;
  --tw-backdrop-sepia:  ;
  --tw-contain-size:  ;
  --tw-contain-layout:  ;
  --tw-contain-paint:  ;
  --tw-contain-style:  ;
}

/* ! tailwindcss v3.4.16 | MIT License | https://tailwindcss.com */

/*
1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)
2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)
*/

*,
::before,
::after {
  box-sizing: border-box;
  /* 1 */
  border-width: 0;
  /* 2 */
  border-style: solid;
  /* 2 */
  border-color: #e5e7eb;
  /* 2 */
}

::before,
::after {
  --tw-content: '';
}

/*
1. Use a consistent sensible line-height in all browsers.
2. Prevent adjustments of font size after orientation changes in iOS.
3. Use a more readable tab size.
4. Use the user's configured `sans` font-family by default.
5. Use the user's configured `sans` font-feature-settings by default.
6. Use the user's configured `sans` font-variation-settings by default.
7. Disable tap highlights on iOS
*/

html,
:host {
  line-height: 1.5;
  /* 1 */
  -webkit-text-size-adjust: 100%;
  /* 2 */
  -moz-tab-size: 4;
  /* 3 */
  -o-tab-size: 4;
     tab-size: 4;
  /* 3 */
  font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  /* 4 */
  font-feature-settings: normal;
  /* 5 */
  font-variation-settings: normal;
  /* 6 */
  -webkit-tap-highlight-color: transparent;
  /* 7 */
}

/*
1. Remove the margin in all browsers.
2. Inherit line-height from `html` so users can set them as a class directly on the `html` element.
*/

body {
  margin: 0;
  /* 1 */
  line-height: inherit;
  /* 2 */
}

/*
1. Add the correct height in Firefox.
2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)
3. Ensure horizontal rules are visible by default.
*/

hr {
  height: 0;
  /* 1 */
  color: inherit;
  /* 2 */
  border-top-width: 1px;
  /* 3 */
}

/*
Add the correct text decoration in Chrome, Edge, and Safari.
*/

abbr:where([title]) {
  -webkit-text-decoration: underline dotted;
          text-decoration: underline dotted;
}

/*
Remove the default font size and weight for headings.
*/

h1,
h2,
h3,
h4,
h5,
h6 {
  font-size: inherit;
  font-weight: inherit;
}

/*
Reset links to optimize for opt-in styling instead of opt-out.
*/

a {
  color: inherit;
  text-decoration: inherit;
}

/*
Add the correct font weight in Edge and Safari.
*/

b,
strong {
  font-weight: bolder;
}

/*
1. Use the user's configured `mono` font-family by default.
2. Use the user's configured `mono` font-feature-settings by default.
3. Use the user's configured `mono` font-variation-settings by default.
4. Correct the odd `em` font sizing in all browsers.
*/

code,
kbd,
samp,
pre {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  /* 1 */
  font-feature-settings: normal;
  /* 2 */
  font-variation-settings: normal;
  /* 3 */
  font-size: 1em;
  /* 4 */
}

/*
Add the correct font size in all browsers.
*/

small {
  font-size: 80%;
}

/*
Prevent `sub` and `sup` elements from affecting the line height in all browsers.
*/

sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sub {
  bottom: -0.25em;
}

sup {
  top: -0.5em;
}

/*
1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)
2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)
3. Remove gaps between table borders by default.
*/

table {
  text-indent: 0;
  /* 1 */
  border-color: inherit;
  /* 2 */
  border-collapse: collapse;
  /* 3 */
}

/*
1. Change the font styles in all browsers.
2. Remove the margin in Firefox and Safari.
3. Remove default padding in all browsers.
*/

button,
input,
optgroup,
select,
textarea {
  font-family: inherit;
  /* 1 */
  font-feature-settings: inherit;
  /* 1 */
  font-variation-settings: inherit;
  /* 1 */
  font-size: 100%;
  /* 1 */
  font-weight: inherit;
  /* 1 */
  line-height: inherit;
  /* 1 */
  letter-spacing: inherit;
  /* 1 */
  color: inherit;
  /* 1 */
  margin: 0;
  /* 2 */
  padding: 0;
  /* 3 */
}

/*
Remove the inheritance of text transform in Edge and Firefox.
*/

button,
select {
  text-transform: none;
}

/*
1. Correct the inability to style clickable types in iOS and Safari.
2. Remove default button styles.
*/

button,
input:where([type='button']),
input:where([type='reset']),
input:where([type='submit']) {
  -webkit-appearance: button;
  /* 1 */
  background-color: transparent;
  /* 2 */
  background-image: none;
  /* 2 */
}

/*
Use the modern Firefox focus style for all focusable elements.
*/

:-moz-focusring {
  outline: auto;
}

/*
Remove the additional `:invalid` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)
*/

:-moz-ui-invalid {
  box-shadow: none;
}

/*
Add the correct vertical alignment in Chrome and Firefox.
*/

progress {
  vertical-align: baseline;
}

/*
Correct the cursor style of increment and decrement buttons in Safari.
*/

::-webkit-inner-spin-button,
::-webkit-outer-spin-button {
  height: auto;
}

/*
1. Correct the odd appearance in Chrome and Safari.
2. Correct the outline style in Safari.
*/

[type='search'] {
  -webkit-appearance: textfield;
  /* 1 */
  outline-offset: -2px;
  /* 2 */
}

/*
Remove the inner padding in Chrome and Safari on macOS.
*/

::-webkit-search-decoration {
  -webkit-appearance: none;
}

/*
1. Correct the inability to style clickable types in iOS and Safari.
2. Change font properties to `inherit` in Safari.
*/

::-webkit-file-upload-button {
  -webkit-appearance: button;
  /* 1 */
  font: inherit;
  /* 2 */
}

/*
Add the correct display in Chrome and Safari.
*/

summary {
  display: list-item;
}

/*
Removes the default spacing and border for appropriate elements.
*/

blockquote,
dl,
dd,
h1,
h2,
h3,
h4,
h5,
h6,
hr,
figure,
p,
pre {
  margin: 0;
}

fieldset {
  margin: 0;
  padding: 0;
}

legend {
  padding: 0;
}

ol,
ul,
menu {
  list-style: none;
  margin: 0;
  padding: 0;
}

/*
Reset default styling for dialogs.
*/

dialog {
  padding: 0;
}

/*
Prevent resizing textareas horizontally by default.
*/

textarea {
  resize: vertical;
}

/*
1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)
2. Set the default placeholder color to the user's configured gray 400 color.
*/

input::-moz-placeholder, textarea::-moz-placeholder {
  opacity: 1;
  /* 1 */
  color: #9ca3af;
  /* 2 */
}

input::placeholder,
textarea::placeholder {
  opacity: 1;
  /* 1 */
  color: #9ca3af;
  /* 2 */
}

/*
Set the default cursor for buttons.
*/

button,
[role="button"] {
  cursor: pointer;
}

/*
Make sure disabled buttons don't get the pointer cursor.
*/

:disabled {
  cursor: default;
}

/*
1. Make replaced elements `display: block` by default. (https://github.com/mozdevs/cssremedy/issues/14)
2. Add `vertical-align: middle` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)
   This can trigger a poorly considered lint error in some tools but is included by design.
*/

img,
svg,
video,
canvas,
audio,
iframe,
embed,
object {
  display: block;
  /* 1 */
  vertical-align: middle;
  /* 2 */
}

/*
Constrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)
*/

img,
video {
  max-width: 100%;
  height: auto;
}

/* Make elements with the HTML hidden attribute stay hidden by default */

[hidden]:where(:not([hidden="until-found"])) {
  display: none;
}

.container {
  width: 100%;
}

@media (min-width: 640px) {
  .container {
    max-width: 640px;
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 768px;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
  }
}

@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
  }
}

@media (min-width: 1536px) {
  .container {
    max-width: 1536px;
  }
}

.invisible {
  visibility: hidden;
}

.absolute {
  position: absolute;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.block {
  display: block;
}

.flex {
  display: flex;
}

.grid {
  display: grid;
}

.hidden {
  display: none;
}

.transform {
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.flex-wrap {
  flex-wrap: wrap;
}

.border {
  border-width: 1px;
}

.text-4xl {
  font-size: 2.25rem;
  line-height: 2.5rem;
}

.text-lg {
  font-size: 1.125rem;
  line-height: 1.75rem;
}

.font-bold {
  font-weight: 700;
}

.font-medium {
  font-weight: 500;
}

.filter {
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.ease-in-out {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* =======================
      Global Body Styles
      ======================= */

body {
  background: linear-gradient(135deg, #006494, #051923);
  min-height: 100vh;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Arial, sans-serif;
  color: white;
  text-align: center;
}

/* =======================
      Container Class
      (Used by about.html, dashboard.html, auth.html, etc.)
      ======================= */

.container {
  width: 100%;
  max-width: 400px;
  /* Some pages override this via inline style or a special class */
  padding: 2rem;
  background-color: rgba(5, 130, 202, 0.95);
  border-radius: 12px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
}

/* =======================
      Buttons (Shared .btn)
      ======================= */

/* A generic .btn baseline */

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  background-color: #003554;
  /* default color if needed */
  color: white;
  transition: transform 0.3s ease, background-color 0.3s ease;
  margin-bottom: 1rem;
  /* in some pages, all buttons are spaced out */
}

.btn:hover {
  background-color: #002940;
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Variation: .btn-primary */

.btn-primary {
  background-color: #28a745;
}

.btn-primary:hover {
  background-color: #218838;
  transform: translateY(-2px);
}

/* Variation: .btn-secondary */

.btn-secondary {
  background-color: #17a2b8;
}

.btn-secondary:hover {
  background-color: #138496;
  transform: translateY(-2px);
}

/* Variation: .btn-danger */

.btn-danger {
  background-color: #dc3545;
}

.btn-danger:hover {
  background-color: #c82333;
  transform: translateY(-2px);
}

/* =======================
      Additional button classes from various pages
      ======================= */

/* The `.actionButton` used on landing.html */

.actionButton {
  background-color: #003554;
  color: white;
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
  border-radius: 0.375rem;
  transition: transform 0.3s ease, background-color 0.3s ease;
  margin-bottom: 1rem;
  display: inline-block;
  border: none;
  cursor: pointer;
}

.actionButton:hover {
  background-color: #002940;
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* The `.danger-button` from settings.html (same as .btn-danger but included for references). */

.danger-button {
  background-color: #8B0000;
}

.danger-button:hover {
  background-color: #690000;
}

/* Pill-shaped version button from dashboard.html */

.version-button {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  background-color: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.85rem;
  margin-top: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  text-decoration: none;
}

.version-button:hover {
  background-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

/* The ".back-btn" link from update.html */

.back-btn {
  margin-top: 1rem;
  background-color: #003554;
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  text-decoration: none;
  color: white;
}

.back-btn:hover {
  background-color: #002940;
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* =======================
      Modals (Error modal, info modal, sign-up modal, etc.)
      ======================= */

.modal {
  display: none;
  /* Hidden by default */
  position: fixed;
  z-index: 99;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.6);
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: #003554;
  margin: auto;
  padding: 1.5rem;
  border-radius: 8px;
  width: 80%;
  max-width: 400px;
  color: #fff;
  text-align: center;
}

/* The "Close" button inside a modal */

.close-btn {
  background-color: #8B0000;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.close-btn:hover {
  background-color: #690000;
  transform: translateY(-3px);
}

/* .modal-buttons typically used for two side-by-side buttons in the modal */

.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.modal-buttons .btn {
  max-width: 100px;
}

/* =======================
      Landing Page Specific (landing.html)
      ======================= */

/* The #introVideoWrapper & #introVideo & .hidden from landing.html */

#introVideoWrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  /* no background color behind the video */
}

#introVideo {
  width: 100%;
  height: auto;
  -o-object-fit: cover;
     object-fit: cover;
  /* maintain aspect ratio + fill space */
}

/* Hide elements (e.g., #mainContent during video) */

.hidden {
  display: none;
}

/* =======================
      About Page Specific (about.html)
      ======================= */

.credits-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}

/* =======================
      Dashboard Page Specific (dashboard.html)
      ======================= */

.dashboard-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}

/* =======================
      Splitter Page Specific (splitter.html)
      ======================= */

/* Two-column layout for the form */

.form-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.form-column {
  flex: 1 1 45%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Form group styling */

.form-group {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: bold;
  font-size: 0.95rem;
}

/* Additional select styling used for models/presets if needed */

.mp3-model-select {
  width: 100%;
  padding: 0.6rem;
  border: none;
  border-radius: 6px;
  background-color: #e9ecef;
  color: #333;
}

/* Buttons container inside the form */

.buttons-container {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.buttons-container button {
  flex: 1;
  max-width: 33%;
}

/* Collapsible log section */

.log-section {
  margin-top: 1.5rem;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background-color: #006494;
  padding: 0.5rem 1rem;
  border-radius: 6px;
}

.log-header h2 {
  margin: 0;
  font-size: 1.2rem;
}

.log-toggle {
  background: none;
  border: none;
  color: white;
  font-size: 1rem;
  cursor: pointer;
}

/* The logs content container (collapsed by default) */

.logs {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease;
  background-color: #ffffff;
  color: #333;
  padding: 0 1rem;
  /* Start collapsed with zero side padding if you prefer */
  border-radius: 6px;
  margin-top: 0.5rem;
}

.logs.open {
  max-height: 300px;
  /* or another limit */
  padding: 1rem;
  /* show padding once expanded */
}

.logs p {
  margin: 0.5rem 0;
  font-size: 0.95rem;
  color: #333;
}

/* =======================
      Update Page Specific (update.html)
      ======================= */

.buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;
}

/* 
  A reusable page title style 
  (similar to text-4xl font-bold mb-4 in Tailwind)
*/

.page-title {
  font-size: 2.25rem;
  /* ~ text-4xl */
  line-height: 2.5rem;
  font-weight: 700;
  /* bold */
  margin-bottom: 1rem;
  /* like mb-4 */
}

.focus\:ring-2:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.focus\:ring-blue-400:focus {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(96 165 250 / var(--tw-ring-opacity, 1));
}
```

### src/frontend/index.css

``` 
/* =======================
   Tailwind Directives
   (Already present in your file)
   ======================= */

   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   
   /* =======================
      Global Body Styles
      ======================= */
   
   body {
     background: linear-gradient(135deg, #006494, #051923);
     min-height: 100vh;
     margin: 0;
     display: flex;
     align-items: center;
     justify-content: center;
     font-family: Arial, sans-serif;
     color: white;
     text-align: center;
   }
   
   /* =======================
      Container Class
      (Used by about.html, dashboard.html, auth.html, etc.)
      ======================= */
   
   .container {
     width: 100%;
     max-width: 400px; /* Some pages override this via inline style or a special class */
     padding: 2rem;
     background-color: rgba(5, 130, 202, 0.95);
     border-radius: 12px;
     box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
   }
   
   /* =======================
      Buttons (Shared .btn)
      ======================= */
   
   /* A generic .btn baseline */
   .btn {
     display: inline-block;
     padding: 0.75rem 1.5rem;
     font-size: 1rem;
     border-radius: 0.375rem;
     border: none;
     cursor: pointer;
     background-color: #003554; /* default color if needed */
     color: white;
     transition: transform 0.3s ease, background-color 0.3s ease;
     margin-bottom: 1rem; /* in some pages, all buttons are spaced out */
   }
   
   .btn:hover {
     background-color: #002940;
     transform: translateY(-4px);
     box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
   }
   
   /* Variation: .btn-primary */
   .btn-primary {
     background-color: #28a745;
   }
   .btn-primary:hover {
     background-color: #218838;
     transform: translateY(-2px);
   }
   
   /* Variation: .btn-secondary */
   .btn-secondary {
     background-color: #17a2b8;
   }
   .btn-secondary:hover {
     background-color: #138496;
     transform: translateY(-2px);
   }
   
   /* Variation: .btn-danger */
   .btn-danger {
     background-color: #dc3545;
   }
   .btn-danger:hover {
     background-color: #c82333;
     transform: translateY(-2px);
   }
   
   /* =======================
      Additional button classes from various pages
      ======================= */
   
   /* The `.actionButton` used on landing.html */
   .actionButton {
     background-color: #003554;
     color: white;
     padding: 0.75rem 1.5rem;
     font-size: 1.125rem;
     border-radius: 0.375rem;
     transition: transform 0.3s ease, background-color 0.3s ease;
     margin-bottom: 1rem;
     display: inline-block;
     border: none;
     cursor: pointer;
   }
   .actionButton:hover {
     background-color: #002940;
     transform: translateY(-4px);
     box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
   }
   
   /* The `.danger-button` from settings.html (same as .btn-danger but included for references). */
   .danger-button {
     background-color: #8B0000;
   }
   .danger-button:hover {
     background-color: #690000;
   }
   
   /* Pill-shaped version button from dashboard.html */
   .version-button {
     display: inline-block;
     padding: 0.35rem 0.75rem;
     border-radius: 9999px;
     background-color: rgba(255, 255, 255, 0.15);
     color: rgba(255, 255, 255, 0.9);
     font-size: 0.85rem;
     margin-top: 1rem;
     cursor: pointer;
     transition: background-color 0.3s ease, transform 0.3s ease;
     text-decoration: none;
   }
   .version-button:hover {
     background-color: rgba(255, 255, 255, 0.25);
     transform: translateY(-2px);
   }
   
   /* The ".back-btn" link from update.html */
   .back-btn {
     margin-top: 1rem;
     background-color: #003554;
     display: inline-block;
     padding: 0.75rem 1.5rem;
     border-radius: 0.375rem;
     font-size: 1rem;
     cursor: pointer;
     transition: background-color 0.3s ease, transform 0.3s ease;
     text-decoration: none;
     color: white;
   }
   .back-btn:hover {
     background-color: #002940;
     transform: translateY(-4px);
     box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
   }
   
   /* =======================
      Modals (Error modal, info modal, sign-up modal, etc.)
      ======================= */
   
   .modal {
     display: none; /* Hidden by default */
     position: fixed;
     z-index: 99;
     left: 0;
     top: 0;
     width: 100%;
     height: 100%;
     overflow: auto;
     background-color: rgba(0, 0, 0, 0.6);
     align-items: center;
     justify-content: center;
   }
   
   .modal-content {
     background-color: #003554;
     margin: auto;
     padding: 1.5rem;
     border-radius: 8px;
     width: 80%;
     max-width: 400px;
     color: #fff;
     text-align: center;
   }
   
   /* The "Close" button inside a modal */
   .close-btn {
     background-color: #8B0000;
     color: #fff;
     border: none;
     border-radius: 4px;
     padding: 0.5rem 1rem;
     font-size: 1rem;
     cursor: pointer;
     transition: background-color 0.3s ease, transform 0.3s ease;
   }
   .close-btn:hover {
     background-color: #690000;
     transform: translateY(-3px);
   }
   
   /* .modal-buttons typically used for two side-by-side buttons in the modal */
   .modal-buttons {
     display: flex;
     justify-content: center;
     gap: 1rem;
     margin-top: 1.5rem;
   }
   .modal-buttons .btn {
     max-width: 100px;
   }
   
   /* =======================
      Landing Page Specific (landing.html)
      ======================= */
   
   /* The #introVideoWrapper & #introVideo & .hidden from landing.html */
   #introVideoWrapper {
     position: fixed;
     top: 0;
     left: 0;
     width: 100%;
     height: 100%;
     z-index: 50;
     display: flex;
     align-items: center;
     justify-content: center;
     background: none; /* no background color behind the video */
   }
   
   #introVideo {
     width: 100%;
     height: auto;
     object-fit: cover; /* maintain aspect ratio + fill space */
   }
   
   /* Hide elements (e.g., #mainContent during video) */
   .hidden {
     display: none;
   }
   
   /* =======================
      About Page Specific (about.html)
      ======================= */
   .credits-grid {
     display: grid;
     grid-template-columns: 1fr 1fr;
     gap: 1rem;
     margin-bottom: 2rem;
   }
   
   /* =======================
      Dashboard Page Specific (dashboard.html)
      ======================= */
   .dashboard-buttons {
     display: grid;
     grid-template-columns: repeat(2, 1fr);
     gap: 1rem;
     margin-top: 1rem;
   }
   
   /* =======================
      Splitter Page Specific (splitter.html)
      ======================= */
   
   /* Two-column layout for the form */
   .form-grid {
     display: flex;
     flex-wrap: wrap;
     gap: 1rem;
   }
   .form-column {
     flex: 1 1 45%;
     display: flex;
     flex-direction: column;
     gap: 1rem;
   }
   
   /* Form group styling */
   .form-group {
     display: flex;
     flex-direction: column;
     align-items: center;
   }
   .form-group label {
     margin-bottom: 0.5rem;
     font-weight: bold;
     font-size: 0.95rem;
   }
   
   /* Additional select styling used for models/presets if needed */
   .mp3-model-select {
     width: 100%;
     padding: 0.6rem;
     border: none;
     border-radius: 6px;
     background-color: #e9ecef;
     color: #333;
   }
   
   /* Buttons container inside the form */
   .buttons-container {
     display: flex;
     justify-content: space-between;
     gap: 0.5rem;
     margin-top: 1.5rem;
   }
   .buttons-container button {
     flex: 1;
     max-width: 33%;
   }
   
   /* Collapsible log section */
   .log-section {
     margin-top: 1.5rem;
   }
   .log-header {
     display: flex;
     justify-content: space-between;
     align-items: center;
     cursor: pointer;
     background-color: #006494;
     padding: 0.5rem 1rem;
     border-radius: 6px;
   }
   .log-header h2 {
     margin: 0;
     font-size: 1.2rem;
   }
   .log-toggle {
     background: none;
     border: none;
     color: white;
     font-size: 1rem;
     cursor: pointer;
   }
   
   /* The logs content container (collapsed by default) */
   .logs {
     max-height: 0;
     overflow: hidden;
     transition: max-height 0.3s ease, padding 0.3s ease;
     background-color: #ffffff;
     color: #333;
     padding: 0 1rem; /* Start collapsed with zero side padding if you prefer */
     border-radius: 6px;
     margin-top: 0.5rem;
   }
   .logs.open {
     max-height: 300px; /* or another limit */
     padding: 1rem; /* show padding once expanded */
   }
   .logs p {
     margin: 0.5rem 0;
     font-size: 0.95rem;
     color: #333;
   }
   
   /* =======================
      Update Page Specific (update.html)
      ======================= */
   .buttons {
     display: grid;
     grid-template-columns: 1fr 1fr;
     gap: 1rem;
     margin-top: 1rem;
   }
   
   /* 
  A reusable page title style 
  (similar to text-4xl font-bold mb-4 in Tailwind)
*/
    .page-title {
      font-size: 2.25rem;   /* ~ text-4xl */
      line-height: 2.5rem; 
      font-weight: 700;     /* bold */
      margin-bottom: 1rem;  /* like mb-4 */
    }
```

### src/frontend/splitter.css

``` 
/* ============================================================
   Step Container
============================================================ */
.step {
    display: none; /* hidden by default */
    position: relative; /* for absolutely positioned child (the exit pill) */
    padding-bottom: 50px; /* enough space at the bottom */
    min-height: 300px; /* ensures there's a decent vertical area */
}

/* ============================================================
   Drop Area for Step 2 (selecting MP3)
============================================================ */
.drop-area {
    border: 2px dashed #00ffd8;
    border-radius: 8px;
    padding: 2rem;
    cursor: pointer;
    text-align: center;
    transition: background-color 0.2s ease;
}
.drop-area:hover {
    background-color: rgba(0, 255, 216, 0.1);
}

/* ============================================================
   Buttons for MP3 preset (Step 4)
============================================================ */
.preset-button {
    background-color: #003554;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 0.375rem;
    margin-bottom: 1rem;
    cursor: pointer;
    transition: transform 0.3s ease, background-color 0.3s ease;
    display: inline-block;
    border: none;
    font-size: 1.1rem;
}
.preset-button:hover {
    background-color: #002940;
    transform: translateY(-4px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}
.preset-button.active {
    background-color: #006494 !important;
}

/* ============================================================
   Disabled Buttons
============================================================ */
.btn-disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* ============================================================
   Modals (Warning, etc.)
============================================================ */
.modal {
    display: none; /* hidden by default */
    position: fixed;
    z-index: 999;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.6);
    align-items: center;
    justify-content: center;
}
.modal-content {
    background-color: #003554;
    margin: auto;
    padding: 1.5rem;
    border-radius: 8px;
    width: 80%;
    max-width: 400px;
    color: #fff;
    text-align: center;
}
.close-btn {
    background-color: #8B0000;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
}
.close-btn:hover {
    background-color: #690000;
    transform: translateY(-3px);
}

/* ============================================================
   Discrete Exit Pill (Steps 1-5)
============================================================ */
.exit-pill {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: inline-block;
    padding: 0.35rem 0.75rem;
    border-radius: 9999px;
    background-color: rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.85rem;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
    text-decoration: none;
    opacity: 0.8;
}
.exit-pill:hover {
    background-color: rgba(255, 255, 255, 0.25);
    transform: translate(-50%, -2px);
}

/*
   The real-time console area is #demucsConsole
   The single last line from the tail is #latestLineDiv
   And the single "filtered" line is #filteredLine
*/
.latest-log-line {
    margin-top: 1rem;
    color: #0ff;
    font-weight: bold;
}

#filteredLine {
    margin-top: 1rem;
    color: #ffa;
    font-weight: bold;
    font-size: 0.95rem;
}
```

### src/frontend/dashboard.html

``` 
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>CamStem Dashboard</title>
  <!-- Include Tailwind and your custom index.css -->
  <link rel="stylesheet" href="tailwind-output.css">
  <link rel="stylesheet" href="index.css">
  <style>
    /* Overall page styling */
    body {
      background: linear-gradient(135deg, #006494, #051923);
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      color: white;
    }
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem;
    }
    .header {
      text-align: center;
      font-size: 3rem; /* increased from previous iterations */
      margin-bottom: 1.5rem;
    }
    /* Grid container: 4 columns x 3 rows */
    /* We define grid-template-areas so that:  
       - Row1: cells 1-2 (splitter), cells 3-4 empty  
       - Row2: cells 5-6 (splitter) and cells 7-8 (settings)  
       - Row3: cells 9-10 (splitter) and cells 11-12 (settings)  */
    .grid-container {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: repeat(3, 1fr);
      gap: 1rem;
      grid-template-areas:
        "splitter splitter empty empty"
        "splitter splitter settings settings"
        "splitter splitter settings settings";
      height: 58vh; /* 20% larger than our previous 48vh */
    }
    /* Base styling for a module */
    .module {
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
      padding: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    /* Splitter module: occupies grid-area "splitter" (cells 1,2,5,6,9,10) */
    .splitter {
      grid-area: splitter;
      background-color: rgba(0, 53, 84, 0.8);
      /* Enforce an aspect ratio: since the module spans 2 columns and 3 rows, we set it to about 1.5:3 */
      aspect-ratio: 1.5 / 3;
      width: 100%;
    }
    .splitter h2 {
      margin-bottom: 1rem;
      font-size: 1.8rem;
    }
    .splitter button {
      margin: 0.3rem 0;
      width: 100%;
      padding: 0.6rem;
      font-size: 1.1rem;
    }
    /* Settings module: occupies grid-area "settings" (cells 7,8,11,12) */
    .settings {
      grid-area: settings;
      background-color: rgba(5, 130, 202, 0.8);
    }
    .settings h2 {
      margin-bottom: 1rem;
      font-size: 1.8rem;
    }
    .settings button {
      margin: 0.3rem 0;
      width: 100%;
      padding: 0.6rem;
      font-size: 1.1rem;
    }
    /* The empty area in grid-area "empty" (cells 3,4 of row1) */
    .empty {
      grid-area: empty;
      display: none;
    }
  </style>
</head>
<body>
  <div class="dashboard-container">
    <h1 class="header">Welcome to CamStem</h1>
    <div class="grid-container">
      <!-- Splitter Module (covers cells 1,2,5,6,9,10) -->
      <div class="module splitter">
        <h2>Stem Splitting</h2>
        <button id="default4StemBtn" class="actionButton">Default 4 Stem</button>
        <button id="hq4StemBtn" class="actionButton">High Quality 4 Stem</button>
        <button id="default6StemBtn" class="actionButton">Default 6 Stem</button>
        <button id="vocalExtractorBtn" class="actionButton">Vocal Extractor</button>
        <button id="videoSplitterBtn" class="actionButton">Video Splitter</button>
      </div>
      <!-- Empty cells for grid-area "empty" (Row1, columns 3-4) -->
      <div class="empty"></div>
      <div class="empty"></div>
      <div class="empty"></div>
      <!-- Settings Module (covers cells 7,8,11,12) -->
      <div class="module settings">
        <h2>Settings</h2>
        <button id="settingsBtn" class="actionButton">Settings</button>
        <button id="aboutBtn" class="actionButton">About</button>
        <button id="premiereSetupBtn" class="actionButton">Premiere Setup</button>
      </div>
    </div>
  </div>
  <script>
    // Splitter module button event listeners:
    document.getElementById('default4StemBtn').addEventListener('click', () => {
      localStorage.setItem('selectedStemOption', 'default4');
      window.location.href = 'splitter.html';
    });
    document.getElementById('hq4StemBtn').addEventListener('click', () => {
      localStorage.setItem('selectedStemOption', 'hq4');
      window.location.href = 'splitter.html';
    });
    document.getElementById('default6StemBtn').addEventListener('click', () => {
      localStorage.setItem('selectedStemOption', 'default6');
      window.location.href = 'splitter.html';
    });
    document.getElementById('vocalExtractorBtn').addEventListener('click', () => {
      alert('Vocal Extractor coming soon!');
    });
    document.getElementById('videoSplitterBtn').addEventListener('click', () => {
      alert('Video Splitter coming soon!');
    });
    // Settings module button event listeners:
    document.getElementById('settingsBtn').addEventListener('click', () => {
      window.location.href = 'settings.html';
    });
    document.getElementById('aboutBtn').addEventListener('click', () => {
      window.location.href = 'about.html';
    });
    document.getElementById('premiereSetupBtn').addEventListener('click', () => {
      window.location.href = 'premiere.html';
    });
  </script>
</body>
</html>
```

### src/frontend/splitter.html

``` 
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>CamStem - Stem Splitting</title>
  <!-- Include Tailwind + Custom Index CSS -->
  <link rel="stylesheet" href="tailwind-output.css">
  <link rel="stylesheet" href="index.css">
  <!-- Link the newly created splitter.css -->
  <link rel="stylesheet" href="splitter.css">
  <style>
    .text-green {
      color: #28a745; /* success color */
    }
    .text-red {
      color: #dc3545; /* error color */
    }
    .text-orange {
      color: #ffa500; /* queued or waiting color */
    }
    .text-white {
      color: white;
    }
  </style>
</head>
<body>
  <!-- Container with max-width -->
  <div class="container" style="max-width: 480px;">

    <!-- =========================== STEP 1 =========================== -->
    <div id="step1" class="step" style="display: block;">
      <h1 class="page-title">Select which type of stems you want</h1>
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.75rem;">
        <button class="actionButton" id="default4StemBtn">Default 4 Stem</button>
        <button class="actionButton" id="hq4StemBtn">High Quality 4 Stem</button>
        <button class="actionButton" id="exp6StemBtn">Experimental 6 Stem</button>
      </div>
      <a href="dashboard.html" class="exit-pill">Exit</a>
    </div>

    <!-- =========================== STEP 2 =========================== -->
    <div id="step2" class="step">
      <h1 class="page-title">Select Your Audio File</h1>
      <p style="margin-bottom: 1rem;">
        Drag and Drop your <strong>.mp3</strong> file or click to browse.
      </p>
      <div id="dropZone" class="drop-area">
        <p>Drag & drop MP3 here</p>
        <p>or click to browse</p>
      </div>
      <input type="file" id="mp3FileInput" accept=".mp3" style="display: none;" />

      <button id="step2ContinueBtn" class="btn btn-primary btn-disabled" style="margin-top: 1.5rem;">
        Next
      </button>
      <a href="dashboard.html" class="exit-pill">Exit</a>
    </div>

    <!-- =========================== STEP 3 =========================== -->
    <div id="step3" class="step">
      <h1 class="page-title">Select the output directory</h1>
      <p style="margin-bottom: 1rem;">
        Where should we place your separated stems?
      </p>
      <button id="browseOutputBtn" class="btn btn-secondary" style="margin-bottom: 1.5rem;">
        Browse for Folder
      </button>
      <button id="step3ContinueBtn" class="btn btn-primary btn-disabled">Next</button>
      <a href="dashboard.html" class="exit-pill">Exit</a>
    </div>

    <!-- =========================== STEP 4 =========================== -->
    <div id="step4" class="step">
      <h1 class="page-title">Select MP3 File Quality</h1>
      <p style="margin-bottom: 1rem;"><em>Lower Number = Higher Quality</em></p>
      <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5rem;">
        <button class="preset-button" data-newpreset="2">2</button>
        <button class="preset-button" data-newpreset="3">3</button>
        <button class="preset-button" data-newpreset="4">4</button>
        <button class="preset-button" data-newpreset="5">5</button>
        <button class="preset-button" data-newpreset="6">6</button>
        <button class="preset-button" data-newpreset="7">7</button>
      </div>
      <button id="goSplitBtn" class="btn btn-primary btn-disabled" style="margin-top: 1.5rem;">
        Split Stems
      </button>
      <a href="dashboard.html" class="exit-pill">Exit</a>
    </div>

    <!-- =========================== STEP 5: Splitting =========================== -->
    <div id="step5" class="step" style="text-align:center;">
      <h1 class="page-title">Splitting Stems</h1>
      <p style="margin-bottom: 1.5rem;">
        Please be patient while your stems are split. You can minimize CamStem, and we'll notify you when done.
      </p>

      <!-- Buttons in Step 5 -->
      <button id="newSplitBtn" class="btn" style="background-color: #003554; color: white; margin-bottom: 1rem;">
        Split Another Song
      </button>
      <button id="viewLogFileBtn" class="btn btn-secondary" style="margin-bottom: 1rem;">
        Open Log File
      </button>

      <!-- For normal models, we show filteredLine. For htdemucs_ft, we only show it on final error or success. -->
      <div id="filteredLine" class="text-white"></div>

      <!-- For fine-tuned model: 4 lines, each either "Queued" or a percentage, turning green at 100% -->
      <div id="fineTunedStages" style="display:none; margin-top:1rem;">
        <!-- We'll use this label for final messages such as "Creating Files..." or "Splitting Process Completed" -->
        <p id="refinementLabel" class="text-white" style="font-weight:bold; margin-bottom:0.5rem;"></p>
        <div>
          <strong class="text-white">Refinement #1:</strong>
          <span id="stage1progress" class="text-white">Starting…</span>
        </div>
        <div>
          <strong class="text-white">Refinement #2:</strong>
          <span id="stage2progress" class="text-orange">Queued</span>
        </div>
        <div>
          <strong class="text-white">Refinement #3:</strong>
          <span id="stage3progress" class="text-orange">Queued</span>
        </div>
        <div>
          <strong class="text-white">Refinement #4:</strong>
          <span id="stage4progress" class="text-orange">Queued</span>
        </div>
      </div>

      <a href="dashboard.html" class="exit-pill">Exit</a>
    </div>
  </div>

  <!-- Hidden console for logs, outside the container -->
  <div
    id="demucsConsole"
    style="
      position: absolute;
      transform: scale(0.01);
      opacity: 0;
      pointer-events: none;
    "
  ></div>

  <!-- Hidden last line div as well, so it never appears in UI -->
  <div
    id="latestLineDiv"
    style="
      position: absolute;
      transform: scale(0.01);
      opacity: 0;
      pointer-events: none;
    "
  ></div>

  <!-- =========================== Warning Modal =========================== -->
  <div class="modal" id="warningModal">
    <div class="modal-content">
      <h2>Warning</h2>
      <p id="warningMsg"></p>
      <button id="warningCloseBtn" class="close-btn">Close</button>
    </div>
  </div>

  <script>
    /**************************************************************************************
     * Function: showDesktopNotification
     **************************************************************************************/
    function showDesktopNotification(title, body) {
      if (!("Notification" in window)) {
        console.log("This browser does not support desktop notification.");
        return;
      }
      if (Notification.permission === "granted") {
        new Notification(title, { body });
      }
      else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((perm) => {
          if (perm === "granted") {
            new Notification(title, { body });
          }
        });
      }
    }

    /**************************************************************************************
     * GLOBAL / STEP Variables
     **************************************************************************************/
    let chosenModel = '';
    let chosenFilePath = '';
    let chosenOutputPath = '';
    let chosenPreset = '';
    let finalStemsPath = '';

    // Step references
    const stepOne = document.getElementById('step1');
    const stepTwo = document.getElementById('step2');
    const stepThree = document.getElementById('step3');
    const stepFour = document.getElementById('step4');
    const stepFive = document.getElementById('step5');

    // Step 2
    const dropZone = document.getElementById('dropZone');
    const mp3FileInput = document.getElementById('mp3FileInput');
    const step2ContinueBtn = document.getElementById('step2ContinueBtn');

    // Step 3
    const browseOutputBtn = document.getElementById('browseOutputBtn');
    const step3ContinueBtn = document.getElementById('step3ContinueBtn');

    // Step 4
    const presetButtons = document.querySelectorAll('.preset-button');
    const goSplitBtn = document.getElementById('goSplitBtn');

    // Step 5
    const newSplitBtn = document.getElementById('newSplitBtn');
    const viewLogFileBtn = document.getElementById('viewLogFileBtn');
    const demucsConsole = document.getElementById('demucsConsole');
    const latestLineDiv = document.getElementById('latestLineDiv');
    const filteredLineDiv = document.getElementById('filteredLine');

    // Fine-Tuned references
    const fineTunedStages = document.getElementById('fineTunedStages');
    const refinementLabel = document.getElementById('refinementLabel');
    const stage1progress = document.getElementById('stage1progress');
    const stage2progress = document.getElementById('stage2progress');
    const stage3progress = document.getElementById('stage3progress');
    const stage4progress = document.getElementById('stage4progress');

    // Warnings
    const warningModal = document.getElementById('warningModal');
    const warningMsg = document.getElementById('warningMsg');
    const warningCloseBtn = document.getElementById('warningCloseBtn');

    // We'll accumulate log data here
    let demucsOutputBuffer = '';

    /**************************************************************************************
     * Multi-Stage Tracking (for htdemucs_ft)
     **************************************************************************************/
    let currentStage = 1;           // 1..4
    let stageComplete = [false, false, false, false];
    let allStagesDone = false;

    /**************************************************************************************
     * Navigation
     **************************************************************************************/
    function switchToStep(num) {
      stepOne.style.display = 'none';
      stepTwo.style.display = 'none';
      stepThree.style.display = 'none';
      stepFour.style.display = 'none';
      stepFive.style.display = 'none';

      if (num === 1) stepOne.style.display = 'block';
      if (num === 2) stepTwo.style.display = 'block';
      if (num === 3) stepThree.style.display = 'block';
      if (num === 4) stepFour.style.display = 'block';
      if (num === 5) stepFive.style.display = 'block';
    }

    function showWarning(msg) {
      warningMsg.textContent = msg;
      warningModal.style.display = 'flex';
    }
    warningCloseBtn.addEventListener('click', () => {
      warningModal.style.display = 'none';
    });
    window.addEventListener('click', (e) => {
      if (e.target === warningModal) {
        warningModal.style.display = 'none';
      }
    });

    /**************************************************************************************
     * STEP 1: Model selection
     **************************************************************************************/
    document.getElementById('default4StemBtn').addEventListener('click', () => {
      chosenModel = 'htdemucs';
      switchToStep(2);
    });
    document.getElementById('hq4StemBtn').addEventListener('click', () => {
      chosenModel = 'htdemucs_ft'; // Fine-tuned
      switchToStep(2);
    });
    document.getElementById('exp6StemBtn').addEventListener('click', () => {
      chosenModel = 'htdemucs_6s';
      switchToStep(2);
    });

    /**************************************************************************************
     * STEP 2: MP3
     **************************************************************************************/
    dropZone.addEventListener('click', () => {
      mp3FileInput.click();
    });
    dropZone.addEventListener('dragenter', (evt) => evt.preventDefault());
    dropZone.addEventListener('dragover', (evt) => {
      evt.preventDefault();
      dropZone.style.backgroundColor = 'rgba(0,255,216,0.2)';
    });
    dropZone.addEventListener('dragleave', () => {
      dropZone.style.backgroundColor = 'transparent';
    });
    dropZone.addEventListener('drop', (evt) => {
      evt.preventDefault();
      dropZone.style.backgroundColor = 'transparent';
      if (evt.dataTransfer.files.length > 0) {
        const file = evt.dataTransfer.files[0];
        if (file.type !== 'audio/mpeg') {
          alert('Please drop only MP3 files.');
          return;
        }
        chosenFilePath = file.path;
        step2ContinueBtn.classList.remove('btn-disabled');
      }
    });
    mp3FileInput.addEventListener('change', (evt) => {
      const f = evt.target.files[0];
      if (!f) return;
      if (f.type !== 'audio/mpeg') {
        alert('Please select an MP3 file.');
        mp3FileInput.value = '';
        return;
      }
      chosenFilePath = f.path;
      step2ContinueBtn.classList.remove('btn-disabled');
    });
    step2ContinueBtn.addEventListener('click', () => {
      if (!chosenFilePath) {
        showWarning('Please pick an MP3 file first!');
        return;
      }
      switchToStep(3);
    });

    /**************************************************************************************
     * STEP 3: Output Directory
     **************************************************************************************/
    // Reverted logic to original style
    browseOutputBtn.addEventListener('click', async () => {
      try {
        const selectedFolder = await window.api.selectPath('directory');
        if (selectedFolder) {
          chosenOutputPath = selectedFolder;
          browseOutputBtn.textContent = 'Output Selected ✓';
          step3ContinueBtn.classList.remove('btn-disabled');
        }
      } catch (err) {
        console.error('Error selecting folder:', err);
      }
    });

    step3ContinueBtn.addEventListener('click', () => {
      if (!chosenOutputPath) {
        showWarning('Please select an output directory first.');
        return;
      }
      switchToStep(4);
    });

    /**************************************************************************************
     * STEP 4: MP3 Preset
     **************************************************************************************/
    presetButtons.forEach((b) => {
      b.addEventListener('click', () => {
        // Clear active states
        presetButtons.forEach((x) => x.classList.remove('active'));
        b.classList.add('active');
        chosenPreset = b.getAttribute('data-newpreset');
        goSplitBtn.classList.remove('btn-disabled');
      });
    });
    goSplitBtn.addEventListener('click', () => {
      if (!chosenPreset) {
        showWarning('Please select a preset first!');
        return;
      }
      switchToStep(5);
      runDemucsNow();
    });

    /**************************************************************************************
     * STEP 5: Splitting
     **************************************************************************************/
    newSplitBtn.addEventListener('click', () => {
      window.location.reload();
    });
    viewLogFileBtn.addEventListener('click', () => {
      window.api.openLogFile();
    });

    function runDemucsNow() {
      demucsOutputBuffer = '';
      demucsConsole.innerHTML = '';

      if (chosenModel === 'htdemucs_ft') {
        // Show multi-stage, no "Split Process Initializing"
        fineTunedStages.style.display = 'block';
        filteredLineDiv.style.display = 'none';

        // Reset stages
        currentStage = 1;
        allStagesDone = false;
        stageComplete = [false, false, false, false];

        refinementLabel.textContent = '';
        refinementLabel.className = 'text-white';

        stage1progress.textContent = 'Starting…';
        stage1progress.className = 'text-white';
        stage2progress.textContent = 'Queued';
        stage2progress.className = 'text-orange';
        stage3progress.textContent = 'Queued';
        stage3progress.className = 'text-orange';
        stage4progress.textContent = 'Queued';
        stage4progress.className = 'text-orange';

      } else {
        // Normal approach
        fineTunedStages.style.display = 'none';
        filteredLineDiv.style.display = 'block';
        filteredLineDiv.className = 'text-white';
        filteredLineDiv.textContent = 'Split Process Initializing';
      }

      window.api.runDemucs(chosenFilePath, chosenOutputPath, chosenModel, chosenPreset);
      window.api.startTailLog();
    }

    function setStagePercent(stageIndex, percent) {
      const elements = [stage1progress, stage2progress, stage3progress, stage4progress];
      const el = elements[stageIndex];
      if (percent === 100) {
        el.textContent = '100%';
        el.className = 'text-green';
      } else {
        el.textContent = `${percent}%`;
        el.className = 'text-white';
      }
    }

    function updateFineTunedProgress(percentVal) {
      if (currentStage > 4) return;

      if (percentVal === 0 && stageComplete[currentStage - 1]) {
        currentStage++;
        if (currentStage > 4) return;
      }

      if (!stageComplete[currentStage - 1]) {
        setStagePercent(currentStage - 1, percentVal);
      }

      if (percentVal === 100 && !stageComplete[currentStage - 1]) {
        stageComplete[currentStage - 1] = true;
        if (currentStage === 4) {
          refinementLabel.textContent = 'Creating Files - This May Take a Moment';
        }
      }
    }

    function simpleFilterLine(line) {
      if (line.includes('100%')) {
        return 'Creating Files - This May Take a Moment';
      }
      const trimmed = line.trim();
      if (!trimmed) return null;
      const match = trimmed.match(/^(\d{1,2})/);
      if (match) {
        return `Splitting - (${match[1]})%`;
      }
      return null;
    }

    function parseDemucsOutput() {
      const lines = demucsOutputBuffer.split(/\r?\n/);
      demucsOutputBuffer = '';

      lines.forEach((line) => {
        if (!line) return;

        if (chosenModel === 'htdemucs_ft') {
          const progressMatch = line.match(/^\s*(\d{1,3})%\|/);
          if (progressMatch) {
            const pctVal = parseInt(progressMatch[1], 10);
            if (pctVal >= 0 && pctVal <= 100) {
              updateFineTunedProgress(pctVal);
            }
          }
          if (line.includes('Separated tracks will be stored in')) {
            const splitted = line.split('Separated tracks will be stored in');
            if (splitted[1]) {
              finalStemsPath = splitted[1].trim();
            }
          }
        } else {
          const filterResult = simpleFilterLine(line);
          if (filterResult) {
            filteredLineDiv.classList.remove('text-green', 'text-red');
            filteredLineDiv.classList.add('text-white');
            filteredLineDiv.textContent = filterResult;
          }
          if (line.includes('Separated tracks will be stored in')) {
            const splitted = line.split('Separated tracks will be stored in');
            if (splitted[1]) {
              finalStemsPath = splitted[1].trim();
            }
          }
        }
      });
    }

    // On each chunk
    window.api.receive('demucs-log', (chunk) => {
      demucsOutputBuffer += chunk;
      parseDemucsOutput();
    });

    // success
    window.api.receive('demucs-success', (msg) => {
      parseDemucsOutput();

      if (chosenModel === 'htdemucs_ft') {
        // If stage4 isn't done, force it to 100
        if (!stageComplete[3]) {
          stageComplete[3] = true;
          setStagePercent(3, 100);
        }
        refinementLabel.textContent = 'Splitting Process Completed';
        refinementLabel.classList.remove('text-white', 'text-red');
        refinementLabel.classList.add('text-green');
      } else {
        filteredLineDiv.classList.remove('text-white', 'text-red');
        filteredLineDiv.classList.add('text-green');
        filteredLineDiv.textContent = 'Splitting Process Completed';
      }

      // Desktop notification on success
      showDesktopNotification("CamStem", "Your stems have finished splitting!");
    });

    // error
    window.api.receive('demucs-error', (errMsg) => {
      parseDemucsOutput();
      if (chosenModel === 'htdemucs_ft') {
        refinementLabel.classList.remove('text-white', 'text-green');
        refinementLabel.classList.add('text-red');
        refinementLabel.textContent = 'Refinement encountered an ERROR. Check logs.';

        stage4progress.classList.remove('text-white', 'text-orange', 'text-green');
        stage4progress.classList.add('text-red');
        stage4progress.textContent = `ERROR: ${errMsg}`;
      } else {
        filteredLineDiv.textContent = `ERROR: ${errMsg}`;
        filteredLineDiv.classList.remove('text-white', 'text-green');
        filteredLineDiv.classList.add('text-red');
      }
    });

    // Tailing => last line
    window.api.onLogFileLine((newLine) => {
      latestLineDiv.textContent = newLine;
    });
  </script>
</body>
</html>
```

### src/frontend/settings.html

``` 
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>CamStem - Settings</title>
  <!-- Include Tailwind + Custom Index CSS -->
  <link rel="stylesheet" href="tailwind-output.css">
  <link rel="stylesheet" href="index.css">
</head>
<body>
  <div class="container" style="max-width: 480px;">
    <!-- Title -->
    <h1 class="page-title">Settings</h1>

    <!-- 2x1 Grid for the first two buttons -->
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1rem;">
      <button 
        id="removeKeysButton" 
        class="actionButton danger-button"
      >
        Remove All Saved Keys
      </button>
      <button
        class="actionButton"
        onclick="window.location.href='update.html'"
      >
        Go to Update Page
      </button>
    </div>

    <!-- "Back to Menu" alone at the bottom -->
    <button
      class="actionButton"
      onclick="window.location.href='dashboard.html'"
      style="width: 100%;"
    >
      Back to Menu
    </button>
  </div>

  <script>
    const removeKeysButton = document.getElementById('removeKeysButton');

    removeKeysButton.addEventListener('click', async () => {
      try {
        await window.api.removeSavedKey();
        alert('All saved keys have been removed. You will be redirected to the login page.');
        window.location.href = 'auth.html';
      } catch (error) {
        alert('An error occurred while removing saved keys. Check console for details.');
        console.error('Error removing saved keys:', error);
      }
    });
  </script>
</body>
</html>
```

### src/frontend/landing.html

``` 
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CamStem</title>
  <!-- Include Tailwind + Custom Index CSS -->
  <link rel="stylesheet" href="tailwind-output.css">
  <link rel="stylesheet" href="index.css">
</head>
<body>
  <!-- Video Wrapper -->
  <div id="introVideoWrapper">
    <video id="introVideo" autoplay muted playsinline>
      <source src="../assets/output-vp9.webm" type="video/webm">
      Your browser does not support the video tag.
    </video>
  </div>

  <!-- Main Landing Content (placed in a .container) -->
  <!-- We keep the 'hidden' class for the first 4s while the intro video plays -->
  <div id="mainContent" class="container hidden" style="max-width: 480px;">
    <h1 class="text-4xl font-bold mb-4">CamStem</h1>
    <p class="text-lg font-medium mb-6">Your Auditory Journey Awaits</p>

    <!-- If you like the bigger 'actionButton' style, keep it -->
    <!-- Otherwise, switch to <button class="btn btn-primary"> or similar -->
    <button 
      id="signInButton" 
      class="actionButton focus:ring-2 focus:ring-blue-400"
    >
      Sign In
    </button>
    <button 
      id="signUpButton" 
      class="actionButton focus:ring-2 focus:ring-blue-400"
    >
      Sign Up
    </button>
  </div>

  <!-- Modal Popup for Sign Up -->
  <div id="signUpModal" class="modal">
    <div class="modal-content">
      <h2>Sign Up Information</h2>
      <p>In order to sign up, please visit our website:</p>
      <p>camstem.org/signup</p>
      <div class="modal-buttons">
        <button id="closeModalButton" class="btn btn-primary">OK</button>
      </div>
    </div>
  </div>

  <script>
    const introVideoWrapper = document.getElementById('introVideoWrapper');
    const mainContent = document.getElementById('mainContent');
    const signUpModal = document.getElementById('signUpModal');
    const closeModalButton = document.getElementById('closeModalButton');
    const signUpButton = document.getElementById('signUpButton');

    // We'll store the user's auth validity here. Default to false.
    window.authOk = false;

    // After 4 seconds, hide the video and show main content
    setTimeout(() => {
      introVideoWrapper.style.pointerEvents = 'none';
      mainContent.classList.remove('hidden');
    }, 4000);

    // Background check on page load for any stored key
    (async () => {
      try {
        const savedKey = await window.api.getSavedKey();
        if (savedKey) {
          const activateResult = await window.api.activateSoftwareKey(savedKey);
          if (activateResult.success) {
            const subscriptionResult = await window.api.checkSubscriptionStatus();
            if (subscriptionResult.active) {
              window.authOk = true;
            }
          }
        }
      } catch (err) {
        console.error('Error while checking saved key in background:', err);
        window.authOk = false;
      }
    })();

    // Sign In button: if authOk, go directly to dashboard; otherwise, go to normal auth
    document.getElementById('signInButton').addEventListener('click', () => {
      if (window.authOk) {
        window.location.href = 'dashboard.html';
      } else {
        window.location.href = 'auth.html';
      }
    });

    // Sign Up button -> open modal
    signUpButton.addEventListener('click', () => {
      signUpModal.style.display = 'flex';
    });
    closeModalButton.addEventListener('click', () => {
      signUpModal.style.display = 'none';
    });
    // Close the modal when clicking outside it
    window.addEventListener('click', (event) => {
      if (event.target === signUpModal) {
        signUpModal.style.display = 'none';
      }
    });
  </script>
</body>
</html>
```

### src/backend/preload.js

``` 
// src/backend/preload.js

const { contextBridge, ipcRenderer, shell } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // 1) Run Demucs
  runDemucs: (inputPath, outputPath, model, mp3Preset) => {
    ipcRenderer.send('run-demucs', { inputPath, outputPath, model, mp3Preset });
  },

  // 2) Generic 'receive' for demucs-log, demucs-success, etc.
  receive: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },

  // 3) Choose path
  selectPath: async (type) => {
    const path = await ipcRenderer.invoke('select-path', type);
    return path;
  },

  // 4) Open log file in Explorer/Finder
  openLogFile: () => {
    ipcRenderer.invoke('open-log-file');
  },

  // 5) External link
  openExternal: (url) => {
    shell.openExternal(url);
  },

  // 6) Key management
  saveSoftwareKey: async (key) => ipcRenderer.invoke('save-software-key', key),
  getSavedKey: async () => ipcRenderer.invoke('get-saved-key'),
  removeSavedKey: async () => ipcRenderer.invoke('remove-saved-key'),
  checkValidKey: async () => ipcRenderer.invoke('check-valid-key'),
  activateSoftwareKey: async (encryptedKey) => ipcRenderer.invoke('activate-software-key', encryptedKey),
  checkSubscriptionStatus: async () => ipcRenderer.invoke('check-subscription-status'),

  // 7) Auto-updater methods
  getAppVersion: async () => ipcRenderer.invoke('get-app-version'),
  checkForUpdates: async () => ipcRenderer.invoke('check-for-updates'),
  installUpdateNow: async () => ipcRenderer.invoke('install-update-now'),

  // 8) openFolder
  openFolder: (folderPath) => {
    shell.openPath(folderPath);
  },

  // 9) Start tailing the demucs-log file
  startTailLog: () => {
    ipcRenderer.send('start-tail-log');
  },

  // 10) On every new appended line from demucs-log, callback
  onLogFileLine: (callback) => {
    ipcRenderer.on('demucs-logfile-line', (event, line) => {
      callback(line);
    });
  },

  // 11) Premiere extension installation (existing from previous steps)
  installPremiereExtension: async (destinationPath) => {
    const result = await ipcRenderer.invoke('installPremiereExtension', destinationPath);
    return result;
  },

  // 12) We want to open an arbitrary folder from front-end
  openAnyFolder: async (folderPath) => {
    await ipcRenderer.invoke('openAnyFolder', folderPath);
  },

  // 13) Get the default OS extension folder
  getDefaultExtensionsFolder: async () => {
    const defPath = await ipcRenderer.invoke('getDefaultExtensionsFolder');
    return defPath;
  },

  // 14) NEW: Get demucs exec + model folder path
  getDemucsPaths: async () => {
    // main.js returns { demucsExec, models }
    return await ipcRenderer.invoke('getDemucsPaths');
  },
});
```

### src/backend/main.js

``` 
// src/backend/main.js

// 1) Load environment variables from .env
require('dotenv').config();

const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
// We spawn a process for demucs
const { spawn } = require('child_process');
const fs = require('fs');
const keytar = require('keytar');
const { webcrypto } = require('crypto');
const os = require('os');
const stripe = require('stripe')(
  process.env.STRIPE_SECRET_KEY || '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'
);

// 2) Import autoUpdater from electron-updater
const { autoUpdater } = require('electron-updater');

let isDev = false;

(async () => {
  const isDevModule = await import('electron-is-dev');
  isDev = isDevModule.default;
})();

let mainWindow;

// Hardcoded encryption key (if needed)
const HARD_CODED_KEY = "DA3K9Y5kdGQ217dhKehCT4Jip0ehJ7rY";

// Set up the log file path
const logFilePath = path.join(app.getPath('userData'), 'demucs-log.txt');

// Utility: Append logs to file + console
function logToFile(message) {
  const timestamp = new Date().toISOString();
  const fullMsg = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(logFilePath, fullMsg);
  console.log(fullMsg.trim());
}

// ---------- AUTO-UPDATER SETUP -----------
function setupAutoUpdaterLogs() {
  // Let the user decide when to install after download
  autoUpdater.autoInstallOnAppQuit = false;

  autoUpdater.on('checking-for-update', () => {
    logToFile('autoUpdater: Checking for updates...');
    if (mainWindow) {
      mainWindow.webContents.send('autoUpdater-event', {
        event: 'checking-for-update',
      });
    }
  });

  autoUpdater.on('update-available', (info) => {
    logToFile(`autoUpdater: Update available. Version: ${info.version}`);
    if (mainWindow) {
      mainWindow.webContents.send('autoUpdater-event', {
        event: 'update-available',
        version: info.version,
      });
    }
  });

  autoUpdater.on('update-not-available', () => {
    logToFile('autoUpdater: No updates available.');
    if (mainWindow) {
      mainWindow.webContents.send('autoUpdater-event', {
        event: 'update-not-available',
      });
    }
  });

  autoUpdater.on('error', (err) => {
    logToFile(`autoUpdater: Error - ${err.message}`);
    if (mainWindow) {
      mainWindow.webContents.send('autoUpdater-event', {
        event: 'error',
        message: err.message,
      });
    }
  });

  autoUpdater.on('download-progress', (progress) => {
    const msg = `autoUpdater: Download speed: ${progress.bytesPerSecond} - Progress: ${progress.percent}%`;
    logToFile(msg);

    if (mainWindow) {
      mainWindow.webContents.send('autoUpdater-event', {
        event: 'download-progress',
        percent: progress.percent,
      });
    }
  });

  autoUpdater.on('update-downloaded', (info) => {
    logToFile(`autoUpdater: Update downloaded. Release name: ${info.releaseName}`);
    if (mainWindow) {
      mainWindow.webContents.send('autoUpdater-event', {
        event: 'update-downloaded',
        version: info.version,
      });
    }
  });
}

// ---------- CREATE THE MAIN WINDOW -----------
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile(path.join(__dirname, '../frontend/landing.html'));

  mainWindow.webContents.on('did-finish-load', () => {
    // Example: if you want to send the assets path
    mainWindow.webContents.send('set-assets-path', assetsPath);
  });
}

// Dynamically set the assets path
const assetsPath = isDev
  ? path.join(__dirname, '../assets')
  : path.join(process.resourcesPath, 'assets');

// Reverse string utility
function reverseString(str) {
  return str.split('').reverse().join('');
}

// Check key validity (14-day window)
function isKeyValid(dateStr) {
  const keyDate = new Date(dateStr);
  const currentDate = new Date();
  const diffInDays = (currentDate - keyDate) / (1000 * 60 * 60 * 24);
  logToFile(`Key date: ${keyDate}, Current date: ${currentDate}, Difference in days: ${diffInDays}`);
  return diffInDays <= 14;
}

// Decrypt software key
async function processSoftwareKey(encryptedHex) {
  try {
    logToFile(`Encrypted Key Received: ${encryptedHex}`);

    const cipherBytes = new Uint8Array(
      encryptedHex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
    );

    const enc = new TextEncoder();
    const dec = new TextDecoder();

    const keyData = enc.encode(HARD_CODED_KEY);
    const cryptoKey = await webcrypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-CTR', length: 256 },
      false,
      ['decrypt']
    );

    const iv = new Uint8Array(16);

    const decryptedBuffer = await webcrypto.subtle.decrypt(
      { name: 'AES-CTR', counter: iv, length: 64 },
      cryptoKey,
      cipherBytes
    );

    const decrypted = dec.decode(decryptedBuffer);
    logToFile(`Decrypted Key: ${decrypted}`);

    const parts = decrypted.split('|');
    logToFile(`Decrypted Key Parts: ${JSON.stringify(parts)}`);

    if (parts.length !== 4) {
      throw new Error('Invalid key format. Expected 4 parts.');
    }

    const [date, platformCodeStr, revClerkID, revStripeID] = parts;
    const platformCode = parseInt(platformCodeStr, 10);

    if (!isKeyValid(date)) {
      throw new Error('Software key is expired. Please generate a new one.');
    }

    const currentPlatform = os.platform() === 'darwin' ? 1 : 2;
    logToFile(`Current platform: ${currentPlatform}, Key platform: ${platformCode}`);

    if (currentPlatform !== platformCode) {
      throw new Error('Software key does not match the current platform.');
    }

    const clerkID = reverseString(revClerkID);
    const stripeID = reverseString(revStripeID);
    logToFile(`Decrypted Clerk ID: ${clerkID}, Decrypted Stripe ID: ${stripeID}`);

    return { clerkID, stripeID };
  } catch (err) {
    logToFile(`Error in processSoftwareKey: ${err.message}`);
    throw err;
  }
}

async function getStoredCredentials() {
  const clerkID = await keytar.getPassword('camstem-app', 'clerkID');
  const stripeID = await keytar.getPassword('camstem-app', 'stripeID');
  logToFile(`Stored Credentials: Clerk ID: ${clerkID}, Stripe ID: ${stripeID}`);
  return { clerkID, stripeID };
}

// ------------- Resource Path Helper -------------
function getResourcePath(relativePath) {
  const basePath = app.isPackaged
    ? path.join(process.resourcesPath)
    : path.join(app.getAppPath());
  const resolvedPath = path.join(basePath, relativePath);
  logToFile(`Resolved Path: ${resolvedPath}`);
  return resolvedPath;
}

// ------------- Derive the demucs exec path (like in run-demucs code) -------------
function deriveDemucsExecPath() {
  const platform = os.platform();

  let relativeDemucsPath;
  if (platform === 'darwin') {
    relativeDemucsPath = isDev
      ? 'src/backend/demucs-cxfreeze-mac/demucs-cxfreeze'
      : 'demucs-cxfreeze-mac/demucs-cxfreeze';
  } else if (platform === 'win32') {
    relativeDemucsPath = isDev
      ? 'src/backend/demucs-cxfreeze-win-cuda/demucs-cxfreeze.exe'
      : 'demucs-cxfreeze-win-cuda/demucs-cxfreeze.exe';
  } else {
    // fallback for Linux, etc.
    relativeDemucsPath = isDev
      ? 'src/backend/demucs-cxfreeze-mac/demucs-cxfreeze'
      : 'demucs-cxfreeze-mac/demucs-cxfreeze';
  }

  return getResourcePath(relativeDemucsPath);
}

// ----------------- IPC HANDLERS -----------------
ipcMain.handle('select-path', async (event, type) => {
  const options = type === 'file'
    ? { properties: ['openFile'] }
    : { properties: ['openDirectory'] };

  const result = await dialog.showOpenDialog(options);

  if (!result.canceled && result.filePaths.length > 0) {
    logToFile(`Selected Path: ${result.filePaths[0]}`);
    return result.filePaths[0];
  }
  return null;
});

// -------------- NEW: getDemucsPaths --------------
ipcMain.handle('getDemucsPaths', async () => {
  try {
    const demucsExec = deriveDemucsExecPath();
    const modelsPath = getResourcePath('Models');

    // Return them to the front-end
    return {
      demucsExec,
      models: modelsPath,
    };
  } catch (err) {
    const msg = 'Error retrieving demucs or models path: ' + err.message;
    logToFile(msg);
    throw new Error(msg);
  }
});

ipcMain.handle('check-valid-key', async () => {
  try {
    const { clerkID, stripeID } = await getStoredCredentials();
    if (clerkID && stripeID) {
      return { valid: true };
    } else {
      return { valid: false, reason: 'No valid key found. Please enter a new one.' };
    }
  } catch (err) {
    logToFile(`Error in check-valid-key: ${err.message}`);
    return { valid: false, reason: 'An error occurred while checking the key.' };
  }
});

ipcMain.handle('activate-software-key', async (event, encryptedKey) => {
  try {
    const { clerkID, stripeID } = await processSoftwareKey(encryptedKey);
    await keytar.setPassword('camstem-app', 'clerkID', clerkID);
    await keytar.setPassword('camstem-app', 'stripeID', stripeID);

    logToFile(`Clerk ID: ${clerkID}`);
    logToFile(`Stripe Customer ID: ${stripeID}`);

    return { success: true };
  } catch (err) {
    logToFile(`Error processing software key: ${err.message}`);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('get-user-id', async () => {
  try {
    const { clerkID } = await getStoredCredentials();
    if (!clerkID) {
      throw new Error('Clerk ID not found in stored credentials.');
    }
    logToFile(`Retrieved User ID: ${clerkID}`);
    return { userId: clerkID };
  } catch (err) {
    logToFile(`Error in get-user-id handler: ${err.message}`);
    throw err;
  }
});

ipcMain.handle('check-subscription-status', async () => {
  try {
    const { stripeID } = await getStoredCredentials();
    if (!stripeID) {
      throw new Error('Stripe ID not found in stored credentials.');
    }

    logToFile(`Checking subscription status for Stripe ID: ${stripeID}`);

    const subscriptions = await stripe.subscriptions.list({
      customer: stripeID,
      status: 'all',
    });

    const activeSubscription = subscriptions.data.find(
      (sub) => sub.status === 'active' || sub.status === 'trialing'
    );

    if (!activeSubscription) {
      logToFile('No active subscription found.');
      return { active: false, reason: 'Subscription is canceled or expired.' };
    }

    logToFile(`Active subscription found: ${activeSubscription.id}`);
    return { active: true };
  } catch (err) {
    logToFile(`Error checking subscription status: ${err.message}`);
    return { active: false, reason: err.message };
  }
});

ipcMain.handle('save-software-key', async (event, key) => {
  try {
    await keytar.setPassword('camstem-app', 'softwareKey', key);
    logToFile(`Software key saved: ${key}`);
    return { success: true };
  } catch (err) {
    logToFile(`Error saving software key: ${err.message}`);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('get-saved-key', async () => {
  try {
    const savedKey = await keytar.getPassword('camstem-app', 'softwareKey');
    logToFile(`Retrieved software key: ${savedKey}`);
    return savedKey || null;
  } catch (err) {
    logToFile(`Error retrieving software key: ${err.message}`);
    throw err;
  }
});

ipcMain.handle('remove-saved-key', async () => {
  try {
    await keytar.deletePassword('camstem-app', 'softwareKey');
    logToFile('Software key removed.');
    return { success: true };
  } catch (err) {
    logToFile(`Error removing software key: ${err.message}`);
    return { success: false, error: err.message };
  }
});

// ---------- NEW IPC FOR AUTO-UPDATER CONTROL ----------
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('check-for-updates', () => {
  logToFile('Manual check-for-updates triggered');
  autoUpdater.checkForUpdates(); 
});

ipcMain.handle('install-update-now', () => {
  logToFile('User chose to install update now');
  autoUpdater.quitAndInstall();
});

// ---------- DEMUCS RUNNER -----------
ipcMain.on('run-demucs', (event, args) => {
  const { inputPath, outputPath, model, mp3Preset } = args;

  logToFile('Running Demucs with args:');
  logToFile(`Input Path: ${inputPath}`);
  logToFile(`Output Path: ${outputPath}`);
  logToFile(`Model: ${model}`);
  logToFile(`MP3 Preset: ${mp3Preset}`);

  const demucsPath = deriveDemucsExecPath();
  const modelRepo = getResourcePath('Models');

  logToFile(`Demucs Path: ${demucsPath}`);
  logToFile(`Model Repo: ${modelRepo}`);

  const commandArgs = [
    '-n', model,
    '--repo', modelRepo,
    '-o', outputPath,
    '--mp3',
    '--mp3-preset', mp3Preset,
    inputPath,
  ];

  logToFile(`Command Args: ${commandArgs.join(' ')}`);

  const demucsProcess = spawn(demucsPath, commandArgs, {
    shell: false,
    cwd: path.dirname(demucsPath),
  });

  demucsProcess.stdout.on('data', (data) => {
    const out = data.toString();
    logToFile(`Demucs stdout: ${out}`);
    event.reply('demucs-log', out);
  });

  demucsProcess.stderr.on('data', (data) => {
    const errOut = data.toString();
    logToFile(`Demucs stderr: ${errOut}`);
    event.reply('demucs-log', errOut);
  });

  demucsProcess.on('close', (code) => {
    if (code === 0) {
      logToFile('Demucs process completed successfully.');
      event.reply('demucs-success', 'Process completed successfully.');
    } else {
      logToFile(`Demucs process exited with code ${code}.`);
      event.reply('demucs-error', `Process exited with code ${code}.`);
    }
  });
});

// open log file
ipcMain.handle('open-log-file', () => {
  logToFile('Opening log file...');
  shell.showItemInFolder(logFilePath);
});

// ---------- APP LIFECYCLE ----------
app.whenReady().then(() => {
  createWindow();
  setupAutoUpdaterLogs();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  logToFile('App started.');
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    logToFile('App closed.');
    app.quit();
  }
});

/*************************************************************
 * TAILING THE LOG FILE 
 *************************************************************/
function tailLogFile(sender) {
  const logPath = logFilePath;
  let fileOffset = 0;

  fs.open(logPath, 'r', (err, fd) => {
    if (err) {
      console.error('Failed to open demucs-log.txt for tailing:', err);
      return;
    }

    const tailInterval = setInterval(() => {
      fs.stat(logPath, (statErr, stats) => {
        if (statErr) {
          console.error('stat error:', statErr);
          return;
        }
        if (stats.size > fileOffset) {
          const newSize = stats.size - fileOffset;
          const buffer = Buffer.alloc(newSize);

          fs.read(fd, buffer, 0, newSize, fileOffset, (readErr, bytesRead) => {
            if (readErr) {
              console.error('read error:', readErr);
              return;
            }
            fileOffset += bytesRead;

            const chunk = buffer.toString('utf8');
            const lines = chunk.split(/\r?\n/);

            lines.forEach((line) => {
              if (line.trim().length > 0) {
                sender.send('demucs-logfile-line', line);
              }
            });
          });
        }
      });
    }, 16);
  });
}

ipcMain.on('start-tail-log', (evt) => {
  tailLogFile(evt.sender);
});

// ---------- PREMIERE EXTENSION INSTALLER ----------
ipcMain.handle('installPremiereExtension', async (event, chosenPath) => {
  try {
    const extensionSource = path.join(__dirname, '../extension/CamStemExtension');
    const destination = path.join(chosenPath, 'CamStemExtension');

    logToFile(`Installing Premiere Extension from: ${extensionSource} => ${destination}`);

    function copyFolderSync(src, dest) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      const entries = fs.readdirSync(src, { withFileTypes: true });
      for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
          copyFolderSync(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    }

    copyFolderSync(extensionSource, destination);

    logToFile('Premiere Extension installed successfully!');
    return { success: true };
  } catch (err) {
    const msg = `Error installing Premiere Extension: ${err.message}`;
    logToFile(msg);
    return { success: false, error: msg };
  }
});

// ---------- OPEN ANY FOLDER IPC ----------
ipcMain.handle('openAnyFolder', async (event, folderPath) => {
  logToFile(`Request to open folder: ${folderPath}`);
  if (!folderPath) {
    return;
  }
  try {
    await shell.openPath(folderPath);
  } catch (err) {
    logToFile('Error opening path: ' + err.message);
  }
});

// ---------- GET DEFAULT EXTENSIONS FOLDER IPC ----------
ipcMain.handle('getDefaultExtensionsFolder', () => {
  const platform = os.platform();
  if (platform === 'win32') {
    // Windows
    return 'C:\\Program Files (x86)\\Common Files\\Adobe\\CEP\\extensions';
  } else if (platform === 'darwin') {
    // Mac
    const homeDir = os.homedir();
    return path.join(homeDir, 'Library', 'Application Support', 'Adobe', 'CEP', 'extensions');
  } else {
    // fallback, maybe Linux or unknown
    return '/tmp/AdobeCEP/extensions';
  }
});
```

