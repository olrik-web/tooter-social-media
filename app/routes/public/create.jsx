import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useTransition } from "@remix-run/react";
import PostForm from "~/components/PostForm";
import connectDb from "~/db/connectDb.server";
import { createPost } from "~/utils/post.server";
import { requireUserLogin } from "~/utils/auth.server";

export async function loader({ request }) {
  // If the user is not logged in, redirect them to the login page.
  const userId = await requireUserLogin(request);

  // Display the user's groups.
  const db = await connectDb();
  // The lean option is used to return a plain JavaScript object instead of a Mongoose document. This is useful for performance reasons.
  // https://mongoosejs.com/docs/tutorials/lean.html
  const groups = await db.models.Group.find({ members: { $in: [userId] } }, { name: 1, _id: 1 }).lean();

  return json({ groups });
}

export default function Create() {
  const actionData = useActionData();
  const { groups } = useLoaderData();
  const transition = useTransition();
  console.log("Groups:");
  console.log(groups);
  // If we are creating a snippet or loading the snippet we use pending UI.
  const isCreating =
    (transition.state === "submitting" || transition.state === "loading") &&
    transition.submission?.formData.get("_action") === "create";
  return (
    <div>
      <h4 className="text-3xl font-bold">New post</h4>
      <hr className="my-4" />
      <PostForm errors={actionData} groups={groups} isCreating={isCreating} />
    </div>
  );
}

export async function action({ request }) {
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
      return redirect(`/public/${post._id}`);
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
