import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useTransition } from "@remix-run/react";
import connectDb from "~/db/connectDb.server";
import { getUser, requireUserLogin } from "~/utils/auth.server";
import PostForm from "~/components/PostForm";
import { updatePost } from "~/utils/post.server";
import PostCard from "~/components/PostCard";
import NavigateBackButton from "~/components/NavigateBackButton";

export async function loader({ params, request }) {
  // Get the user that is currently logged in.
  const userId = await requireUserLogin(request);

  const db = await connectDb();
  const post = await db.models.Post.findOne({
    _id: params.postId,
    createdBy: userId,
  });

  // If the post has been deleted, redirect them to the home page.
  if (post.isDeleted) {
    return redirect("/");
  }

  // Get the post's tags.
  const tags = await db.models.Tag.find({ _id: { $in: post.tags } });
  // Add the tags to the post.
  const postWithTags = { ...post.toObject(), tags };

  const groups = await db.models.Group.find({ members: { $in: [userId] } }, { name: 1, _id: 1 }).lean();
  const currentUser = await getUser(request);

  return json({ postWithTags, groups, currentUser });
}

export default function Edit() {
  const { postWithTags, groups, currentUser } = useLoaderData();
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
      <PostCard post={Object.fromEntries(transition.submission?.formData)} user={currentUser} currentUser={currentUser} detailView={true} />
    </>
  ) : (
    // If we are not in a loading or submitting state we show the post form.
    <div>
      <h1 className="text-3xl font-bold border-x border-b border-gray-600 p-2">Edit Toot</h1>
      <PostForm errors={actionData} groups={groups} post={postWithTags} />
    </div>
  );
}

export async function action({ request, params }) {
  // Get the data from the form.
  const form = await request.formData();
  const content = form.get("content").trim();
  const groupId = form.get("group");
  const tags = form.get("tags");
  const images = form.get("images");

  // Convert the tags and images to arrays. Also remove whitespace from the tags and images.
  const tagsArray = tags ? tags.split(",").map((tag) => tag.trim()) : [];
  const imagesArray = images ? images.split(",").map((image) => image.trim()) : [];

  // Update the post.
  return await updatePost(request, params, content, groupId, tagsArray, imagesArray);
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
