import { json, redirect } from "@remix-run/node";
import { Outlet, useActionData, useLoaderData } from "@remix-run/react";
import NavigationMenu from "~/components/NavigationMenu";
import connectDb from "~/db/connectDb.server";
import { createSnippetFolder } from "~/utils/snippetFolder.server";
import { getUserId } from "../utils/auth.server";


export const loader = async ({ request }) => {
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
};

export default function Snippets() {
  const snippetFolders = useLoaderData();
  const actionData = useActionData();

  return (
    <div>
      <NavigationMenu actionData={actionData} snippetFolders={snippetFolders} />
      <div className="flex flex-col ml-80 mr-8 my-4 mt-24">
        <div className="mx-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export async function action({ request }) {
  const form = await request.formData();
  const name = form.get("name");
  const snippetFolder = await createSnippetFolder(request, name);
  // Check if the snippet folder was created successfully and redirect to the snippet folder page.
  if (snippetFolder._id) {
    return redirect(`/snippets/${snippetFolder._id}`);
  }
  return snippetFolder;
}

export function ErrorBoundary({ error }) {
  return (
    <div className="text-red-500 text-center">
      <h1 className="text-2xl font-bold">Error</h1>
      <p>{error.message}</p>
    </div>
  );
}
