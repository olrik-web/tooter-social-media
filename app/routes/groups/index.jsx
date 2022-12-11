import { requireUserLogin } from "~/utils/auth.server";
import connectDb from "~/db/connectDb.server";
import { useLoaderData, useSubmit } from "@remix-run/react";
import MenuRight from "~/components/MenuRight";
import Button from "~/components/Button";
import GroupCard from "~/components/GroupCard";

export async function loader({ request }) {
  const userId = await requireUserLogin(request);
  // Connect to the database
  const db = await connectDb();
  // Find the user's groups from user.groups
  const groups = await db.models.Group.find({
    members: userId,
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
  // Return the groups
  return { groups, searchUsers, searchTags };
}

export default function Groups() {
  const { groups, searchUsers, searchTags } = useLoaderData();

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
        <div className="flex flex-row justify-between font-bold border-x border-b border-gray-600 ">
          <h1 className="text-3xl p-4">Groups</h1>
          <Button path="/groups/newGroup">New Group</Button>
        </div>
        <div>
          {groups.length === 0 && <p className="text-gray-500">You are not a member of any groups.</p>}
          {groups.map((group) => (
            <GroupCard key={group._id} group={group} />
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
