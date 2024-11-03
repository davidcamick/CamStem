// auth.js - Handles login verification

// Placeholder data for valid accounts
const accounts = {
  user: { password: "pass", isValid: true },
  trialuser: { password: "trial", isValid: false }, // Example of an invalid account
};

// Function to verify login credentials
function verifyLogin(username, password) {
  const account = accounts[username];

  // Check if username exists
  if (!account) {
    return { success: false, error: "USER_NOT_FOUND" };
  }

  // Check if password is correct
  if (account.password !== password) {
    return { success: false, error: "INCORRECT_PASSWORD" };
  }

  // Check if account is valid
  if (!account.isValid) {
    return { success: false, error: "ACCOUNT_INVALID" };
  }

  // If all checks pass, login is successful
  return { success: true };
}

// Export the verifyLogin function
module.exports = { verifyLogin };
