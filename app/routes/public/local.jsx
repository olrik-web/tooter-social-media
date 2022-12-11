import { json } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import connectDb from "~/db/connectDb.server";
import { getUser } from "~/utils/auth.server";
import PostCard from "~/components/PostCard";
import MenuRight from "~/components/MenuRight";

export async function loader({ request }) {
  const currentUser = await getUser(request);
  // Find the current user using the userId from the session.
  const db = await connectDb();
  // Find the most recent posts. Also populate the createdBy field with the user data and the tags field with the tag data.
  const posts = await db.models.Post.find().populate("createdBy").populate("tags").sort({ createdAt: -1 });

  // Remove posts that are posted in groups.
  const filteredPosts = posts.filter((post) => post.group === null);

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

  return json({ posts: filteredPosts, currentUser, searchUsers, searchTags, requestUrl: request.url });
}

export default function ExplorePage() {
  const { posts, requestUrl, currentUser, searchUsers, searchTags } = useLoaderData();

  // Handle the search term change. Submit is called when the user types in the search bar. It submits the form with the new search term.
  const submit = useSubmit();
  function handleSearchTermChange(event) {
    const searchQuery = event.currentTarget;
    const waitTime = 500;
    // Debounce the search term so that it doesn't fire off a request for every keystroke
    setTimeout(() => {
      submit(searchQuery);
    }, waitTime);
  }
  return (
    <div className="flex flex-row">
      <div className="w-full">
        <h1 className="text-3xl font-bold border-x border-b border-gray-600 p-4">Recent</h1>
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

// Catch any unexpected errors and display them to the user.
export function ErrorBoundary({ error }) {
  return (
    <div className="text-red-500 text-center">
      <h1 className="text-2xl font-bold">Error</h1>
      <p>{error.message}</p>
    </div>
  );
}
