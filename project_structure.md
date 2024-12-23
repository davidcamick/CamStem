here is what my entire project looks like right now, so you can understand the updates and work with this version now

`.` (Root)
==============
- `tailwind.config.js`
- `README.md`
- `package.json`
- `postcss.config.js`
- `.env`

`.github`
==============

  `workflows`
  ==============
    - `buildmac.yml`

`Models`
==============
  - `htdemucs_6s.yaml`
  - `d12395a8-e57c48e6.th`
  - `5c90dfd2-34c22ccb.th`
  - `955717e8-8726e21a.th`
  - `htdemucs.yaml`
  - `f7e0c4bc-ba3fe64a.th`
  - `htdemucs_ft.yaml`
  - `04573f0d-f3cf25b2.th`
  - `92cfc3b6-ef3bcb9c.th`

`src`
==============

  `frontend`
  ==============
    - `tailwind-output.css`
    - `index.css`
    - `dashboard.html`
    - `splitter.html`
    - `landing.html`
    - `auth.html`

  `backend`
  ==============
    - `preload.js`
    - `main.js`

    `ffmpeg`
    ==============
      - `ffmpeg`
      - `.DS_Store`

    `demucs-cxfreeze-mac`
    ==============
      - `demucs-cxfreeze`

  `assets`
  ==============
    - `output-vp9.webm`


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
  "version": "0.9.7",
  "description": "CamStem",
  "main": "src/backend/main.js",
  "scripts": {
    "start": "electron .",
    "build:mac": "electron-builder --mac",
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
    "extraFiles": [
      {
        "from": "Models",
        "to": "Resources/Models",
        "filter": [
          "**/*"
        ]
      }
    ],
    "extraResources": [
      {
        "from": "src/assets",
        "to": "app/src/assets"
      }
    ],
    "win": {
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
      "target": [
        "dmg",
        "zip"
      ],
      "category": "public.app-category.utilities",
      "artifactName": "${productName}-${version}-mac.${ext}",
      "extraFiles": [
        {
          "from": "src/backend/demucs-cxfreeze-mac",
          "to": "resources/demucs-cxfreeze-mac",
          "filter": [
            "**/*"
          ]
        }
      ],
      "extraResources": [
        {
          "from": "Models",
          "to": "resources/Models",
          "filter": [
            "**/*"
          ]
        }
      ]
    },
    "dmg": {
      "format": "ULFO"
    },
    "files": [
      "dist/**/*",
      "src/backend/main.js",
      "src/backend/preload.js",
      "src/frontend/**/*"
    ],
    "directories": {
      "output": "release"
    }
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

### src\frontend\tailwind-output.css

``` 
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

/*
! tailwindcss v3.4.16 | MIT License | https://tailwindcss.com
*/

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

.fixed {
  position: fixed;
}

.relative {
  position: relative;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.flex {
  display: flex;
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

.text-gray-600 {
  --tw-text-opacity: 1;
  color: rgb(75 85 99 / var(--tw-text-opacity, 1));
}

.underline {
  text-decoration-line: underline;
}

.shadow {
  --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.transition {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
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

### src\frontend\index.css

``` 
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### src\frontend\dashboard.html

``` 
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>CamStem - temp</title>
  <style>
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

    .dashboard-container {
      width: 100%;
      max-width: 400px;
      padding: 2rem;
      background-color: #0582CA;
      border-radius: 12px;
      box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
    }

    .dashboard-container h1 {
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 1.5rem;
    }

    .dashboard-container p {
      font-size: 1.125rem;
      margin-bottom: 1rem;
    }

    .dashboard-container button {
      background-color: #003554;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      font-size: 1.125rem;
      border-radius: 0.375rem;
      cursor: pointer;
      margin: 0.5rem 0;
      transition: transform 0.3s ease, background-color 0.3s ease;
      display: inline-block;
      width: 100%;
    }

    .dashboard-container button:hover {
      background-color: #002940;
      transform: translateY(-4px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .logout-button {
      background-color: #8B0000;
    }

    .logout-button:hover {
      background-color: #690000;
    }

    /* Progress Bar Styling */
    #updateProgress {
      width: 100%;
      margin-top: 1rem;
      margin-bottom: 1rem;
      display: none; /* hidden by default */
    }

    .hidden {
      display: none !important;
    }
  </style>
</head>
<body>
  <div class="dashboard-container">
    <h1>Welcome to the CamStem Dashboard</h1>

    <!-- Current version text -->
    <p id="currentVersionText">Loading version...</p>

    <!-- Update info -->
    <p id="updateStatus" class="hidden"></p>
    <progress id="updateProgress" max="100" value="0"></progress>

    <!-- Check for updates button -->
    <button id="checkForUpdatesButton">
      Check for Updates
    </button>

    <!-- Install update now -->
    <button id="installUpdateButton" class="hidden">
      Install Update Now
    </button>

    <!-- Go to splitter -->
    <button id="goToSplitterButton">
      Go to Audio Splitting
    </button>

    <!-- Log out / remove keys -->
    <button id="logoutButton" class="logout-button">
      Log Out / Remove All Saved Keys
    </button>
  </div>

  <script>
    // Grab all elements
    const currentVersionText = document.getElementById('currentVersionText');
    const checkUpdatesButton = document.getElementById('checkForUpdatesButton');
    const updateStatus = document.getElementById('updateStatus');
    const updateProgress = document.getElementById('updateProgress');
    const installUpdateButton = document.getElementById('installUpdateButton');
    const goToSplitterButton = document.getElementById('goToSplitterButton');
    const logoutButton = document.getElementById('logoutButton');

    // 1. On load, get current app version
    (async () => {
      try {
        // Use the named method from preload.js
        const version = await window.api.getAppVersion();
        currentVersionText.textContent = `You are on version: v${version}`;
      } catch (err) {
        console.error('Error getting app version:', err);
        currentVersionText.textContent = `Version: Unknown`;
      }
    })();

    // 2. Listen for autoUpdater events
    //    (We rely on main.js broadcasting 'autoUpdater-event')
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
          updateProgress.style.display = 'block'; // Show progress bar
          break;

        case 'download-progress':
          updateProgress.value = data.percent.toFixed(2);
          break;

        case 'update-downloaded':
          updateStatus.textContent = `Update downloaded (v${data.version}). Choose "Install Update Now" to restart.`;
          installUpdateButton.classList.remove('hidden'); // Show the "Install Now" button
          break;

        case 'update-not-available':
          updateStatus.classList.remove('hidden');
          updateStatus.textContent = 'No updates available.';
          break;

        case 'error':
          updateStatus.classList.remove('hidden');
          updateStatus.textContent = `AutoUpdater Error: ${data.message}`;
          console.error('autoUpdater error:', data.message);
          break;

        default:
          break;
      }
    });

    // 3. Buttons
    checkUpdatesButton.addEventListener('click', async () => {
      // Reset update UI
      updateProgress.value = 0;
      updateProgress.style.display = 'none';
      installUpdateButton.classList.add('hidden');
      updateStatus.textContent = '';
      updateStatus.classList.add('hidden');

      // Trigger a manual check
      try {
        await window.api.checkForUpdates();
      } catch (err) {
        console.error('Error checking for updates:', err);
      }
    });

    installUpdateButton.addEventListener('click', async () => {
      // The update is already downloaded at this point.
      // This will quit and install the new version.
      try {
        await window.api.installUpdateNow();
      } catch (err) {
        console.error('Error installing update:', err);
      }
    });

    goToSplitterButton.addEventListener('click', () => {
      window.location.href = 'splitter.html';
    });

    logoutButton.addEventListener('click', async () => {
      try {
        await window.api.removeSavedKey();
        alert('All saved keys have been removed. You will be redirected to the login page.');
        window.location.href = 'auth.html';
      } catch (error) {
        console.error('Error removing saved keys:', error);
        alert('An error occurred while removing saved keys. Please try again.');
      }
    });
  </script>
</body>
</html>
```

### src\frontend\splitter.html

``` 
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CamStem</title>
    <style>
        /* Full gradient background */
        body {
            background: linear-gradient(135deg, #006494, #051923);
            min-height: 100vh;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: Arial, sans-serif;
            color: white;
        }

        /* Container styles */
        .container {
            width: 60%;
            max-width: 800px;
            padding: 2rem;
            background-color: rgba(5, 130, 202, 0.95); /* Slight transparency */
            border-radius: 12px;
            box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
            position: relative;
        }

        .container h1 {
            text-align: center;
            font-size: 2rem;
            margin-bottom: 1.5rem;
        }

        /* Two-column form layout */
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

        /* Button styles */
        .btn {
            padding: 0.6rem 1.2rem;
            border: none;
            border-radius: 6px;
            font-size: 0.95rem;
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.3s ease;
            width: 100%;
            max-width: 180px;
            margin-top: 0.3rem;
        }

        .btn-secondary {
            background-color: #17a2b8;
            color: white;
        }

        .btn-secondary:hover {
            background-color: #138496;
            transform: translateY(-2px);
        }

        .btn-primary {
            background-color: #28a745;
            color: white;
        }

        .btn-primary:hover {
            background-color: #218838;
            transform: translateY(-2px);
        }

        .btn-danger {
            background-color: #dc3545;
            color: white;
        }

        .btn-danger:hover {
            background-color: #c82333;
            transform: translateY(-2px);
        }

        /* Buttons container */
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

        /* Collapsible Log Section */
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

        .logs {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease, padding 0.3s ease;
            background-color: #ffffff;
            color: #333;
            padding: 0 1rem;
            border-radius: 6px;
            margin-top: 0.5rem;
        }

        .logs.open {
            max-height: 300px; /* Adjust as needed */
            padding: 1rem;
        }

        .logs p {
            margin: 0.5rem 0;
            font-size: 0.95rem;
            color: #333;
        }

        /* Modal Styles */
        .modal {
            display: none; /* Hidden by default */
            position: fixed; /* Stay in place */
            z-index: 100; /* Sit on top */
            left: 0;
            top: 0;
            width: 100%; /* Full width */
            height: 100%; /* Full height */
            overflow: auto; /* Enable scroll if needed */
            background-color: rgba(0, 0, 0, 0.5); /* Black w/ opacity */
            align-items: center;
            justify-content: center;
        }

        .modal-content {
            background-color: #0582CA;
            margin: auto;
            padding: 2rem;
            border: 1px solid #888;
            width: 80%;
            max-width: 500px;
            border-radius: 12px;
            color: white;
            text-align: center;
        }

        .modal-content h2 {
            margin-top: 0;
            font-size: 1.5rem;
        }

        .modal-content p {
            margin: 1rem 0;
            font-size: 1rem;
        }

        .modal-buttons {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-top: 1.5rem;
        }

        .modal-buttons .btn {
            max-width: 100px;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
            .form-column {
                flex: 1 1 100%;
            }

            .buttons-container {
                flex-direction: column;
                gap: 0.5rem;
            }

            .buttons-container button {
                max-width: 100%;
            }

            .modal-content {
                width: 90%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>CamStem</h1>

        <form id="demucsForm">
            <div class="form-grid">
                <!-- Left Column: Input and Output Path Selection -->
                <div class="form-column">
                    <div class="form-group">
                        <label for="inputPath">Input Path:</label>
                        <button 
                            type="button" 
                            id="selectInput" 
                            class="btn btn-secondary"
                        >
                            Select Input
                        </button>
                    </div>

                    <div class="form-group">
                        <label for="outputPath">Output Path:</label>
                        <button 
                            type="button" 
                            id="selectOutput" 
                            class="btn btn-secondary"
                        >
                            Select Output
                        </button>
                    </div>
                </div>

                <!-- Right Column: Model and Quality Selection -->
                <div class="form-column">
                    <div class="form-group">
                        <label for="model">Select Model:</label>
                        <select 
                            id="model" 
                            required 
                            style="width: 100%; padding: 0.6rem; border: none; border-radius: 6px; background-color: #e9ecef; color: #333;"
                        >
                            <option value="htdemucs">Default</option>
                            <option value="htdemucs_ft">Fine Tuned</option>
                            <option value="htdemucs_6s">Six Stem Model</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="mp3Preset">MP3 Quality Preset:</label>
                        <select 
                            id="mp3Preset" 
                            required 
                            style="width: 100%; padding: 0.6rem; border: none; border-radius: 6px; background-color: #e9ecef; color: #333;"
                        >
                            <option value="2">2 (Highest Quality)</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7 (Fastest Speed)</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Buttons Container -->
            <div class="buttons-container">
                <button 
                    type="button" 
                    id="splitStemsButton" 
                    class="btn btn-primary"
                >
                    Split Stems
                </button>

                <button 
                    type="button" 
                    id="openLogFile" 
                    class="btn btn-secondary"
                >
                    Open Log File
                </button>

                <button 
                    type="button" 
                    id="backToDashboard" 
                    class="btn btn-danger"
                >
                    Back to Main Menu
                </button>
            </div>
        </form>

        <!-- Collapsible Log Section -->
        <div class="log-section">
            <div class="log-header" id="logHeader">
                <h2>Logs</h2>
                <button class="log-toggle" id="toggleLogs">Show Logs</button>
            </div>
            <div id="logs" class="logs">
                <p class="text-gray-600">Logs will appear here...</p>
            </div>
        </div>
    </div>

    <!-- Modal Popup -->
    <div id="infoModal" class="modal">
        <div class="modal-content">
            <h2>Important Information</h2>
            <p>A new folder will be created in your output directory where the stems will be stored.</p>
            <p>If this is your first time splitting, it may take up to 5 minutes to start the splitting process.</p>
            <p>If you don't see any progress after 10 minutes (including in the logs), please email us at <a href="mailto:devs@camstem.org" style="color: #FFD700; text-decoration: underline;">devs@camstem.org</a> and attach the log file by clicking on "Open Log File".</p>
            <div class="modal-buttons">
                <button id="proceedButton" class="btn btn-primary">Proceed</button>
                <button id="cancelButton" class="btn btn-danger">Cancel</button>
            </div>
        </div>
    </div>

    <script>
        const selectInputButton = document.getElementById('selectInput');
        const selectOutputButton = document.getElementById('selectOutput');
        const splitStemsButton = document.getElementById('splitStemsButton');
        const openLogFileButton = document.getElementById('openLogFile');
        const backToDashboardButton = document.getElementById('backToDashboard');
        const logsDiv = document.getElementById('logs');
        const toggleLogsButton = document.getElementById('toggleLogs');

        const infoModal = document.getElementById('infoModal');
        const proceedButton = document.getElementById('proceedButton');
        const cancelButton = document.getElementById('cancelButton');

        let inputPath = '';
        let outputPath = '';

        selectInputButton.addEventListener('click', () => {
            window.api.selectPath('file', (path) => {
                if (path) {
                    inputPath = path;
                    selectInputButton.textContent = 'Input Selected';
                    selectInputButton.disabled = true;
                }
            });
        });

        selectOutputButton.addEventListener('click', () => {
            window.api.selectPath('directory', (path) => {
                if (path) {
                    outputPath = path;
                    selectOutputButton.textContent = 'Output Selected';
                    selectOutputButton.disabled = true;
                }
            });
        });

        splitStemsButton.addEventListener('click', () => {
            if (!inputPath || !outputPath) {
                alert('Please select both input and output paths before splitting.');
                return;
            }
            // Show the modal
            infoModal.style.display = 'flex';
        });

        proceedButton.addEventListener('click', () => {
            // Hide the modal
            infoModal.style.display = 'none';
            // Proceed with splitting
            runSplitStems();
        });

        cancelButton.addEventListener('click', () => {
            // Hide the modal
            infoModal.style.display = 'none';
        });

        function runSplitStems() {
            const model = document.getElementById('model').value;
            const mp3Preset = document.getElementById('mp3Preset').value;

            console.log('Submitted Input Path:', inputPath);
            console.log('Submitted Output Path:', outputPath);
            console.log('Selected Model:', model);
            console.log('MP3 Preset:', mp3Preset);

            window.api.runDemucs(inputPath, outputPath, model, mp3Preset);
        }

        openLogFileButton.addEventListener('click', () => {
            window.api.openLogFile();
        });

        backToDashboardButton.addEventListener('click', () => {
            window.location.href = 'dashboard.html';
        });

        window.api.receive('demucs-log', (message) => {
            const logEntry = document.createElement('p');
            logEntry.textContent = message;
            logsDiv.appendChild(logEntry);
            logsDiv.scrollTop = logsDiv.scrollHeight;
        });

        // Collapsible Logs Functionality
        toggleLogsButton.addEventListener('click', () => {
            if (logsDiv.classList.contains('open')) {
                logsDiv.classList.remove('open');
                toggleLogsButton.textContent = 'Show Logs';
            } else {
                logsDiv.classList.add('open');
                toggleLogsButton.textContent = 'Hide Logs';
            }
        });

        // Close modal when clicking outside of it
        window.addEventListener('click', (event) => {
            if (event.target == infoModal) {
                infoModal.style.display = 'none';
            }
        });
    </script>
</body>
</html>
```

### src\frontend\landing.html

``` 
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CamStem</title>
    <link rel="stylesheet" href="tailwind-output.css">
    <style>
        /* Full gradient background */
        body {
            background: linear-gradient(135deg, #006494, #051923);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
            font-family: Arial, sans-serif;
            color: white;
        }

        /* Centered box styles */
        #mainContent {
            width: 100%;
            max-width: 400px;
            padding: 2rem;
            background-color: rgba(5, 130, 202, 0.95); /* Slight transparency */
            border-radius: 12px;
            box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
            text-align: center;
            position: relative;
        }

        /* Intro video wrapper stays full-screen */
        #introVideoWrapper {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 50; /* Ensure it stays on top */
            display: flex;
            align-items: center;
            justify-content: center;
            background: none; /* No background color */
        }

        /* The video itself */
        #introVideo {
            width: 100%;
            height: auto;
            object-fit: cover; /* Maintain aspect ratio and scaling */
        }

        /* Hide the video wrapper after 4 seconds */
        .hidden {
            display: none;
        }

        /* Button styles */
        .actionButton {
            background-color: #003554; /* Button color */
            color: white; /* Button text color */
            padding: 0.75rem 1.5rem;
            font-size: 1.125rem; /* Text size (lg) */
            border-radius: 0.375rem; /* Rounded corners */
            transition: transform 0.3s ease, background-color 0.3s ease; /* Smooth animation */
            transform: translateY(0); /* Default position */
            margin-bottom: 1rem; /* Spacing between buttons */
            display: inline-block; /* Consistent block-like buttons */
            border: none;
            cursor: pointer;
        }

        .actionButton:hover {
            background-color: #002940; /* Slightly darker on hover */
            transform: translateY(-4px); /* Raise the button slightly */
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Add shadow for depth */
        }

        /* Modal Styles */
        .modal {
            display: none; /* Hidden by default */
            position: fixed; /* Stay in place */
            z-index: 100; /* Sit on top */
            left: 0;
            top: 0;
            width: 100%; /* Full width */
            height: 100%; /* Full height */
            overflow: auto; /* Enable scroll if needed */
            background-color: rgba(0, 0, 0, 0.5); /* Black w/ opacity */
            align-items: center;
            justify-content: center;
            padding: 1rem;
        }

        .modal-content {
            background-color: #0582CA;
            margin: auto;
            padding: 2rem;
            border: 1px solid #888;
            width: 100%;
            max-width: 500px;
            border-radius: 12px;
            color: white;
            text-align: center;
            position: relative;
        }

        .modal-content h2 {
            margin-top: 0;
            font-size: 1.5rem;
        }

        .modal-content p {
            margin: 1rem 0;
            font-size: 1rem;
        }

        .modal-buttons {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-top: 1.5rem;
        }

        .modal-buttons .btn {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 6px;
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.3s ease;
            width: 100px;
        }

        .btn-primary {
            background-color: #28a745;
            color: white;
        }

        .btn-primary:hover {
            background-color: #218838;
            transform: translateY(-2px);
        }

        .btn-secondary {
            background-color: #17a2b8;
            color: white;
        }

        .btn-secondary:hover {
            background-color: #138496;
            transform: translateY(-2px);
        }

        .btn-danger {
            background-color: #dc3545;
            color: white;
        }

        .btn-danger:hover {
            background-color: #c82333;
            transform: translateY(-2px);
        }

        /* Responsive adjustments */
        @media (max-width: 600px) {
            #mainContent {
                padding: 1.5rem;
            }

            .modal-content {
                padding: 1.5rem;
            }

            .actionButton {
                width: 100%;
                margin-bottom: 0.75rem;
            }

            .modal-buttons {
                flex-direction: column;
                gap: 0.5rem;
            }

            .modal-buttons .btn {
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <!-- Video Wrapper -->
    <div id="introVideoWrapper">
        <video id="introVideo" autoplay muted playsinline>
            <source src="../assets/output-vp9.webm" type="video/webm">
            Your browser does not support the video tag.
        </video>
    </div>

    <!-- Main Landing Content -->
    <div id="mainContent" class="hidden">
        <h1 class="text-4xl font-bold mb-4">CamStem</h1>
        <p class="text-lg font-medium mb-6">Your Auditory Journey Awaits</p>
        <!-- Sign In Button -->
        <button 
            id="signInButton" 
            class="actionButton focus:ring-2 focus:ring-blue-400"
        >
            Sign In
        </button>
        <!-- Sign Up Button -->
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
        // Wait for 4 seconds, then hide the video and show the main content
        const introVideoWrapper = document.getElementById('introVideoWrapper');
        const mainContent = document.getElementById('mainContent');

        setTimeout(() => {
            introVideoWrapper.style.pointerEvents = 'none'; // Disable interaction with the video wrapper
            mainContent.classList.remove('hidden'); // Show the main content
        }, 4000); // Delay in milliseconds (4 seconds)

        // Sign-in button event listener
        document.getElementById('signInButton').addEventListener('click', () => {
            window.location.href = 'auth.html';
        });

        // Sign-up button event listener to show modal
        const signUpButton = document.getElementById('signUpButton');
        const signUpModal = document.getElementById('signUpModal');
        const closeModalButton = document.getElementById('closeModalButton');

        signUpButton.addEventListener('click', () => {
            signUpModal.style.display = 'flex';
        });

        closeModalButton.addEventListener('click', () => {
            signUpModal.style.display = 'none';
        });

        // Close the modal when clicking outside of it
        window.addEventListener('click', (event) => {
            if (event.target == signUpModal) {
                signUpModal.style.display = 'none';
            }
        });
    </script>
</body>
</html>
```

### src\frontend\auth.html

``` 
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Software Key Authentication</title>
    <style>
        /* Full gradient background */
        body {
            background: linear-gradient(135deg, #006494, #051923);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
            font-family: Arial, sans-serif;
        }

        /* Container styles similar to example */
        .auth-container {
            width: 100%;
            max-width: 400px;
            padding: 2rem;
            background-color: #0582CA;
            border-radius: 12px;
            box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
            text-align: center;
            color: white;
        }

        .auth-container h1 {
            font-size: 1.5em;
            margin-bottom: 1em;
        }

        .auth-container input {
            width: 100%;
            padding: 10px;
            margin-bottom: 1em;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1em;
        }

        /* Button styles inspired by example */
        .auth-container button {
            background-color: #003554;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            font-size: 1.125rem;
            border-radius: 0.375rem;
            cursor: pointer;
            margin: 0.5rem;
            transition: transform 0.3s ease, background-color 0.3s ease;
        }

        .auth-container button:hover {
            background-color: #002940;
            transform: translateY(-4px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .auth-container button:disabled {
            background-color: #aaa;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }

        .auth-container .message {
            margin-top: 1em;
            font-size: 0.9em;
            color: #ffdddd; /* Light red for error messages */
        }

        /* Success messages in green for clarity */
        .auth-container .message.success {
            color: #d0ffd0;
        }
    </style>
</head>
<body>
    <div class="auth-container">
        <h1>Software Key Authentication</h1>
        <input type="text" id="softwareKey" placeholder="Enter your software key">
        <button id="validateButton">Validate Key</button>
        <button id="logoutButton">Log Out / Remove Saved Keys</button>
        <p id="statusMessage" class="message"></p>
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
                // Activate the software key
                const keyResult = await window.api.activateSoftwareKey(softwareKey);
                if (!keyResult.success) {
                    statusMessage.textContent = `Key validation failed: ${keyResult.error}`;
                    validateButton.disabled = false;
                    return;
                }

                // Save the software key
                await window.api.saveSoftwareKey(softwareKey);

                // Check subscription status
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

### src\backend\preload.js

``` 
// src/backend/preload.js
const { contextBridge, ipcRenderer, shell } = require('electron');

contextBridge.exposeInMainWorld('api', {
  runDemucs: (inputPath, outputPath, model, mp3Preset) => {
    ipcRenderer.send('run-demucs', { inputPath, outputPath, model, mp3Preset });
  },
  receive: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
  selectPath: async (type, callback) => {
    const path = await ipcRenderer.invoke('select-path', type);
    callback(path);
  },
  openLogFile: () => {
    ipcRenderer.invoke('open-log-file');
  },
  openExternal: (url) => {
    shell.openExternal(url);
  },

  // Key methods
  saveSoftwareKey: async (key) => ipcRenderer.invoke('save-software-key', key),
  getSavedKey: async () => ipcRenderer.invoke('get-saved-key'),
  removeSavedKey: async () => ipcRenderer.invoke('remove-saved-key'),
  checkValidKey: async () => ipcRenderer.invoke('check-valid-key'),
  activateSoftwareKey: async (encryptedKey) => ipcRenderer.invoke('activate-software-key', encryptedKey),
  checkSubscriptionStatus: async () => ipcRenderer.invoke('check-subscription-status'),

  // Auto-updater methods
  getAppVersion: async () => ipcRenderer.invoke('get-app-version'),
  checkForUpdates: async () => ipcRenderer.invoke('check-for-updates'),
  installUpdateNow: async () => ipcRenderer.invoke('install-update-now'),
});
```

### src\backend\main.js

``` 
// src/backend/main.js

// 1) Load environment variables from .env
require('dotenv').config();

const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const { execFile } = require('child_process');
const fs = require('fs');
const keytar = require('keytar');
const { webcrypto } = require('crypto');
const os = require('os');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || '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'); // fallback

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
    // Now we let the user choose: we'll notify the renderer
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
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile(path.join(__dirname, '../frontend/landing.html'));

  mainWindow.webContents.on('did-finish-load', () => {
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
  autoUpdater.checkForUpdates(); // no "notify", so user decides
});

ipcMain.handle('install-update-now', () => {
  logToFile('User chose to install update now');
  autoUpdater.quitAndInstall();
});

// ---------- DEMUCS RUNNER -----------
function getResourcePath(relativePath) {
  const basePath = app.isPackaged
    ? path.join(process.resourcesPath)
    : path.join(app.getAppPath());
  const resolvedPath = path.join(basePath, relativePath);
  logToFile(`Resolved Path: ${resolvedPath}`);
  return resolvedPath;
}

ipcMain.on('run-demucs', (event, args) => {
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
    relativeDemucsPath = isDev
      ? 'src/backend/demucs-cxfreeze-mac/demucs-cxfreeze'
      : 'demucs-cxfreeze-mac/demucs-cxfreeze';
  }

  const demucsPath = getResourcePath(relativeDemucsPath);
  const modelRepo = getResourcePath('Models');

  const { inputPath, outputPath, model, mp3Preset } = args;

  logToFile('Running Demucs with args:');
  logToFile(`Demucs Path: ${demucsPath}`);
  logToFile(`Model Repo: ${modelRepo}`);
  logToFile(`Input Path: ${inputPath}`);
  logToFile(`Output Path: ${outputPath}`);
  logToFile(`Model: ${model}`);
  logToFile(`MP3 Preset: ${mp3Preset}`);

  const commandArgs = [
    '-n', model,
    '--repo', modelRepo,
    '-o', outputPath,
    '--mp3',
    '--mp3-preset', mp3Preset,
    inputPath,
  ];

  logToFile(`Command Args: ${commandArgs.join(' ')}`);

  const demucsProcess = execFile(demucsPath, commandArgs);

  demucsProcess.stdout.on('data', (data) => {
    logToFile(`Demucs stdout: ${data.toString()}`);
    event.reply('demucs-log', data.toString());
  });

  demucsProcess.stderr.on('data', (data) => {
    const stderrLog = `Demucs stderr: ${data.toString()}`;
    logToFile(stderrLog);
    event.reply('demucs-log', stderrLog);
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

  // (OPTIONAL) If you want an automatic check after 5 seconds:
  // setTimeout(() => {
  //   logToFile('Calling autoUpdater.checkForUpdates()');
  //   autoUpdater.checkForUpdates();
  // }, 5000);

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
```

