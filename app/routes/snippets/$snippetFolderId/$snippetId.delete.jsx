import { redirect } from "@remix-run/node";
import { deleteSnippet } from "~/utils/snippet.server";
import { getUserId } from "../../../utils/auth.server";

export async function action({ request }) {
  // Get the user that is currently logged in.
  const userId = await getUserId(request);
  const formData = await request.formData();
  const snippetId = formData.get("id");
  
  // If the user is not logged in, redirect them to the login page.
  if (!userId) {
    return redirect("/login");
  }
  // Delete the snippet and redirect to the snippets page. Check if the snippet belongs to the user.
  return await deleteSnippet(snippetId, userId);
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
