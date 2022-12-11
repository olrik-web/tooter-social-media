import { json } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import connectDb from "~/db/connectDb.server";
import { requireUserLogin } from "~/utils/auth.server";
import PostCard from "~/components/PostCard";
import MenuRight from "~/components/MenuRight";

export async function loader({ request }) {
  const currentUserId = await requireUserLogin(request);
  // Find the current user using the userId from the session.
  const db = await connectDb();
  const currentUser = await db.models.User.findById(currentUserId);
  // Find the current user's bookmarks. Also populate the createdBy field with the user data and the tags field with the tag data.
  const bookmarks = await db.models.Post.find({ _id: { $in: currentUser?.bookmarkedPosts } })
    .populate("createdBy")
    .populate("tags")
    .populate("group")
    .sort({ createdAt: -1 });

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

  return json({ posts: bookmarks, currentUser, searchUsers, searchTags, requestUrl: request.url });
}

export default function BookmarksPage() {
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
        <h1 className="text-3xl font-bold border border-gray-600 p-4">Bookmarks</h1>
        <div>
          {posts.length === 0 && <p className="text-xl">You have no bookmarks yet.</p>}
          {posts.map((post) =>
            post.group ? (
              post.group.members.includes(currentUser?._id) ? (
                <PostCard key={post._id} post={post} user={post.createdBy} currentUser={currentUser} requestUrl={requestUrl} />
              ) : null
            ) : (
              <PostCard key={post._id} post={post} user={post.createdBy} currentUser={currentUser} requestUrl={requestUrl} />
            )
          )}
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
