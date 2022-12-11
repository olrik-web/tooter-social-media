import { json, redirect, createCookieSessionStorage } from "@remix-run/node";
import { comparePassword, createUser } from "./user.server";
import connectDb from "~/db/connectDb.server";
import { validateUsername, validateName, validatePasswordConfirmation, validatePasswords } from "./validate.server";

// The secret is used as an extra layer of security in the cookie-based session.
const { SECRET } = process.env;

// Creating a cookie session storage.
const storage = createCookieSessionStorage({
  cookie: {
    name: "tooter-session", 
    secure: process.env.NODE_ENV === "production",
    secrets: [SECRET],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
  },
});

/*
 * This function is called when the user clicks sign up.
 * It should check if a user with the same username already exists and if not create a new user.
 * It should also create a session for the user and redirect them to /explore.
 */
export async function signup(username, password, passwordConfirmation, firstName, lastName) {
  const errors = {
    username: { message: validateUsername(username) },
    password: { message: validatePasswords(password) },
    passwordConfirmation: { message: validatePasswordConfirmation(password, passwordConfirmation) },
    firstName: { message: validateName(firstName) },
    lastName: { message: validateName(lastName) },
  };

  if (
    errors.username.message ||
    errors.password.message ||
    errors.firstName.message ||
    errors.lastName.message ||
    errors.passwordConfirmation.message
  ) {
    return json(errors);
  }

  // Connecting to the database
  const db = await connectDb();

  // Checking if a user with the same username exist
  const userExists = await db.models.User.findOne({
    username,
  });

  // If a user with the same username exists we return an error message and a status code of 400 (Bad Request).
  if (userExists) {
    return json({ username: { message: "A user already exists with that username.", status: 400 } });
  }

  // Creating a user document in the database
  const newUser = await createUser({ username, password, passwordConfirmation, firstName, lastName });

  // If the user document is not created we return an error message and a status code of 400.
  if (!newUser) {
    return json({
      error: "Something went wrong trying to create a new user.",
      status: 400,
    });
  }

  // Getting the newly created user's ID.
  const user = await db.models.User.findOne({ username }, { _id: 1 });
  // Creating a session with user id and redirect to /explore. We convert the ObjectId to a JSON string.
  return createUserSession(JSON.stringify(user._id), "/explore");
}

export async function editUser(username, password, passwordConfirmation, firstName, lastName, currentUser) {
  const errors = {
    username: { message: validateUsername(username) },
    password: { message: validatePasswords(password) },
    passwordConfirmation: { message: validatePasswordConfirmation(password, passwordConfirmation) },
    firstName: { message: validateName(firstName) },
    lastName: { message: validateName(lastName) },
  };

  if (
    errors.username.message ||
    errors.password.message ||
    errors.firstName.message ||
    errors.lastName.message ||
    errors.passwordConfirmation.message
  ) {
    return json(errors);
  }

  try {
    // Connecting to the database
    const db = await connectDb();

    // Check if a new username is entered
    if (username !== currentUser.username) {
      // Checking if a user with the same username exist
      const userExists = await db.models.User.findOne({
        username,
      });

      // If a user with the same username exists we return an error message and a status code of 400 (Bad Request).
      if (userExists) {
        return json({ username: { message: "A user already exists with that username.", status: 400 } });
      }
    }

    // Updating a user document in the database
    currentUser.username = username;
    currentUser.firstName = firstName;
    currentUser.lastName = lastName;
    if (password) {
      currentUser.password = password;
    }
    await currentUser.save();

    return redirect(`/profile/@${currentUser.username}`);
  } catch {
    return json({
      error: "Something went wrong trying to edit the user.",
      status: 400,
    });
  }
}

// This function creates a session for the user and redirects them to a page.
export async function createUserSession(userId, redirectTo) {
  // Getting the session.
  const session = await storage.getSession();
  // Setting the user id in the session.
  session.set("userId", userId);
  // Committing the session and returning a redirect response with the cookie session.
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

// Getting the user that is currently logged in from the database.
export async function getUser(request) {
  const db = await connectDb();

  // Getting the user id from the cookie session.
  const userId = await getUserId(request);

  // If the user id is not found we return null.
  if (!userId) return null;

  try {
    // Getting the user from the database using the user id.
    const user = await db.models.User.findById(userId);
    return user;
  } catch {
    return json({
      error: "Something went wrong trying to get the user.",
      status: 400,
    });
  }
}

// This function gets a user id from the cookie session.
export async function getUserId(request) {
  // Getting the cookie session from the request headers.
  const session = await getUserSession(request);

  // Parsing the JSON into an object
  const userId = session.get("userId");

  // If the user id is not found we return null.
  if (!userId) return null;

  // We parse the user id to remove quotation marks
  return JSON.parse(userId);
}

// This function is called in most loader functions to check if the user is logged in and if not redirect them to /login.
export async function requireUserLogin(request) {
  const userId = await getUserId(request);

  // If the user is not found we return a redirect response to /login.
  if (!userId) {
    throw redirect("/login");
  }

  return userId;
}

// This function gets the request headers cookie session
function getUserSession(request) {
  return storage.getSession(request.headers.get("Cookie"));
}

// This function is used to destroy the cookie session and redirect the user to the login page.
export async function logOut(request) {
  const session = await getUserSession(request);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}

/*
 * This function is called when the user clicks login.
 * It should check if a user with the same username exists and if the password is correct.
 * It should also create a session for the user and redirect them to /explore.
 */
export async function logIn(username, password) {
  const db = await connectDb();
  // Checking if a user with the same username exist
  const userExists = await db.models.User.findOne({
    username,
  });

  // If a user with the same username does not exist we return an error message and a status code of 400 (Bad Request).
  if (!userExists) {
    return json({
      username: {
        message: "Password or username is incorrect.",
        fields: { username, password },
        status: 400,
      },
    });
  }

  // Checking if the password is correct
  const isPasswordCorrect = await comparePassword(password, userExists.password);

  // If the password is not correct we return an error message and a status code of 400.
  if (!isPasswordCorrect) {
    return json({
      password: {
        message: "Password or username is incorrect.",
        fields: { username, password },
        status: 400,
      },
    });
  }

  // Creating a session with user id and redirect to /explore. We convert the ObjectId to a JSON string.
  return createUserSession(JSON.stringify(userExists._id), "/explore");
}
