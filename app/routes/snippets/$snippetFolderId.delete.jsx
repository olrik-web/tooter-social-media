import { redirect } from "@remix-run/node";
import { deleteSnippetFolder } from "~/utils/snippetFolder.server";

export async function action({ request, params }) {
  const snippetFolderId = params.snippetFolderId;
  try {
    await deleteSnippetFolder(request, snippetFolderId);
  } catch (error) {
    console.log(error);
  }
  return redirect("/snippets");
}
