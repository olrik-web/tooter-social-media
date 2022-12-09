import { requireUserLogin } from "~/utils/auth.server";
import connectDb from "~/db/connectDb.server";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
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
  const comments = await db.models.Comment.find({ post: post._id });
  // Map over the comments and populate it with the user.
  const commentsWithUsers = await Promise.all(
    comments.map(async (comment) => {
      const user = await db.models.User.findOne({ _id: comment.createdBy });
      return { ...comment.toObject(), user };
    })
  );

  return json({ user, currentUser, postWithTags, commentsWithUsers, requestUrl: request.url });
}

export default function PostDetail() {
  const { user, currentUser, postWithTags, commentsWithUsers, requestUrl } = useLoaderData();
  // TODO: Use nested routing to show the comments. If comments fail to load the toot is still shown.
  return (
    <>
      <NavigateBackButton showText={true} />
      <PostCard
        post={postWithTags}
        user={user}
        currentUser={currentUser}
        requestUrl={requestUrl}
        comments={commentsWithUsers}
        detailView={true}
      />

      {/* Form for creating comments */}
      <CommentForm postId={postWithTags._id} user={user} currentUser={currentUser} />
      {/* All comments */}
      {commentsWithUsers.map((comment) => (
        <CommentCard key={comment._id} comment={comment} author={user} />
      ))}
    </>
  );
}

export async function action({ request, params }) {
  const userId = await requireUserLogin(request);
  // Get the data from the form.
  const form = await request.formData();
  const action = form.get("_action");
  const postId = form.get("id");
  const comment = form.get("comment");

  console.log("action", action);

  if (action === "comment") {
    return await createComment(userId, postId, comment);
  }
  if (action === "deletePost") {
    console.log(postId);
    return await deletePost(userId, postId);
  }
}
