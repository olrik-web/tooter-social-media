import { json, redirect } from "@remix-run/node";
import connectDb from "~/db/connectDb.server";
import { useLoaderData, useSubmit } from "@remix-run/react";
import SnippetCard from "../../components/SnippetCard";
import SearchBar from "../../components/SearchBar";
import { useState } from "react";
import { getUserId } from "../../utils/auth.server";
import SortButtons from "~/components/SortButtons";

export async function loader({ request }) {
  // Get the user that is currently logged in.
  const userId = await getUserId(request);
  // If the user is not logged in, redirect them to the login page.
  if (!userId) {
    return redirect("/login");
  }

  const url = new URL(request.url);
  const searchTerm = url.searchParams.get("searchQuery") || "";

  const db = await connectDb();
  // Find the snippets in the current folder that belong to the current user. Use the search term to filter the results server-side.
  const snippets = await db.models.snippets.find({
    // Filtering by title or description.
    $or: [{ title: { $regex: searchTerm, $options: "i" } }, { description: { $regex: searchTerm, $options: "i" } }],
    createdBy: userId,
  });
  // TODO: Get the snippet folders.
  return json({ snippets });
}

export default function SnippetIndex() {
  const data = useLoaderData();
  const [sort, setSort] = useState("date");
  const [sortOrderDescDate, setSortOrderDescDate] = useState(false);
  const [sortOrderDescTitle, setSortOrderDescTitle] = useState(true);
  const [sortOrderDescFavorite, setSortOrderDescFavorite] = useState(false);

  // Handle the search term change. Submit is called when the user types in the search bar. It submits the form with the new search term.
  const submit = useSubmit();
  function handleSearchTermChange(event) {
      submit(event.currentTarget);
  }

  // Sort the snippets based on the sort option.
  const sortedSnippets = data.snippets.sort((a, b) => {
    if (sort === "title") {
      return sortOrderDescTitle ? b.title.localeCompare(a.title) : a.title.localeCompare(b.title);
    } else if (sort === "favorite") {
      return sortOrderDescFavorite ? b.favorite - a.favorite : a.favorite - b.favorite;
    } else {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrderDescDate ? dateA - dateB : dateB - dateA;
    }
  });

  return (
    <div>
      <SearchBar handleSearchTermChange={handleSearchTermChange} />
      <h1 className="text-3xl font-bold">All Snippets</h1>
      <hr className="my-4" />
      <SortButtons
        sort={sort}
        setSort={setSort}
        sortOrderDescDate={sortOrderDescDate}
        setSortOrderDescDate={setSortOrderDescDate}
        sortOrderDescTitle={sortOrderDescTitle}
        setSortOrderDescTitle={setSortOrderDescTitle}
        sortOrderDescFavorite={sortOrderDescFavorite}
        setSortOrderDescFavorite={setSortOrderDescFavorite}
      />
      {sortedSnippets.map((snippet) => (
        <SnippetCard key={snippet._id} snippet={snippet} snippetFolder={data.snippetFolder} />
      ))}
    </div>
  );
}
