import { redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import Button from "~/components/Button";
import LoginForm from "~/components/LoginForm";
import { logIn } from "~/utils/auth.server";
import { getUserId } from "../../utils/auth.server";

export async function loader({ request }) {
  // If the user is already logged in, redirect them to the home page.
  return (await getUserId(request)) ? redirect("/profile") : null;
}

export default function Login() {
  // Get the actionData from the action function.
  const actionData = useActionData();

  // If the actionData is an error, pass it to the LoginForm component.
  return (
    <>
      <h1 className="text-3xl font-bold text-center m-4 mt-24">Log In</h1>
      <div className="flex flex-col justify-center items-center py-8">
        <LoginForm errors={actionData} action="/login" />
        <div className="text-center">
          <p className="px-4">or</p>
          <Button path="/signup">Sign up</Button>
        </div>
      </div>
    </>
  );
}

// This is the action function that will be called when the form is submitted.
export async function action({ request }) {
  // Get the email and password from the request body.
  const form = await request.formData();
  const email = form.get("email");
  const password = form.get("password");

  // Log in the user and return the response.
  return await logIn(email, password);
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
