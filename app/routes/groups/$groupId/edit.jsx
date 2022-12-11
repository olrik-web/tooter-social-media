import { json, redirect } from "@remix-run/node";
import connectDb from "~/db/connectDb.server";
import { requireUserLogin, getUser } from "~/utils/auth.server";
import GroupForm from "~/components/GroupForm";
import GroupCard from "~/components/GroupCard";
import { useActionData, useLoaderData, useTransition } from "@remix-run/react";
import NavigateBackButton from "~/components/NavigateBackButton";
import { editGroup } from "~/utils/group.server";

export async function loader({ request, params }) {
  // Require the user to be logged in
  await requireUserLogin(request);
  // Connect to the database
  const db = await connectDb();
  const user = await getUser(request);
  // Get the group from the database. Only the group's creator can edit it.
  const group = await db.models.Group.findOne({
    _id: params.groupId,
    createdBy: user._id,
  }).populate("members");

  // If the group doesn't exist, redirect to the groups page
  if (!group) {
    return redirect("/groups");
  }
  // Return the group
  return { group };
}

export default function Edit() {
  const { group } = useLoaderData();
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
      <h1 className="text-3xl font-bold border border-gray-600 p-4">New Group</h1>
      <GroupForm group={group} errors={actionData} isCreating={isCreating} />
    </div>
  );
}

export async function action({ request, params }) {
  // Require the user to be logged in.
  await requireUserLogin(request);

  // Get the user from the request.
  const user = await getUser(request);

  // Get the data from the form.
  const form = await request.formData();
  const name = form.get("name").trim();
  const description = form.get("description").trim();
  const privacy = form.get("privacy");
  const memberUsernamesField = form.get("memberUsernames");

  // Split the member usernames into an array and trim any whitespace.
  const memberUsernames = memberUsernamesField ? memberUsernamesField.split(",").map((username) => username.trim()) : [];

  // Update the group in the database.
  const group = await editGroup({ groupId: params.groupId, name, description, privacy, user, memberUsernames });

  // Check if the group was edited successfully and redirect to the group page.
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
