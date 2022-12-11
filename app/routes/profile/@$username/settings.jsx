import { json } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { getUser, requireUserLogin, editUser } from "~/utils/auth.server";
import LoginForm from "~/components/LoginForm";

export async function loader({ request }) {
  // Require the user to be logged in.
  await requireUserLogin(request);
  // Get the user from the request.
  const currentUser = await getUser(request);

  return json({ currentUser });
}

export default function Index() {
  const { currentUser } = useLoaderData();
  const actionData = useActionData();

  return (
    <div>
      <h1 className="text-3xl font-bold border border-gray-600 p-4">Settings</h1>
      <LoginForm errors={actionData} user={currentUser} isEdit={true} />
    </div>
  );
}

// This is the action function that will be called when the form is submitted.
export async function action({ request }) {
  // Require the user to be logged in.
  await requireUserLogin(request);
  // Get the username, password, passwordConfirmation, firstName, and lastName from the request body.
  const form = await request.formData();
  const username = form.get("username").trim();
  const password = form.get("password").trim();
  const passwordConfirmation = form.get("passwordConfirmation").trim();
  const firstName = form.get("firstName").trim();
  const lastName = form.get("lastName").trim();

  const currentUser = await getUser(request);

  // Sign up the user and return the response.
  return await editUser(username, password, passwordConfirmation, firstName, lastName, currentUser);
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
