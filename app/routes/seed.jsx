import { json } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import connectDb from "~/db/connectDb.server";
import { getUserId } from "../utils/auth.server";

export const loader = async ({ request }) => {
  const userId = await getUserId(request);
  const db = await connectDb();
  const snippets = await db.models.snippets.countDocuments();
  const snippetFolders = await db.models.snippetFolders.countDocuments();

  return json({ snippets, snippetFolders, userId });
};

export default function Seed() {
  const loaderData = useLoaderData();
  const actionData = useActionData();

  return (
    <div>
      <div className="mt-24 text-center">
        <h1 className="text-2xl font-bold">Seed</h1>
        <div className="bg-gray-200 p-4 rounded mt-4">
          {!loaderData.userId && <p className="text-red-500">You must be logged in to seed the database.</p>}
          <p>
            Database has <span className="text-red-500 font-bold">{loaderData.snippets}</span> snippets and{" "}
            <span className="text-red-500 font-bold">{loaderData.snippetFolders}</span> snippet folders.
          </p>
          <p className="mt-4"> Are you sure you want to delete the existing data and seed the database?</p>
          <Form method="post" className="mt-4">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Seed
            </button>
          </Form>

          {actionData?.success && (
            <>
              <p className="text-green-500">{actionData.success}</p>
              <br/>
              <Link to="/snippets" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                View snippets
              </Link>
            </>
          )}
          {actionData?.error && (
            <>
              <p className="text-red-500">{actionData.error}</p>
              <br/>
              <Link to="/login" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export async function action({ request }) {
  // Seed the database with some data.
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return json({ error: "You must be logged in to seed the database." }, { status: 401 });
    }
    const db = await connectDb();
    await db.models.snippets.deleteMany({});
    await db.models.snippetFolders.deleteMany({});

    const folder1 = await db.models.snippetFolders.create({
      name: "My Snippets",
      createdBy: userId,
    });
    const folder2 = await db.models.snippetFolders.create({
      name: "My Other Snippets",
      createdBy: userId,
    });
    await db.models.snippets.create({
      title: "My First Snippet",
      description: "This is my first snippet",
      language: "javascript",
      code: "console.log('Hello World!')",
      favorite: true,
      createdBy: userId,
      snippetFolder: folder1._id,
    });
    await db.models.snippets.create({
      title: "My Second Snippet",
      description: "This is my second snippet",
      language: "javascript",
      code: "console.log('Hello World!')",
      favorite: false,
      createdBy: userId,
      snippetFolder: folder2._id,
    });
    await db.models.snippets.create({
      title: "My Third Snippet",
      description: "This is my third snippet",
      language: "javascript",
      code: "console.log('Hello World!')",
      favorite: false,
      createdBy: userId,
      snippetFolder: folder2._id,
    });
    return json({ success: "Database seeded" });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
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
