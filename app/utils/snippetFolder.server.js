import { json } from "@remix-run/node";
import connectDb from "~/db/connectDb.server";
import { getUserId } from "./auth.server";
// TODO: Delte this file
/*
 * This function creates a snippet folder document in the database and returns the snippet folder document.
 */
export async function createSnippetFolder(request, name) {

  // Connecting to the database
  const db = await connectDb();

  // Getting the user from the request and returning an error message and a status code of 400 (Bad Request) if the user is not found.
  const userId = await getUserId(request);
  if (!userId) {
    return json({ error: "User not found.", status: 400 });
  }



  if (!name || name === "") {
    return json({ name: { message: "Name cannot be empty.", status: 400 } });
  }

        console.log("Creating snippet folder...");


  const trimmedName = name.trim();


  // Creating the snippet folder document in the database
  const newSnippetFolder = await db.models.snippetFolders.create({
    name: trimmedName,
    createdBy: userId,
  });
  return newSnippetFolder;
}

/*
 * This function updates the snippet folder name and returns the updated snippet folder document.
 */
export async function updateSnippetFolder(request, id, name) {
  // Connecting to the database
  const db = await connectDb();

  // Getting the user from the request and returning an error message and a status code of 400 (Bad Request) if the user is not found.
  const userId = await getUserId(request);
  if (!userId) {
    return json({ error: "User not found.", status: 400 });
  }

  if (!name) {
    return json({ name: { message: "Name cannot be empty.", status: 400 } });
  }

  // Getting the snippet folder document with the given id
  const snippetFolder = await db.models.snippetFolders.findById(id);

  // Checking if the snippet folder document is found and returning an error message and a status code of 400 (Bad Request) if it is not found. Also checking if the user is the owner of the snippet folder document.
  if (!snippetFolder || snippetFolder.createdBy != userId) {
    return json({ error: "Snippet folder not found.", status: 400 });
  }

  // Updating the snippet folder name
  snippetFolder.name = name;
  await snippetFolder.save();

  return snippetFolder;
}

/*
 * This function deletes the snippet folder document with the given id.
 */
export async function deleteSnippetFolder(request, id) {
  // Connecting to the database
  const db = await connectDb();

  // Getting the user from the request and returning an error message and a status code of 400 (Bad Request) if the user is not found.
  const userId = await getUserId(request);
  if (!userId) {
    return json({ error: "User not found.", status: 400 });
  }

  // Getting the snippet folder document with the given id
  const snippetFolder = await db.models.snippetFolders.findById(id);

  // Checking if the snippet folder document is found and returning an error message and a status code of 400 (Bad Request) if it is not found. Also checking if the user is the owner of the snippet folder document.
  if (!snippetFolder || snippetFolder.createdBy != userId) {
    return json({ error: "Snippet folder not found.", status: 400 });
  }

  // Delete all the snippet documents in the snippet folder document.
  await db.models.snippets.deleteMany({ snippetFolder: id });

  // Deleting the snippet folder document
  await snippetFolder.remove();
}
