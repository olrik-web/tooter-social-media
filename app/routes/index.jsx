import { redirect } from "@remix-run/node";
import { getUser } from "~/utils/auth.server";

export async function loader({ request }) {
  const user = await getUser(request);
  // If the user is not logged in, redirect to the explore page.
  if (!user) {
    return redirect("/explore");
  }
  // Otherwise, redirect to the home page. Because there won't be any posts to show on the explore page.
  return redirect("/home");
}
