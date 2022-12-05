import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useTransition } from "@remix-run/react";
import SnippetCard from "~/components/SnippetCard";
import SnippetForm from "~/components/SnippetForm";
import connectDb from "~/db/connectDb.server";
import { createSnippet } from "~/utils/snippet.server";
import { getUserId } from "../../../utils/auth.server";

export async function loader({ request }) {
  // Get the user that is currently logged in.
  const userId = await getUserId(request);
  // If the user is not logged in, redirect them to the login page.
  if (!userId) {
    return redirect("/login");
  }

  // Display the user's snippet folders.
  const db = await connectDb();
  const snippetFolders = await db.models.snippetFolders.find({ createdBy: userId });

  return json(snippetFolders);
}

export default function Create() {
  const actionData = useActionData();
  const snippetFolders = useLoaderData();
  const transition = useTransition();

  // If we are creating a snippet or loading the snippet we can display the snippet. Otherwise, we can display the form.
  const isCreating =
    (transition.state === "submitting" || transition.state === "loading") &&
    transition.submission?.formData.get("_action") === "create";
  // We use optimistic UI to update the UI before the server responds. This is done by using the useTransition hook.
  return isCreating ? (
    <SnippetCard snippet={Object.fromEntries(transition.submission?.formData)} details={true} />
  ) : (
    <div>
      <h4 className="text-3xl font-bold">New Snippet</h4>
      <hr className="my-4" />
      <SnippetForm errors={actionData} snippetFolders={snippetFolders} />
    </div>
  );
}

export async function action({ request }) {
  // Get the data from the form.
  const form = await request.formData();
  const title = form.get("title");
  const description = form.get("description");
  const snippetFolder = form.get("snippetFolder");
  const code = form.get("code");
  const language = form.get("language");

  // Create a new snippet. This function is defined in ~/utils/snippet.server.js.
  const snippet = await createSnippet(request, title, description, snippetFolder, code, language);
  // Check if the snippet was created successfully and redirect to the snippet folder page.
  if (snippet._id) {
    return redirect(`/snippets/${snippetFolder}/${snippet._id}`);
  } else {
    return json("Error creating snippet", { status: 500 });
  }
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
