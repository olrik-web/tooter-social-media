import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import connectDb from "~/db/connectDb.server";
import { getUserId, logOut } from "~/utils/auth.server";
import Button from "~/components/Button";

export async function loader({ request }) {
  // Get the user that is currently logged in.
  const currentUser = await getUserId(request);
  // If the user is not logged in, redirect them to the login page.
  if (!currentUser) {
    return redirect("/login");
  }

  // Find the current user using the userId from the session.
  const db = await connectDb();
  const user = await db.models.users.findById(currentUser);
  return json(user);
}

// This is the action function that will be called when the form is submitted.
export async function action({ request }) {
  return await logOut(request);
}

export default function Profile() {
  // Get the user from the loader.
  const user = useLoaderData();
  return (
    <>
      <h1 className="text-3xl font-bold text-center m-4 mt-24">Profile</h1>
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-200 p-4 rounded">
          <p className="text-xl font-bold">Email: {user.email}</p>
          <p className="text-xl font-bold">
            Name: {user.profile.firstName} {user.profile.lastName}
          </p>
        </div>
      </div>
      <Form method="post">
        <Button type="submit" classType="primary">
          Log Out
        </Button>
      </Form>
    </>
  );
}