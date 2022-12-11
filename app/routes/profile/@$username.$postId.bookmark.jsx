import { updatePostBookmark } from "~/utils/post.server";
import { requireUserLogin } from "~/utils/auth.server";

export async function action({ request }) {
  // Get the data from the form.
  const form = await request.formData();
  const postId = form.get("postId");
  const redirectUrl = form.get("redirectUrl");
  const userId = await requireUserLogin(request);

  return await updatePostBookmark(postId, userId, redirectUrl);
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
