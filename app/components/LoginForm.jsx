import { Form } from "@remix-run/react";
import FormField from "./FormField";
import Button from "./Button";

// This component is used on the login and signup pages.
export default function LoginForm({ errors, action }) {
  return (
    //  The action prop will be "/login" or "/signup" depending on which page the LoginForm is used on.
    <Form method="POST" action={action} className="rounded-2xl bg-gray-200 p-6 w-96">
      <FormField label="Email" name="email" type="email" errors={errors?.email} element="input" />
      <FormField label="Password" name="password" type="password" errors={errors?.password} element="input" />

      {/* If the action is "/signup", show the password confirmation and first/last name fields. */}
      {action === "/signup" && (
        <>
          <FormField
            label="Confirm password"
            name="passwordConfirmation"
            type="password"
            element="input"
            errors={errors?.passwordConfirmation}
          />
          <FormField label="First name" name="firstName" type="text" errors={errors?.firstName} element="input" />
          <FormField label="Last name" name="lastName" type="text" errors={errors?.lastName} element="input" />
        </>
      )}
      {/* The button text will be "Log In" or "Sign Up" depending on which page the LoginForm is used on. */}
      <div className="w-full text-center">
        <Button type="submit" classType="primary">
          {action === "/login" ? "Log In" : "Sign Up"}
        </Button>
        {/* This error message will be displayed if something went really wrong.*/}
        <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full">{errors?.error}</div>
      </div>
    </Form>
  );
}
