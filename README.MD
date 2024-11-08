
---

# **CamStem: Comprehensive Project Documentation**

### **Project Name**
**CamStem**

### **Project Purpose**
CamStem is a desktop application for audio processing, built with Electron, Tailwind CSS, and JavaScript. It allows users to paste an audio link from platforms like Spotify, YouTube, or SoundCloud, which can be processed into a format suitable for further manipulation and use. CamStem is ideal for users who want to isolate different components of a song for remixing, analysis, or production.

---

## **File Structure**

```plaintext
CamStem/
├── src/
│   ├── assets/
│   │   ├── account.svg              # Account icon for user settings
│   │   ├── home.svg                 # Home icon for navigation back to the dashboard
│   │   ├── logo.ico                 # App icon for Electron window and taskbar
│   │   ├── logout.svg               # Logout icon for user logout functionality
│   │   └── refresh.svg              # Refresh icon for reloading pages
│   │
│   ├── configurations/
│   │   └── tailwind.config.js       # Tailwind CSS configuration file with custom styles and scan paths
│   │
│   ├── cosmetic_process/
│   │   ├── input.css                # Tailwind source file with base, components, and utilities
│   │   └── tailwind.css             # Compiled CSS from Tailwind CLI
│   │
│   ├── login_process/
│   │   ├── auth.js                  # Authentication logic for user login
│   │   └── login.html               # Login page HTML with styling for authentication
│   │
│   ├── main_process/
│   │   ├── dashboard.html           # Main dashboard HTML, including buttons for audio options
│   │   ├── download.html            # Audio downloading interface with input fields and action buttons
│   │   └── account.html             # Account management page for viewing/editing user information
│   │
│   ├── root_process/
│   │   ├── main.js                  # Electron main process setup, window configuration, and app menu
│   │   ├── preload.js               # Exposes backend functions via contextBridge for secure communication
│   │   └── renderer.js              # Manages UI interactions and login/logout logic
│   │
│   └── cosmetic_process/
│       ├── input.css                # Tailwind source file with base, components, and utilities
│       └── tailwind.css             # Compiled CSS from Tailwind CLI
│
├── .gitignore                        # Excludes node_modules and unnecessary files from version control
├── package.json                      # Project configuration, dependencies, and build scripts
├── package-lock.json                 # Dependency lock file with exact versions
└── README.md                         # Project documentation, usage instructions, and build steps
```

---

## **Detailed File Summaries**

### **`src/assets/`**
- **`account.svg`**: Icon used for user account management.
- **`home.svg`**: Icon displayed on pages for returning to the dashboard.
- **`logo.ico`**: The app icon used in the Electron window and taskbar.
- **`logout.svg`**: Icon for the logout action on the user interface.
- **`refresh.svg`**: Icon used on pages to reload content with a single click.

### **`src/configurations/`**
- **`tailwind.config.js`**: Tailwind configuration file where custom colors, font sizes, and shadow effects are defined:
  - **`content` paths**: Specifies which files Tailwind should scan for CSS classes, covering all HTML and JS files within `src`.
  - **Custom Colors**:
    - `error-red`: `#ef4444`
    - `blue-primary`: `#3b82f6`
    - `blue-hover`: `#2563eb`
  - **Font Sizes**: Custom font sizes for consistent text styling.

### **`src/cosmetic_process/`**
- **`input.css`**: The source CSS file processed by Tailwind. Includes directives for base, components, and utilities:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```
- **`tailwind.css`**: The compiled CSS file generated by Tailwind CLI. It is linked to `login.html`, `dashboard.html`, and `download.html` for consistent styling.

### **`src/login_process/`**
- **`auth.js`**: Manages user authentication. Contains functions for username and password validation, with specific error messages:
  - **`USER_NOT_FOUND`**: Error when no account matches the username.
  - **`INCORRECT_PASSWORD`**: Error when an incorrect password is entered.
  - **`verifyLogin`**: Checks username and password, returning relevant error messages on failure.
- **`login.html`**: Displays login fields and error messages, using `tailwind.css` for consistent styling. Connected to `renderer.js` for login functionality.

### **`src/main_process/`**
- **`dashboard.html`**: Main user interface following login, featuring buttons for various audio processing options.
- **`download.html`**: Interface for downloading audio with input fields for links and a button to initiate the process.
- **`account.html`**: A page for managing user account information (future functionality).

### **`src/root_process/`**
- **`main.js`**: Entry point for the Electron app, managing:
  - **BrowserWindow Configuration**: Configures the main application window, including title and icon.
  - **App Menu**: Standard menus with `File`, `Edit`, `View`, `Window`, and a custom `Help` section.
- **`preload.js`**: Manages secure communication between frontend and backend using Electron’s `contextBridge`. It exposes functions for verifying login and selecting download paths.
- **`renderer.js`**: Handles front-end interactions, primarily the login verification and UI updates.

---

## **How the Program Works**

1. **App Launch**:
   - `main.js` initializes an Electron `BrowserWindow`, loading `login.html` as the entry page.
   - The `preload.js` script securely exposes backend functionality.

2. **Login Flow**:
   - Credentials are entered on `login.html` and verified via `authAPI.verifyLogin()`.
   - Successful login redirects to `dashboard.html`, while errors show feedback near the username and password fields.

3. **Dashboard Functionality**:
   - Buttons on `dashboard.html` allow users to access different features for processing audio, such as downloading audio, managing accounts, and viewing information about CamStem.

4. **Download Page**:
   - Users can enter audio links (from Spotify, YouTube, or SoundCloud) on `download.html`.
   - A button initiates the download process (without any Python dependencies).

5. **Help Menu**:
   - A custom Help menu provides links to documentation and support resources.

6. **Error Handling**:
   - Authentication errors are managed in `auth.js`.

---

## **Common Preferences and Requests**

### **File Structure and Organization**
- **Modular Structure**: Separate folders for configurations, assets, authentication, and main interface for better organization.
- **Electron Preferences**: Provides a straightforward application structure for ease of distribution and usage.

### **Styling Preferences**
- **Modern, "Bubbly" Aesthetic**: Rounded buttons, soft gradients, and a clean layout created using Tailwind CSS.
- **Tailwind Customization**: Custom color scheme and font sizes ensure a cohesive look across pages.

### **Git Workflow**
- **Concise Commit Messages**: Example format used in code updates:
  ```bash
  git add .
  git commit -m "Updated dashboard functionality and styles"
  git push
  ```

---

