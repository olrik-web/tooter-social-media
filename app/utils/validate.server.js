// This function checks if the email is valid using a regular expression and returns an error message if it is not. 
export function validateEmail(email) {
  var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (!email || !validRegex.test(email)) {
    return "Please enter a valid email address (e.g. example@mail.com).";
  }
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
  if (!name) return "Please enter a name.";
}
