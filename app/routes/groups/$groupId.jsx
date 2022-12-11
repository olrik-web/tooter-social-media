import { getUser, requireUserLogin } from "~/utils/auth.server";
import connectDb from "~/db/connectDb.server";
import { redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import GroupCard from "~/components/GroupCard";
import NavigateBackButton from "~/components/NavigateBackButton";

export async function loader({ request, params }) {
  // Require the user to be logged in.
  const userId = await requireUserLogin(request);
  // Get the user from the request.
  const user = await getUser(request);
  // Connect to the database.
  const db = await connectDb();
  // Find the group using the groupId from the URL params.
  // If the user is not a member of the group, return a redirect to the groups page.
  const group = await db.models.Group.findOne({
    _id: params.groupId,
    members: userId,
  });
  if (!group) {
    return redirect("/groups");
  }
  return { group, user };
}

export default function GroupPage() {
  const { group, user } = useLoaderData();
  return (
    <div>
      <NavigateBackButton showText={true} />
      <h1 className="text-3xl font-bold border border-gray-600 p-4">{group.name}</h1>
      <GroupCard group={group} detailView={true} user={user} />
      <Outlet />
    </div>
  );
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
