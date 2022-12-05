import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import connectDb from "~/db/connectDb.server";
import { getUserId } from "~/utils/auth.server";
import SnippetForm from "~/components/SnippetForm";
import { updateSnippet } from "~/utils/snippet.server";

export async function loader({ params, request }) {
  // Get the user that is currently logged in.
  const userId = await getUserId(request);
  // If the user is not logged in, redirect them to the login page.
  if (!userId) {
    return redirect("/login");
  }

  // Find the snippet that is being edited and return it with the snippetFolder.
  const db = await connectDb();
  // Find snippet by id where field userId is equal to the current user id.
  const snippet = await db.models.snippets.findOne({
    _id: params.snippetId,
    createdBy: userId,
  });
  const snippetFolders = await db.models.snippetFolders.find({ createdBy: userId });

  return json({ snippet, snippetFolders });
}

export default function Edit() {
  const loaderData = useLoaderData();
  const actionData = useActionData();

  return (
    <div>
      <h4 className="text-3xl font-bold">New Snippet</h4>
      <hr className="my-4" />
      <SnippetForm errors={actionData} snippetFolders={loaderData.snippetFolders} snippet={loaderData.snippet} />
    </div>
  );
}

export async function action({ request, params }) {
  const form = await request.formData();
  const title = form.get("title");
  const description = form.get("description");
  const snippetFolder = form.get("snippetFolder");
  const code = form.get("code");
  const language = form.get("language");

  // Update the snippet and return the response.
  return await updateSnippet(params.snippetId, title, description, snippetFolder, code, language);
}

// Catch any unexpected errors and display them to the user.
export function ErrorBoundary({ error }) {
  return (
    <div className="text-red-500 text-center">
      <h1 className="text-2xl font-bold">Error</h1>
      <p>{error.message}</p>
    </div>
  );
}
