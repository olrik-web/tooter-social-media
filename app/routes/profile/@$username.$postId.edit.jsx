import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import connectDb from "~/db/connectDb.server";
import { requireUserLogin } from "~/utils/auth.server";
import PostForm from "~/components/PostForm";
import { updatePost } from "~/utils/post.server";

export async function loader({ params, request }) {
  // Get the user that is currently logged in.
  const userId = await requireUserLogin(request);

  // Find the snippet that is being edited and return it with the snippetFolder.
  const db = await connectDb();
  // Find snippet by id where field userId is equal to the current user id.
  const post = await db.models.Post.findOne({
    _id: params.postId,
    createdBy: userId,
  });

  // Get the post's tags.
  const tags = await db.models.Tag.find({ _id: { $in: post.tags } });
  // Add the tags to the post.
  const postWithTags = { ...post.toObject(), tags };

  // The lean option is used to return a plain JavaScript object instead of a Mongoose document. This is useful for performance reasons.
  // https://mongoosejs.com/docs/tutorials/lean.html
  const groups = await db.models.Group.find({ members: { $in: [userId] } }, { name: 1, _id: 1 }).lean();

  return json({ postWithTags, groups });
}

export default function Edit() {
  const { postWithTags, groups } = useLoaderData();
  const actionData = useActionData();

  return (
    <div>
      <h4 className="text-3xl font-bold">Edit post</h4>
      <hr className="my-4" />
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
