import { redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import LoginForm from "~/components/LoginForm";
import { signup } from "~/utils/auth.server";
import Button from "../../components/Button";
import { getUserId } from "../../utils/auth.server";

export async function loader({ request }) {
  // If the user is already logged in, redirect them to the home page.
  return (await getUserId(request)) ? redirect("/profile") : null;
}

export default function SignUp() {
  // Get the actionData from the action function.
  const actionData = useActionData();

  // If the actionData is an error, pass it to the LoginForm component.
  return (
    <>
      <img src="/images/logo.png" alt="Tooter Logo" className="w-20 mx-auto my-8" />
      <h1 className="text-3xl font-bold text-center m-4">Sign Up for Tooter</h1>
      <div className="flex flex-col justify-center items-center py-8">
        <LoginForm errors={actionData} action="/signup" />
        <div className="text-center">
          <p className="px-4">or</p>
          <Button path="/login">Log in</Button>
        </div>
      </div>
    </>
  );
}

// This is the action function that will be called when the form is submitted.
export async function action({ request }) {
  // Get the username, password, passwordConfirmation, firstName, and lastName from the request body.
  const form = await request.formData();
  const username = form.get("username");
  const password = form.get("password");
  const passwordConfirmation = form.get("passwordConfirmation");
  const firstName = form.get("firstName");
  const lastName = form.get("lastName");

  // TODO: Regex username

  // Sign up the user and return the response.
  return await signup(username, password, passwordConfirmation, firstName, lastName);
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
