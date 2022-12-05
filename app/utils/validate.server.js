// This function checks if the username is empty and if it is it returns an error message.
export function validateUsername(username) {
  if (!username || username.length === 0) return "Please enter a username.";
}

// This function checks if the password is at least 6 characters long and returns an error message if it is not.
export function validatePasswords(password) {
  if (!password) return "Please enter a password.";
  if (password.length < 6) {
    return "Please enter a password that is at least 6 characters long.";
  }
}

// This function compares the password and password confirmation and returns an error message if they do not match.
export function validatePasswordConfirmation(password, passwordConfirmation) {
  if (!passwordConfirmation) return "Please repeat your password."; 
  if (password !== passwordConfirmation) return "Passwords do not match.";
}

// This function checks if the name is empty and returns an error message if it is.
export function validateName(name) {
  if (!name || name.length === 0) return "Please enter a name.";
}
