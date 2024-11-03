module.exports = {
  content: [
    "./src/login_process/*.html",      // Login page HTML
    "./src/main_process/*.html",       // Dashboard page HTML
    "./src/root_process/*.js",         // All root process JavaScript files
    "./src/login_process/*.js",        // Authentication logic in login process
  ],
  theme: {
    extend: {
      colors: {
        'error-red': '#ef4444',
        'blue-primary': '#3b82f6',
        'blue-hover': '#2563eb',
        'gray-primary': '#6b7280',
        'gray-hover': '#4b5563',
        'logout-red': '#dc2626',
      },
      fontSize: {
        'smaller': '0.875rem',
        'large': '1.5rem',
      },
      boxShadow: {
        'custom': '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};
