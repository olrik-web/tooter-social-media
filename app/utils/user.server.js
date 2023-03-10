import { json } from "@remix-run/node";
import bcrypt from "bcryptjs";
import connectDb from "~/db/connectDb.server";

/*
 * This is one of the functions that is called when the user clicks sign up.
 * It creates a user document in the database and returns the user document.
 */
export async function createUser({ username, password, firstName, lastName }) {
  try {
    // Connecting to the database
    const db = await connectDb();

    /*
     * Hashing the password with bcrypt and storing it in the database. The salt is used to make the hash unique.
     * The higher the number the more secure the hash is but it will take longer to hash the password.
     * 10 is a good number to use.
     */
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    // Creating a user document in the database with the hashed password.
    const newUser = await db.models.User.create({
      username,
      password: hashPassword,
      firstName,
      lastName,
      avatar: `https://avatars.dicebear.com/api/bottts/${username}.svg`,
    });
    return newUser;
  } catch (error) {
    console.log(error);
    return json({ error: "Something went wrong." });
  }
}

// This function compares the password with the hash stored in the database and returns true or false depending on if they match or not.
export async function comparePassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}
