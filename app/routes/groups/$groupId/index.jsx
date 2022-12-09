import { useActionData, useLoaderData, useTransition } from "@remix-run/react";
import GroupForm from "~/components/GroupForm";
import PostCard from "~/components/PostCard";
import NavigateBackButton from "~/components/NavigateBackButton";
import { getUser, requireUserLogin } from "~/utils/auth.server";
import { json, redirect } from "@remix-run/node";
import { createGroup } from "~/utils/group.server";
import connectDb from "~/db/connectDb.server";

export async function loader({ request, params }) {
  const userId = await requireUserLogin(request);
  const db = await connectDb();

  // Find all posts for the group. Also populate the createdBy and tags fields.
  const group = await db.models.Group.findOne({
    _id: params.groupId,
    members: userId,
  })
    .populate("posts")
    .populate({
      path: "posts",
      populate: {
        path: "createdBy",
        model: "User",
      },
    })
    .populate({
      path: "posts",
      populate: {
        path: "tags",
        model: "Tag",
      },
    })
    .limit(100);

  if (!group) {
    return redirect("/groups");
  }

  return { group };
}

export default function Index() {
  const { group } = useLoaderData();
  return (
    <div>
      <h1 className="text-3xl font-bold border border-gray-600 p-4">Posts</h1>
      <div className="flex flex-col gap-y-4">
        {group.posts.map((post) => (
          <PostCard key={post._id} post={post} user={post.createdBy} tags={post.tags} />
        ))}
      </div>
    </div>
  );
}
