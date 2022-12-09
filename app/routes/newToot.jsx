import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useTransition } from "@remix-run/react";
import PostForm from "~/components/PostForm";
import connectDb from "~/db/connectDb.server";
import { createPost } from "~/utils/post.server";
import { requireUserLogin, getUser } from "~/utils/auth.server";
import PostCard from "~/components/PostCard";
import NavigateBackButton from "~/components/NavigateBackButton";

export async function loader({ request }) {
  // If the user is not logged in, redirect them to the login page.
  const userId = await requireUserLogin(request);

  // Display the user's groups.
  const db = await connectDb();
  // The lean option is used to return a plain JavaScript object instead of a Mongoose document. This is useful for performance reasons.
  const groups = await db.models.Group.find({ members: { $in: [userId] } }, { name: 1, _id: 1 }).lean();
  const currentUser = await getUser(request);

  return json({ groups, currentUser });
}

export default function Create() {
  const actionData = useActionData();
  const { groups, currentUser } = useLoaderData();
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
      <h1 className="text-3xl font-bold border-x border-b border-gray-600 p-2">New Toot</h1>
      <PostForm errors={actionData} groups={groups} isCreating={isCreating} />
    </div>
  );
}

export async function action({ request }) {
  await requireUserLogin(request);
  const user = await getUser(request);
  console.log(user);
  // Get the data from the form.
  const form = await request.formData();
  const content = form.get("content").trim();
  const groupId = form.get("group");
  const tags = form.get("tags");
  const images = form.get("images");

  // Convert the tags and images to arrays. Also remove whitespace from the tags and images.
  const tagsArray = tags ? tags.split(",").map((tag) => tag.trim()) : [];
  const imagesArray = images ? images.split(",").map((image) => image.trim()) : [];

  // Create a new post.
  const post = await createPost(request, content, groupId, tagsArray, imagesArray);

  // Check if the snippet was created successfully and redirect to the snippet folder page.
  if (post._id) {
    if (post.group) {
      return redirect(`/groups/${post.group._id}`);
    } else {
      return redirect(`/profile/@${user.username}/${post._id}`);
    }
  } else {
    return json("Error creating snippet", { status: 500 });
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
