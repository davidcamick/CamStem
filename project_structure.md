this is my project, please read the contents and understand its functionality. once done, let me know and await my requests.

`.` (Root)
==============
- `tailwind.config.js`
- `README.md`
- `postcss.config.js`
- `.env`
- `package.json`

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
    - `settings.html`
    - `about.html`
    - `update.html`
    - `premiere.html`
    - `splitter.css`

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
    - `icon.ico`
    - `installerHeader.bmp`
    - `logo.png`
    - `installerSidebar.bmp`
    - `icon.icns`


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

### src\frontend\index.css

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

### src\frontend\dashboard.html

``` 
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>CamStem</title>
  <!-- Include Tailwind + Custom Index CSS -->
  <link rel="stylesheet" href="tailwind-output.css">
  <link rel="stylesheet" href="index.css">
  <!-- Only new style for the "glow" effect -->
  <style>
    .glow {
      animation: glowAnimation 1s ease-in-out infinite alternate;
    }
    @keyframes glowAnimation {
      from {
        box-shadow: 0 0 10px #fff;
      }
      to {
        box-shadow: 0 0 20px #0ff;
      }
    }
  </style>
</head>
<body>
  <!-- Container with a max-width so it doesn't stretch too wide -->
  <div class="container" style="max-width: 480px;">
    <!-- Use the new .page-title class from index.css -->
    <h1 class="page-title">CamStem Dashboard</h1>

    <!-- 2×2 grid of actionButtons -->
    <div class="dashboard-buttons">
      <button id="goToSplitterButton" class="actionButton">Stem Splitting</button>
      <!-- Changed "Premiere Pro Integration" to "Premiere Setup" -->
      <button id="goToPremiereButton" class="actionButton">Premiere Setup</button>
      <button id="goToSettingsButton" class="actionButton">Settings</button>
      <button id="goToAboutButton" class="actionButton">About</button>
    </div>

    <!-- Pill-shaped version button at the bottom -->
    <a id="versionButton" class="version-button">
      v?.?.?
    </a>
  </div>

  <!-- Error Modal -->
  <div class="modal" id="errorModal">
    <div class="modal-content">
      <h2>Error</h2>
      <p id="errorMessage"></p>
      <button id="errorModalCloseButton" class="close-btn">Close</button>
    </div>
  </div>

  <!-- New Update Modal -->
  <div class="modal" id="updateModal" style="display: none;">
    <div class="modal-content">
      <h2>Update Available</h2>
      <p>A new version of CamStem is available! Would you like to update now?</p>
      <div class="modal-buttons">
        <button id="goToUpdatePage" class="btn btn-primary">Update</button>
        <button id="dismissUpdateModal" class="btn btn-danger">No Thanks</button>
      </div>
    </div>
  </div>

  <script>
    // Error modal references
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

    // Dashboard Buttons
    const goToSplitterButton = document.getElementById('goToSplitterButton');
    const goToPremiereButton = document.getElementById('goToPremiereButton');
    const goToSettingsButton = document.getElementById('goToSettingsButton');
    const goToAboutButton = document.getElementById('goToAboutButton');

    goToSplitterButton.addEventListener('click', () => {
      window.location.href = 'splitter.html';
    });
    goToPremiereButton.addEventListener('click', () => {
      window.location.href = 'premiere.html';
    });
    goToSettingsButton.addEventListener('click', () => {
      window.location.href = 'settings.html';
    });
    goToAboutButton.addEventListener('click', () => {
      window.location.href = 'about.html';
    });

    // Pill-shaped version button -> update.html
    const versionButton = document.getElementById('versionButton');
    (async () => {
      try {
        const version = await window.api.getAppVersion();
        versionButton.textContent = `v${version}`;
      } catch (err) {
        console.error('Error getting app version:', err);
        versionButton.textContent = 'v?.?.?';
      }
    })();

    versionButton.addEventListener('click', () => {
      window.location.href = 'update.html';
    });

    // New Update Modal references
    const updateModal = document.getElementById('updateModal');
    const goToUpdatePageButton = document.getElementById('goToUpdatePage');
    const dismissUpdateModalButton = document.getElementById('dismissUpdateModal');

    goToUpdatePageButton.addEventListener('click', () => {
      window.location.href = 'update.html';
    });
    dismissUpdateModalButton.addEventListener('click', () => {
      updateModal.style.display = 'none';
    });

    // Listen for autoUpdater events to handle the glow and show/hide update modal
    window.api.receive('autoUpdater-event', (data) => {
      console.log('autoUpdater-event in dashboard:', data);
      if (data.event === 'update-available') {
        // Make version button glow
        versionButton.classList.add('glow');
        // Show the update modal on launch
        updateModal.style.display = 'flex';
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
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>CamStem - Stem Splitting</title>
  <!-- Include Tailwind + Custom Index CSS -->
  <link rel="stylesheet" href="tailwind-output.css">
  <link rel="stylesheet" href="index.css">
  <!-- Link the newly created splitter.css -->
  <link rel="stylesheet" href="splitter.css">
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

    <!-- =========================== STEP 5: Splitting & Progress =========================== -->
    <div id="step5" class="step">
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

      <!-- Our progress heading & meter -->
      <p id="progressHeading">Progress: 0%</p>
      <progress id="progressMeter" value="0" max="100"></progress>

      <!-- Real-time console area for the raw logs -->
      <div id="demucsConsole" style="display:none;"></div>

      <!-- The single last line from the log file tailing -->
      <div id="latestLineDiv" class="latest-log-line">(No lines yet)</div>

      <!-- The single "filtered" version of the LATEST line we appended -->
      <div id="filteredLine"></div>

      <a href="dashboard.html" class="exit-pill">Exit</a>
    </div>
  </div>

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
    const progressHeading = document.getElementById('progressHeading');
    const progressMeter = document.getElementById('progressMeter');
    const demucsConsole = document.getElementById('demucsConsole');
    const latestLineDiv = document.getElementById('latestLineDiv');
    const filteredLineDiv = document.getElementById('filteredLine');

    // Warnings
    const warningModal = document.getElementById('warningModal');
    const warningMsg = document.getElementById('warningMsg');
    const warningCloseBtn = document.getElementById('warningCloseBtn');

    // We use demucsOutputBuffer for progress logic
    let demucsOutputBuffer = '';
    const progressRegex = /(\d+(?:\.\d+)?)%/g;

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
      chosenModel = 'htdemucs_ft';
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
    browseOutputBtn.addEventListener('click', () => {
      window.api.selectPath('directory', (selectedFolder) => {
        if (selectedFolder) {
          chosenOutputPath = selectedFolder;
          browseOutputBtn.textContent = 'Output Selected ✓';
          step3ContinueBtn.classList.remove('btn-disabled');
        }
      });
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
      // Clear old console
      demucsOutputBuffer = '';
      demucsConsole.innerHTML = '';
      demucsConsole.style.display = 'none';

      // Clear filtered line
      filteredLineDiv.textContent = '';

      progressHeading.style.display = 'none';
      progressHeading.textContent = 'Progress: 0%';

      progressMeter.style.display = 'none';
      progressMeter.value = 0;

      window.api.runDemucs(chosenFilePath, chosenOutputPath, chosenModel, chosenPreset);
      window.api.startTailLog();
    }

    /**************************************************************************************
     * This function picks out the first two digits from the line,
     * then returns something like "7%" or "24%".
     **************************************************************************************/
    function detectFirstTwoDigits(line) {
      const trimmed = line.trim();
      if (trimmed.length < 1) return null;

      // Grab up to first 2 characters
      let firstTwo = trimmed.substring(0, 2); 
      const firstChar = firstTwo.charAt(0);
      const secondChar = firstTwo.charAt(1) || '';

      // If the firstChar isn't a digit, skip
      if (!/^\d$/.test(firstChar)) {
        return null;
      }

      // If secondChar is '%', we do e.g. "7%"
      if (secondChar === '%') {
        return `${firstChar}%`;
      } 
      // If secondChar is a digit => e.g. "24"
      else if (/^\d$/.test(secondChar)) {
        return `${firstChar}${secondChar}%`;
      } 
      // else single digit => "2%"
      return `${firstChar}%`;
    }

    function parseDemucsOutput() {
      const lines = demucsOutputBuffer.split(/\r?\n/);
      demucsOutputBuffer = lines.pop() || '';

      let bestPercent = 0;
      lines.forEach((line) => {
        // Show raw line in the console
        if (!demucsConsole.style.display) {
          demucsConsole.style.display = 'block';
        }
        const p = document.createElement('div');
        p.textContent = line;
        demucsConsole.appendChild(p);
        demucsConsole.scrollTop = demucsConsole.scrollHeight;

        // Then we do "filtered" from the same line
        const short = detectFirstTwoDigits(line);
        if (short) {
          filteredLineDiv.textContent = short;
        }

        // If line includes "Separated tracks..."
        if (line.includes('Separated tracks will be stored in')) {
          const splitted = line.split('Separated tracks will be stored in');
          if (splitted[1]) {
            finalStemsPath = splitted[1].trim();
          }
        }

        // Attempt "NN%" for the progress
        let match;
        while ((match = progressRegex.exec(line)) !== null) {
          const val = parseFloat(match[1]);
          if (val > bestPercent) bestPercent = val;
        }
      });

      // If we found a new largest percent
      if (bestPercent > 0) {
        if (!progressHeading.style.display) {
          progressHeading.style.display = 'block';
        }
        if (!progressMeter.style.display) {
          progressMeter.style.display = 'block';
        }
        if (bestPercent > 100) bestPercent = 100;
        progressHeading.textContent = `Progress: ${bestPercent.toFixed(1)}%`;
        progressMeter.value = bestPercent.toFixed(1);
      }
    }

    // On each chunk
    window.api.receive('demucs-log', (chunk) => {
      demucsOutputBuffer += chunk;
      parseDemucsOutput();
    });

    // success
    window.api.receive('demucs-success', (msg) => {
      parseDemucsOutput();
      if (!progressHeading.style.display) {
        progressHeading.style.display = 'block';
      }
      progressHeading.textContent = 'Progress: 100.0%';
      progressMeter.style.display = 'block';
      progressMeter.value = 100;

      const successDiv = document.createElement('div');
      successDiv.style.color = 'green';
      successDiv.textContent = `SUCCESS: ${msg}`;
      demucsConsole.appendChild(successDiv);
      demucsConsole.scrollTop = demucsConsole.scrollHeight;

      // Also show "Splitting Process Completed"
      filteredLineDiv.textContent = 'Splitting Process Completed';
    });

    // error
    window.api.receive('demucs-error', (errMsg) => {
      parseDemucsOutput();
      const errDiv = document.createElement('div');
      errDiv.style.color = 'red';
      errDiv.textContent = `ERROR: ${errMsg}`;
      demucsConsole.appendChild(errDiv);
      demucsConsole.scrollTop = demucsConsole.scrollHeight;
    });

    // Tailing => last line
    window.api.onLogFileLine((newLine) => {
      latestLineDiv.textContent = newLine;
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

### src\frontend\auth.html

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

### src\frontend\settings.html

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

### src\frontend\about.html

``` 
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>CamStem - About</title>
  <!-- Include Tailwind + Custom Index CSS -->
  <link rel="stylesheet" href="tailwind-output.css">
  <link rel="stylesheet" href="index.css">
</head>
<body>
  <div class="container" style="max-width: 480px;">
    <!-- Use the .page-title class -->
    <h1 class="page-title">About</h1>

    <p>
      Welcome to CamStem. This software empowers you to separate audio stems,
      integrate with editing workflows, and more. Below are some of the individuals
      who have contributed to this project.
    </p>

    <!-- Credits in 2-column format (like before) -->
    <div class="credits-grid" style="margin: 1.5rem 0;">
      <!-- 10 placeholders for contributor names -->
      <div>Name 1</div>
      <div>Name 2</div>
      <div>Name 3</div>
      <div>Name 4</div>
      <div>Name 5</div>
      <div>Name 6</div>
      <div>Name 7</div>
      <div>Name 8</div>
      <div>Name 9</div>
      <div>Name 10</div>
    </div>

    <!-- Back to Menu button (use .actionButton) -->
    <button
      class="actionButton"
      onclick="window.location.href='dashboard.html'"
      style="width: 100%;"
    >
      Back to Menu
    </button>
  </div>
</body>
</html>
```

### src\frontend\update.html

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

### src\frontend\premiere.html

``` 
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>CamStem - Premiere Integration</title>
  <!-- Include Tailwind + Custom Index CSS -->
  <link rel="stylesheet" href="tailwind-output.css">
  <link rel="stylesheet" href="index.css">
</head>
<body>
  <div class="container" style="max-width: 480px;">
    <!-- Page title -->
    <h1 class="page-title">Premiere Pro Integration</h1>

    <p style="margin-bottom: 1.5rem;">
      Premiere automation will be set up here. Feature coming soon!
    </p>

    <!-- Back to Menu button -->
    <button
      class="actionButton"
      onclick="window.location.href='dashboard.html'"
      style="width: 100%;"
    >
      Back to Menu
    </button>
  </div>
</body>
</html>
```

### src\frontend\splitter.css

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

### src\backend\preload.js

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
  selectPath: async (type, callback) => {
    const path = await ipcRenderer.invoke('select-path', type);
    callback(path);
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
});
```

### src\backend\main.js

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
    width: 800,
    height: 600,
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

    // FIX: rename "b" to "byte" for clarity
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
  autoUpdater.checkForUpdates(); 
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

/**
 *  We keep 'demucs-log', 'demucs-success', 'demucs-error' exactly the same
 *  plus the partial approach on stderr if you want it. 
 */
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

  // Instead of execFile, use spawn for real-time line-based output
  const demucsProcess = spawn(demucsPath, commandArgs, {
    shell: false,
    cwd: path.dirname(demucsPath),
  });

  // stdout => forward to 'demucs-log'
  demucsProcess.stdout.on('data', (data) => {
    const out = data.toString();
    logToFile(`Demucs stdout: ${out}`);
    event.reply('demucs-log', out);
  });

  // stderr => forward to 'demucs-log'
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
 * TAILING THE LOG FILE (Optional)
 * This is the "new logic" that streams lines from demucs-log.txt
 * in real time, without removing your existing 'demucs-log' events.
 *************************************************************/

function tailLogFile(sender) {
  const logPath = logFilePath; // same userData/demucs-log path
  let fileOffset = 0;
  let tailInterval = null;

  fs.open(logPath, 'r', (err, fd) => {
    if (err) {
      console.error('Failed to open demucs-log.txt for tailing:', err);
      return;
    }

    tailInterval = setInterval(() => {
      fs.stat(logPath, (statErr, stats) => {
        if (statErr) {
          console.error('stat error:', statErr);
          return;
        }
        // If file grew
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

// The renderer can request "startTailLog"
ipcMain.on('start-tail-log', (evt) => {
  tailLogFile(evt.sender);
});
```

### package.json

``` 
{
  "name": "CamStem",
  "version": "0.9.9",
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
        "to": "app/src/assets"
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
      "icon": "assets/icon.icns",
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
      "src/frontend/**/*"
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

