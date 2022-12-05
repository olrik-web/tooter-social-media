import { json, redirect } from "@remix-run/node";
import { Form, Outlet, useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { useState } from "react";
import SnippetCard from "~/components/SnippetCard";
import connectDb from "~/db/connectDb.server";
import SearchBar from "../../components/SearchBar";
import { getUserId } from "../../utils/auth.server";
import SortButtons from "../../components/SortButtons";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import Button from "~/components/Button";
import FormField from "~/components/FormField";
import { updateSnippetFolder } from "~/utils/snippetFolder.server";
import Modal from "~/components/Modal";

export async function loader({ params, request }) {
  // Get the user that is currently logged in.
  const userId = await getUserId(request);
  // If the user is not logged in, redirect them to the login page.
  if (!userId) {
    return redirect("/login");
  }

  const url = new URL(request.url);
  const searchTerm = url.searchParams.get("searchQuery") || "";
  console.log("searchTerm", searchTerm);

  const db = await connectDb();
  // Find the snippets in the current folder that belong to the current user. Use the search term to filter the results server-side.
  const snippets = await db.models.snippets.find({
    // Filtering by title or description.
    $or: [{ title: { $regex: searchTerm, $options: "i" } }, { description: { $regex: searchTerm, $options: "i" } }],
    snippetFolder: params.snippetFolderId,
    createdBy: userId,
  });
  const snippetFolder = await db.models.snippetFolders.findById(params.snippetFolderId);
  return json({ snippets, snippetFolder });
}

export default function Details() {
  const data = useLoaderData();
  const [sort, setSort] = useState("date");
  const [sortOrderDescDate, setSortOrderDescDate] = useState(false);
  const [sortOrderDescTitle, setSortOrderDescTitle] = useState(true);
  const [sortOrderDescFavorite, setSortOrderDescFavorite] = useState(false);
  const [editSnippetFolder, setEditSnippetFolder] = useState(false);
  const actionData = useActionData();
  const [showDeleteSnippetFolderModal, setShowDeleteSnippetFolderModal] = useState(false);

  // Handle the search term change. Submit is called when the user types in the search bar. It submits the form with the new search term.
  const submit = useSubmit();
  function handleSearchTermChange(event) {
    const searchQuery = event.currentTarget;
    const waitTime = 1500;
    // Debounce the search term so that it doesn't fire off a request for every keystroke
    setTimeout(() => {
      submit(searchQuery);
    }, waitTime);
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

  async function closeDeleteSnippetFolderModal() {
    setShowDeleteSnippetFolderModal(false);
  }

  return (
    <>
      <SearchBar handleSearchTermChange={handleSearchTermChange} />
      <div className="flex flex-row gap-x-8">
        <div className="w-1/2">
          <div>
            {data.snippetFolder?.name ? (
              <div className="flex flex-row gap-x-2 items-center justify-between">
                {editSnippetFolder ? (
                  <Form method="post">
                    <h1 className="text-3xl font-bold">
                      <FormField
                        element="input"
                        type="text"
                        defaultValue={data.snippetFolder.name}
                        name="name"
                        errors={actionData}
                        placeholderText="Snippet Folder Name"
                      />
                    </h1>
                    <div className="flex flex-row gap-x-2">
                      <Button type="submit" classType="primary">
                        Save
                      </Button>
                      <Button type="button" onClick={() => setEditSnippetFolder(false)}>
                        Cancel
                      </Button>
                    </div>
                  </Form>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold">{data.snippetFolder.name}</h1>
                    <div className="flex flex-row items-center justify-center gap-x-2">
                      <button
                        className="text-blue-500 hover:text-blue-700 w-6 h-6"
                        onClick={() => setEditSnippetFolder(!editSnippetFolder)}
                      >
                        <PencilSquareIcon className="w-6 h-6" />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700 w-6 h-6"
                        onClick={() => setShowDeleteSnippetFolderModal(true)}
                      >
                        <TrashIcon className="w-6 h-6" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <h1 className="text-3xl font-bold">All Snippets</h1>
            )}
          </div>
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
            <SnippetCard key={snippet._id} snippet={snippet} snippetFolder={data?.snippetFolder} />
          ))}
        </div>
        <div className="w-1/2 h-full">
          <Outlet />
        </div>
      </div>
      {showDeleteSnippetFolderModal && (
        <Modal
          title="Delete Snippet Folder?"
          onClose={closeDeleteSnippetFolderModal}
          actionPath={`/snippets/${data.snippetFolder._id}/delete`}
        >
          <p>Are you sure you want to delete this snippet folder?</p>
        </Modal>
      )}
    </>
  );
}

export async function action({ request, params }) {
  const form = await request.formData();
  const name = form.get("name");
  const snippetFolderId = params.snippetFolderId;
  try {
    return await updateSnippetFolder(request, snippetFolderId, name);
  } catch (error) {
    console.log(error);
  }
}
