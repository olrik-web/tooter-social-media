import { getUser, requireUserLogin } from "~/utils/auth.server";
import connectDb from "~/db/connectDb.server";
import { redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import GroupCard from "~/components/GroupCard";
import NavigateBackButton from "~/components/NavigateBackButton";

export async function loader({ request, params }) {
  const userId = await requireUserLogin(request);
  const user = await getUser(request);
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
