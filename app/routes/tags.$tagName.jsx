import { json } from "@remix-run/node";
import { useLoaderData, useParams, useSubmit } from "@remix-run/react";
import PostCard from "~/components/PostCard";
import connectDb from "~/db/connectDb.server";
import { getUser } from "~/utils/auth.server";
import MenuRight from "~/components/MenuRight";

export async function loader({ request, params }) {
  const currentUser = await getUser(request);
  const db = await connectDb();

  // Find all posts with the tag. Also populate the createdBy and tags fields.
  const tag = await db.models.Tag.findOne({
    name: params.tagName,
  })
    .populate("posts")
    .populate({
      path: "posts",
      populate: {
        path: "createdBy",
        model: "User",
      },
    })
    .populate({
      path: "posts",
      populate: {
        path: "tags",
        model: "Tag",
      },
    });

  // Remove private groups from the posts
  const filteredPosts = tag.posts.filter((post) => {
    if (post.group?.privacy === "private") {
      return false;
    }
    return true;
  });

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

export default function Index() {
  //   const { posts } = useLoaderData();
  const { posts, requestUrl, currentUser, searchUsers, searchTags } = useLoaderData();
  const params = useParams();

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
        <h1 className="text-3xl font-bold border-x border-b border-gray-600 p-4">Tag: {params.tagName}</h1>
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
