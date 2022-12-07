import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import connectDb from "~/db/connectDb.server";
import { requireUserLogin, logOut } from "~/utils/auth.server";
import { updatePostBookmark, updatePostStar } from "~/utils/post.server";
import Button from "~/components/Button";
import { ArrowLeftIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import PostCard from "~/components/PostCard";
import NavigateBackButton from "~/components/NavigateBackButton";

export async function loader({ request }) {
  const currentUserId = await requireUserLogin(request);
  // Find the current user using the userId from the session.
  const db = await connectDb();
  const currentUser = await db.models.User.findById(currentUserId);
  // Find the most recent posts.
  const posts = await db.models.Post.find().sort({ createdAt: -1 }).limit(20);
  // Get the user for each post and add it to the post.
  // TODO: This is a bit of a hack. We should be able to use populate() to do this. Or something else?
  const postsWithUsers = await Promise.all(
    posts.map(async (post) => {
      const user = await db.models.User.findById(post.createdBy);
      return { ...post.toObject(), user };
    })
  );
  // Get the post's tags.
  const tags = await db.models.Tag.find({ _id: { $in: posts.tags } });
  // Add the tags to the post.
  const postsWithTags = postsWithUsers.map((post) => {
    const postTags = tags.filter((tag) => post.tags.includes(tag._id));
    return { ...post, tags: postTags };
  });

  return json({ posts: postsWithTags, currentUser });
}

export default function ExplorePage() {
  const { posts, requestUrl, user, currentUser } = useLoaderData();
  return (
    <>
      <h1 className="text-3xl font-bold">Explore</h1>
      <div>
        {posts.map((post) => (
          <PostCard key={post._id} post={post} user={post.user} currentUser={currentUser} requestUrl={requestUrl} />
        ))}
      </div>
    </>
  );
}
