import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import connectDb from "~/db/connectDb.server";
import { requireUserLogin } from "~/utils/auth.server";
import CommentCard from "~/components/CommentCard";

export async function loader({ request, params }) {
  // Find the current user using the userId from the session.
  const db = await connectDb();
  // Find the user's comments.
  const user = await db.models.User.findOne({ username: params.username });
  // Get the post's comments.
  const comments = await db.models.Comment.find({ createdBy: user._id }).populate("createdBy").populate("post").sort({ createdAt: -1 });

  // Remove comments that are posted in groups.
  const filteredComments = comments.filter((comment) => comment.post?.group === null);

  return json({ user, comments: filteredComments });
}

export default function ProfileComments() {
  const { user, comments } = useLoaderData();

  return (
    <>
      {comments.length === 0 && (
        <div className="text-center text-gray-500">
          <p className="text-2xl font-bold">No comments yet</p>
          <p>When {user.firstName} comments, they'll show up here.</p>
        </div>
      )}
      {comments.map((comment) => (
        <CommentCard key={comment._id} comment={comment} />
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
