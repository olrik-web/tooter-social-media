import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import connectDb from "~/db/connectDb.server";
import { requireUserLogin } from "~/utils/auth.server";
import CommentCard from "~/components/CommentCard";

export async function loader({ request, params }) {
  await requireUserLogin(request);
  // Find the current user using the userId from the session.
  const db = await connectDb();
  console.log(params);
  // Find the user's comments.
  const user = await db.models.User.findOne({ username: params.username });
  // Get the post's comments.
  const comments = await db.models.Comment.find({ createdBy: user._id });
  // Map over the comments and populate it with the user.
  const commentsWithUsers = await Promise.all(
    comments.map(async (comment) => {
      const user = await db.models.User.findOne({ _id: comment.createdBy });
      return { ...comment.toObject(), user };
    })
  );

  // throw new Error("This is an error");

  return json({ user, commentsWithUsers });
}

export default function ProfileComments() {
  const { user, commentsWithUsers } = useLoaderData();

  return (
    <>
      {commentsWithUsers.map((comment) => (
        <CommentCard key={comment._id} comment={comment} author={user} />
      ))}
    </>
  );
}

// Catch any unexpected errors and display them to the user.
export function ErrorBoundary({ error }) {
  console.error(error);
  return (
    <div className="text-red-500 text-center">
      <h1 className="text-2xl font-bold">An error occurred</h1>
      <p>Failed to load comments. Please try again later.</p>
    </div>
  );
}
