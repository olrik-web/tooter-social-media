import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import connectDb from "~/db/connectDb.server";
import { getUser, requireUserLogin } from "~/utils/auth.server";
import PostCard from "~/components/PostCard";

export async function loader({ request, params }) {
  const currentUser = await getUser(request);
  // Find the current user using the userId from the session.
  const db = await connectDb();
  // Find the user's posts.
  const user = await db.models.User.findOne({ username: params.username });

  // Find the posts that the user has starred.
  const posts = await db.models.Post.find({ _id: { $in: user.starredPosts } })
    .populate("tags")
    .populate("group")
    .sort({ createdAt: -1 });
  // Remove posts that are posted in a group.
  const filteredPosts = posts.filter((post) => !post.group);

  return json({ posts: filteredPosts, requestUrl: request.url, user, currentUser });
}

export default function ProfileStars() {
  const { posts, requestUrl, user, currentUser } = useLoaderData();

  return (
    <>
      {posts.length === 0 && (
        <div className="text-center text-gray-500">
          <p className="text-2xl font-bold">No Toots yet</p>
          <p>When {user.firstName} stars a Toot, it'll show up here.</p>
        </div>
      )}
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
