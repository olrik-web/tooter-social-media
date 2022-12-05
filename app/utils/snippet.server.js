import { json, redirect } from "@remix-run/node";
import connectDb from "~/db/connectDb.server";
import { getUserId } from "./auth.server";

/*
 * This function creates a snippet document in the database and returns the snippet document.
 * It is called when the user clicks the create snippet button.
 */
export async function createSnippet(request, title, description, snippetFolder, code, language) {
  // Connecting to the database
  const db = await connectDb();
  // Checking if the title is empty and returning an error message and a status code of 400 (Bad Request) if it is.
  if (!title) {
    return json({ title: { message: "Title cannot be empty.", status: 400 } });
  }

  if (!code) {
    return json({ code: { message: "Code cannot be empty.", status: 400 } });
  }
  // Checking if the language is empty and returning an error message and a status code of 400 (Bad Request) if it is.
  if (!language) {
    return json({ language: { message: "Language cannot be empty.", status: 400 } });
  }

  // Getting the user from the request and returning an error message and a status code of 400 (Bad Request) if the user is not found.
  const userId = await getUserId(request);
  if (!userId) {
    return json({ error: "User not found.", status: 400 });
  }

  try {
    // Creating the snippet document in the database
    const newSnippet = await db.models.snippets.create({
      title: title,
      description: description,
      code: code,
      language: language,
      createdBy: userId,
      snippetFolder: snippetFolder,
    });
    console.log("Snippet created successfully.");
    return newSnippet;
  } catch (error) {
    console.log(error);
    return json({ error: "Snippet could not be created.", status: 400 });
  }
}

/*
 * This function returns the snippet document with the given id.
 */
export async function getSnippet(id) {
  // Connecting to the database
  const db = await connectDb();

  // Getting the snippet document with the given id
  const snippet = await db.models.snippets.findById(id);
  return snippet;
}

/*
 * This function returns all the snippet documents in the database.
 */
export async function getSnippets() {
  // Connecting to the database
  const db = await connectDb();

  // Getting all the snippet documents in the database
  const snippets = await db.models.snippets.find();
  return snippets;
}

/*
 * This function updates the snippet document with the given id and returns the updated snippet document.
 */
export async function updateSnippet(snippetId, title, description, snippetFolder, code, language) {
  // Connecting to the database
  const db = await connectDb();

  // Getting the snippet document with the given id
  const snippet = await db.models.snippets.findById(snippetId);

  // Updating the snippet document
  snippet.title = title;
  snippet.description = description;
  snippet.snippetFolder = snippetFolder;
  snippet.code = code;
  snippet.language = language;

  // Saving the updated snippet document
  const updatedSnippet = await snippet.save();
  return updatedSnippet;
}

/*
 * This function deletes the snippet document with the given id.
 */
export async function deleteSnippet(id, userId) {
  // Connecting to the database
  const db = await connectDb();

  // Getting the snippet document with the given id
  const snippet = await db.models.snippets.findById(id);

  if (snippet.createdBy != userId) {
    return redirect("/snippets");
  } else {
    try {
      // Deleting the snippet document
      await snippet.remove();
      return redirect("/snippets/" + snippet.snippetFolder);
    } catch (error) {
      console.log(error);
      return json({ error: true, status: 400 });
    }
  }
}

// This function updates the snippet favorite field of the snippet document with the given id.
export async function updateSnippetFavorite(snippetId, userId) {
  // Connecting to the database
  const db = await connectDb();

  // Getting the snippet document with the given id
  const snippet = await db.models.snippets.findById(snippetId);
  if (snippet.createdBy != userId) {
    return redirect("/snippets");
  } else {
    // Updating the snippet favorite field
    snippet.favorite = !snippet.favorite;

    // Saving the updated snippet document
    await snippet.save();

    redirect("/snippets/" + snippet.snippetFolder);
  }
}
