import { updatePostBookmark } from "~/utils/post.server";
import { requireUserLogin } from "~/utils/auth.server";

export async function action({ request }) {
  // Get the data from the form.
  const form = await request.formData();
  const postId = form.get("postId");
  const redirectUrl = form.get("redirectUrl");
  const userId = await requireUserLogin(request);

  // If the action is log out, log the user out. TODO: Delete this
  //   if (action === "logOut") {
  //     return await logOut(request);
  //   }

  return await updatePostBookmark(postId, userId, redirectUrl);

  // TODO: MÅSKE IKKE NØDVENDIG
  // upgrade people to https automatically

  //   let url = new URL(request.url);
  //   let hostname = url.hostname;
  //   let proto = request.headers.get("X-Forwarded-Proto") ?? url.protocol;

  //   url.host = request.headers.get("X-Forwarded-Host") ?? request.headers.get("host") ?? url.host;
  //   url.protocol = "https:";

  //   if (proto === "http" && hostname !== "localhost") {
  //     return redirect(url.toString(), {
  //       headers: {
  //         "X-Forwarded-Proto": "https",
  //       },
  //     });
  //   }
  //   return {};
}
