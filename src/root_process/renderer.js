// renderer.js - Handles UI interactions and login logic

// Function to handle the login process
function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("errorMessage");

  // Clear any previous error messages
  errorMessage.classList.add("hidden");
  errorMessage.innerText = "";

  // Call verifyLogin via authAPI from preload.js
  const result = window.authAPI.verifyLogin(username, password);

  if (result.success) {
    // Redirect to dashboard if login is successful
    window.location.href = "../main_process/dashboard.html";
  } else {
    // Display error messages based on login result
    if (result.error === "USER_NOT_FOUND") {
      errorMessage.innerText = "Username not found. Please check your username.";
    } else if (result.error === "INCORRECT_PASSWORD") {
      errorMessage.innerText = "Incorrect password. Please try again.";
    } else if (result.error === "ACCOUNT_INVALID") {
      errorMessage.innerText = "Account is invalid. Please check your subscription.";
    }
    errorMessage.classList.remove("hidden"); // Show error message
  }
}

// Logout function to redirect back to login page
function logout() {
  window.location.href = "../login_process/login.html"; // Redirect to login page
}

// Function for Forgot Password placeholder
function forgotPassword() {
  alert("Forgot Password feature coming soon!");
}

// Handle pressing Enter to submit login
document.getElementById("password").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    login();
  }
});
