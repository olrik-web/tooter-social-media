import { redirect } from "@remix-run/node";

export async function loader({ request }) {
  // Redirect to public/local.
  return redirect("/public/local");
}
