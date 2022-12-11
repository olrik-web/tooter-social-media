import { requireUserLogin } from "~/utils/auth.server";
import connectDb from "~/db/connectDb.server";
import { json } from "@remix-run/node";
import { useLoaderData, useTransition } from "@remix-run/react";
import PostCard from "~/components/PostCard";
import CommentForm from "~/components/CommentForm";
import CommentCard from "~/components/CommentCard";
import NavigateBackButton from "~/components/NavigateBackButton";
import { createComment, deletePost } from "~/utils/post.server";

export async function loader({ request, params }) {
  const currentUserId = await requireUserLogin(request);
  // Find the current user using the userId from the session.
  const db = await connectDb();
  const user = await db.models.User.findOne({ username: params.username });
  const currentUser = await db.models.User.findById(currentUserId);
  // Find the user's posts.
  const post = await db.models.Post.findOne({ _id: params.postId });
  // Get the post's tags.
  const tags = await db.models.Tag.find({ _id: { $in: post.tags } });
  // Add the tags to the post.
  const postWithTags = { ...post.toObject(), tags };
  // Get the post's comments.
  const comments = await db.models.Comment.find({ post: post._id }).populate("createdBy").sort({ createdAt: -1 });

  return json({ user, currentUser, postWithTags, comments, requestUrl: request.url });
}

export default function PostDetail() {
  const { user, currentUser, postWithTags, comments, requestUrl } = useLoaderData();
  const transition = useTransition();

  // Check if we are in a loading or submitting state and if the action is "create".
  const isCreating =
    (transition.state === "submitting" || transition.state === "loading") && transition.submission?.formData.get("_action") === "comment";
  // If we are in a loading or submitting state we show some pending UI.
  // TODO: Use nested routes so we can see the post even if comments fail to load. Like in the profile page.
  return (
    <>
      <NavigateBackButton showText={true} />
      <PostCard post={postWithTags} user={user} currentUser={currentUser} requestUrl={requestUrl} comments={comments} detailView={true} />
      {/* Form for creating comments */}
      <CommentForm postId={postWithTags._id} user={user} currentUser={currentUser} />
      {/* Pending UI */}
      {isCreating && (
        <div className="flex flex-col items-center justify-center mt-4 gap-y-4">
          <h3 className="text-xl font-bold">Commment pending...</h3>
          <img src="/images/spinner.png" alt="Loading" className="animate-spin h-20 w-20" />
        </div>
      )}
      {/* All comments */}
      {comments.map((comment) => (
        <CommentCard key={comment._id} comment={comment} />
      ))}
    </>
  );
}

export async function action({ request }) {
  const userId = await requireUserLogin(request);
  // Get the data from the form.
  const form = await request.formData();
  const action = form.get("_action");
  const postId = form.get("postId");
  const comment = form.get("comment");

  if (action === "comment") {
    return await createComment(userId, postId, comment);
  }
  else if (action === "deletePost") {
    return await deletePost(userId, postId);
  }
}
