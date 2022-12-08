import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import connectDb from "~/db/connectDb.server";
import { requireUserLogin } from "~/utils/auth.server";
import PostCard from "~/components/PostCard";

export async function loader({ request, params }) {
  const currentUserId = await requireUserLogin(request);
  // Find the current user using the userId from the session.
  const db = await connectDb();
  // Find the user's posts.
  const posts = await db.models.Post.find({ createdBy: currentUserId });
  const user = await db.models.User.findOne({ username: params.username });
  const currentUser = await db.models.User.findById(currentUserId);

  // Map over the posts and populate it with the tags.
  const postsWithTags = await Promise.all(
    posts.map(async (post) => {
      const tags = await db.models.Tag.find({ _id: { $in: post.tags } });
      return { ...post.toObject(), tags };
    })
  );
  return json({ posts: postsWithTags, requestUrl: request.url, user, currentUser });
}

export default function ProfileToots() {
  const { posts, requestUrl, user, currentUser } = useLoaderData();

  return (
    <>
      {posts.map((post) => (
        <PostCard key={post._id} post={post} user={user} currentUser={currentUser} requestUrl={requestUrl} />
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
      <p>Failed to load Toots. Please try again later.</p>
    </div>
  );
}
