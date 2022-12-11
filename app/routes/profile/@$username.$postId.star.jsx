import { updatePostStar } from "~/utils/post.server";
import { requireUserLogin } from "~/utils/auth.server";

export async function action({ request }) {
  // Get the data from the form.
  const form = await request.formData();
  const postId = form.get("postId");
  const redirectUrl = form.get("redirectUrl");
  const userId = await requireUserLogin(request);

  return await updatePostStar(postId, userId, redirectUrl);
}
