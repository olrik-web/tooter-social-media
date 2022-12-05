import bcrypt from "bcryptjs";
import connectDb from "~/db/connectDb.server";

/*
 * This is one of the functions that is called when the user clicks sign up.
 * It creates a user document in the database and returns the user document.
 */
export async function createUser({ email, password, firstName, lastName }) {
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
  const newUser = await db.models.users.create({
    email: email,
    password: hashPassword,
    profile: {
      firstName: firstName,
      lastName: lastName,
    },
  });
  return newUser;
}

// This function compares the password with the hash stored in the database and returns true or false depending on if they match or not.
export async function comparePassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}
