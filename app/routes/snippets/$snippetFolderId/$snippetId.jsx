import { json, redirect } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import SnippetCard from "~/components/SnippetCard";
import connectDb from "~/db/connectDb.server";
import { getUserId } from "~/utils/auth.server";

export async function loader({ params, request }) {
  // Get the user that is currently logged in.
  const userId = await getUserId(request);
  // If the user is not logged in, redirect them to the login page.
  if (!userId) {
    return redirect("/login");
  }

  // Find the snippet using the snippetId from the URL.
  const db = await connectDb();

  // Finding the snippet by the snippetId and userId ensures that the user can only access their own snippets.
  const snippet = await db.models.snippets.findOne({
    _id: params.snippetId,
    createdBy: userId,
  });
  const snippetFolder = await db.models.snippetFolders.findOne({
    _id: params.snippetFolderId,
    createdBy: userId,
  });
  return json({snippet, snippetFolder});
}

export default function Details() {
  const {snippet, snippetFolder} = useLoaderData();
  const fetcher = useFetcher();

  // When the user clicks the delete button, the form is submitted and the action is handled by the delete route.
  function onSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    fetcher.submit(formData, {
      method: "post",
      action: `/snippets/${snippet.folderId}/${snippet._id}/delete`,
    });
  }

  // Check if we're submitting the form which matches the snippetId we're trying to delete. 
  const isDeleting = fetcher.submission?.formData.get("id") === snippet?._id || false;
  // Check if the snippet was deleted successfully.
  const isFailedDelete = fetcher.data?.error && fetcher.submission?.formData.get("id") === snippet?._id;
  
  return (
    <SnippetCard
      snippet={snippet}
      snippetFolder={snippetFolder}
      details={true}
      isDeleting={isDeleting}
      onSubmit={onSubmit}
      isFailedDelete={isFailedDelete}
    />
  );
}
