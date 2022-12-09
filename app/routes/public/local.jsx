import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData, useSubmit } from "@remix-run/react";
import connectDb from "~/db/connectDb.server";
import { requireUserLogin, logOut, getUser } from "~/utils/auth.server";
import { updatePostBookmark, updatePostStar } from "~/utils/post.server";
import Button from "~/components/Button";
import { ArrowLeftIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import PostCard from "~/components/PostCard";
import NavigateBackButton from "~/components/NavigateBackButton";
import MenuRight from "~/components/MenuRight";

export async function loader({ request }) {
  const currentUser = await getUser(request);
  // Find the current user using the userId from the session.
  const db = await connectDb();
  // Find the posts with the most stars.
  const posts = await db.models.Post.find().populate("createdBy").populate("tags").sort({ createdAt: -1 }).limit(20);
  // Get the user for each post and add it to the post.
  // TODO: This is a bit of a hack. We should be able to use populate() to do this. Or something else?
  // const postsWithUsers = await Promise.all(
  //   posts.map(async (post) => {
  //     const user = await db.models.User.findById(post.createdBy);
  //     return { ...post.toObject(), user };
  //   })
  // );

  // Get the post's tags.
  const tags = await db.models.Tag.find({ _id: { $in: posts.tags } });
  // Add the tags to the post.
  // const postsWithTags = postsWithUsers.map((post) => {
  //   const postTags = tags.filter((tag) => post.tags.includes(tag._id));
  //   return { ...post, tags: postTags };
  // });

  const url = new URL(request.url);
  const searchTerm = url.searchParams.get("searchQuery") || "";

  // Find the users that match the search term. We use the search term to filter the results server-side.
  const searchUsers = await db.models.User.find(
    searchTerm
      ? {
          username: { $regex: searchTerm, $options: "i" },
        }
      : {}
  ).limit(5);

  // Find the tags that match the search term.
  const searchTags = await db.models.Tag.find(
    searchTerm
      ? {
          name: { $regex: searchTerm, $options: "i" },
        }
      : {}
  ).limit(5);

  return json({ posts, currentUser, searchUsers, searchTags });
}

export default function ExplorePage() {
  const { posts, requestUrl, user, currentUser, searchUsers, searchTags } = useLoaderData();
  console.log(posts);

  // Handle the search term change. Submit is called when the user types in the search bar. It submits the form with the new search term.
  const submit = useSubmit();
  function handleSearchTermChange(event) {
    const searchQuery = event.currentTarget;
    const waitTime = 1000;
    // Debounce the search term so that it doesn't fire off a request for every keystroke
    setTimeout(() => {
      submit(searchQuery);
    }, waitTime);
  }
  return (
    <div className="flex flex-row">
      <div className="w-full">
        <h1 className="text-3xl font-bold border-x border-b border-gray-600 p-2">Explore</h1>
        <div>
          {posts.map((post) => (
            <PostCard key={post._id} post={post} user={post.createdBy} currentUser={currentUser} requestUrl={requestUrl} />
          ))}
        </div>
      </div>
      <div>
        <MenuRight users={searchUsers} tags={searchTags} handleSearchTermChange={handleSearchTermChange} />
      </div>
    </div>
  );
}
