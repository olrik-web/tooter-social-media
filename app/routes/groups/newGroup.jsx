import { useActionData, useTransition } from "@remix-run/react";
import GroupForm from "~/components/GroupForm";
import GroupCard from "~/components/GroupCard";
import NavigateBackButton from "~/components/NavigateBackButton";
import { getUser, requireUserLogin } from "~/utils/auth.server";
import { json, redirect } from "@remix-run/node";
import { createGroup } from "~/utils/group.server";

export default function NewGroup() {
  const actionData = useActionData();
  const transition = useTransition();

  // Check if we are in a loading or submitting state and if the action is "create".
  const isCreating =
    (transition.state === "submitting" || transition.state === "loading") && transition.submission?.formData.get("_action") === "create";

  // If we are in a loading or submitting state we show the post card.
  // This is done to show the user what the post will look like before the request has made it to the server.
  // This optimistic UI pattern is used to make the app feel more responsive.
  return isCreating ? (
    <>
      <NavigateBackButton showText={true} />
      <GroupCard group={Object.fromEntries(transition.submission?.formData)} />
    </>
  ) : (
    // If we are not in a loading or submitting state we show the post form.
    <div>
      <NavigateBackButton showText={true} />
      <h1 className="text-3xl font-bold border border-gray-600 p-4">New Group</h1>
      <GroupForm errors={actionData} isCreating={isCreating} />
    </div>
  );
}

export async function action({ request }) {
  // Require the user to be logged in.
  await requireUserLogin(request);
  // Get the user from the request.
  const user = await getUser(request);
  // Get the data from the form.
  const form = await request.formData();
  const name = form.get("name").trim();
  const description = form.get("description").trim();
  const privacy = form.get("privacy");

  // Create a new post.
  const group = await createGroup({ name, description, privacy, user });

  // Check if the group was created successfully and redirect to the group page.
  if (group._id) {
    return redirect(`/groups/${group._id}`);
  } else {
    return json("Error creating group", { status: 500 });
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
