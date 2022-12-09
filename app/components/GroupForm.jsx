import { Form } from "@remix-run/react";
import Button from "./Button";
import FormField from "./FormField";
import { useEffect, useState } from "react";

// This component is used on the create and update post pages.
export default function GroupForm({ errors, action, group, isCreating }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState("");

  // If we are updating a post, set the initial values.
  useEffect(() => {
    if (group) {
      setName(group.name);
      setDescription(group.description);
      setPrivacy(group.privacy);
    }
  }, [group]);

  return (
    <>
      {/* The action will be "/update" or "/create" depending on which page the GroupForm is used on. */}
      <Form method="POST" action={action}>
        {/* If there are errors, display them. */}
        {errors && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline">{errors}</span>
          </div>
        )}

        {/* The name field. */}
        <FormField
          label="Name"
          name="name"
          defaultValue={name}
          type="text"
          errors={errors?.name}
          element="input"
          isRequired={true}
          placeholderText="Enter a name for your group."
        />

        {/* The description field. */}
        <FormField
          label="Description"
          name="description"
          defaultValue={description}
          type="text"
          errors={errors?.description}
          element="textarea"
          isRequired={true}
          placeholderText="Enter a description for your group."
        />

        {/* The privacy field. */}
        <FormField
          label="Privacy"
          name="privacy"
          defaultValue={privacy}
          type="text"
          errors={errors?.privacy}
          element="select"
          handlePrivacyChange={setPrivacy}
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
        </FormField>

        {/* The submit button. */}
        <div className="w-full text-center">
          <Button type="submit" classType="primary" name="_action" value="create">
            {isCreating ? "Saving..." : "Save"}
          </Button>
        </div>
      </Form>
      {/* TODO: Check if this is necessary. This error message will be displayed if something went really wrong.*/}
      <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full">{errors?.error || errors}</div>
    </>
  );
}
