import { Form } from "@remix-run/react";
import FormField from "./FormField";
import Button from "./Button";
import { useEffect, useState } from "react";

// This component is used on the login and signup pages.
export default function LoginForm({ errors, action, isEdit, user }) {
  const [username, setUsername] = useState(user?.username || "");
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");

  // Fill in the form fields with the user's information if they are already logged in.
  useEffect(() => {
    setUsername(user?.username || "");
    setFirstName(user?.firstName || "");
    setLastName(user?.lastName || "");
  }, [user]);

  return (
    //  The action prop will be "/login" or "/signup" depending on which page the LoginForm is used on.
    <Form method="POST" action={action} className="rounded-2xl p-6 w-96">
      <FormField
        label="Username"
        name="username"
        type="username"
        errors={errors?.username}
        element="input"
        isRequired={true}
        placeholderText="Username"
        defaultValue={username}
      />
      <FormField
        label="Password"
        name="password"
        type="password"
        errors={errors?.password}
        element="input"
        isRequired={true}
        placeholderText="Password"
      />

      {/* If the action is "/signup", show the password confirmation and first/last name fields. */}
      {(action === "/signup" || isEdit === true) && (
        <>
          <FormField
            label="Confirm password"
            name="passwordConfirmation"
            type="password"
            element="input"
            errors={errors?.passwordConfirmation}
            isRequired={true}
            placeholderText="Confirm password"
          />
          <FormField
            label="First name"
            name="firstName"
            type="text"
            errors={errors?.firstName}
            element="input"
            isRequired={true}
            placeholderText="First name"
            defaultValue={firstName}
          />
          <FormField
            label="Last name"
            name="lastName"
            type="text"
            errors={errors?.lastName}
            element="input"
            isRequired={true}
            placeholderText="Last name"
            defaultValue={lastName}
          />
        </>
      )}
      {/* The button text will be "Log In" or "Sign Up" depending on which page the LoginForm is used on. */}
      <div className="w-full text-center">
        <Button type="submit" classType="primary">
          {action === "/login" ? "Log In" : action === "/signup" ? "Sign Up" : "Save"}
        </Button>
        {/* This error message will be displayed if something went really wrong.*/}
        <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full">{errors?.error}</div>
      </div>
    </Form>
  );
}
