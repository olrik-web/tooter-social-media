import { Form, useParams } from "@remix-run/react";
import Button from "./Button";
import FormField from "./FormField";
import { useEffect, useState } from "react";

// This component is used on the create and update post pages.
export default function SnippetForm({ errors, action, groups, post, isCreating }) {
  const params = useParams();
  const [postTags, setPostTags] = useState("");
  const [postGroup, setPostGroup] = useState("");
  const [postImages, setPostIamges] = useState("");
  const [postContent, setPostContent] = useState("");

  

  // If we are updating a snippet, set the initial values.

  useEffect(() => {
    if (post) {
      console.log(post);
      const tags = post.tags?.map((tag) => tag.name).join(", ");
      setPostTags(tags);
      setPostGroup(post.group?._id);
      setPostIamges(post.images.join(","));
      setPostContent(post.content);
    }
  }, [post]);

  return (
    <>
      {/* The action will be "/update" or "/create" depending on which page the SnippetForm is used on. */}
      <Form method="POST" action={action} className="rounded-2xl bg-gray-200 p-6">
        {/* If there are errors, display them. */}
        {errors && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline">{errors}</span>
          </div>
        )}

        {/* The content field. */}
        <FormField
          label="Content"
          name="content"
          defaultValue={postContent}
          type="text"
          errors={errors?.content}
          element="textarea"
          isRequired={true}
        />

        {/* The group field. */}
        <FormField
          label="Group"
          name="group"
          defaultValue={postGroup}
          type="text"
          errors={errors?.group}
          element="select"
          handleGroupChange={setPostGroup}
          > 
          {/* If there are no groups, display a message. */}
          {groups.length === 0 && <option value="">You are not a member of any groups.</option>}
          {/* If there are groups, display them. */}
          {groups.map((group) => (
            <option key={group._id} value={group._id}>
              {group.name}
            </option>
          ))}
        </FormField>
       
        {/* The tags field. */}
        <FormField
          label="Tags (separate with commas)"
          name="tags"
          defaultValue={postTags}
          type="text"
          errors={errors?.tags}
          element="input"
        />

        {/* The images field. */}
        <FormField
          label="Images (separate with commas)"
          name="images"
          defaultValue={postImages}
          type="text"
          errors={errors?.images}
          element="input"
        />

        {/* The submit button. */}
        <div className="w-full text-center">
          <Button type="submit" classType="primary" name="_action" value="create">
            {isCreating ? "Saving..." : "Save"}
          </Button>
        </div>
      </Form>
      {/* TODO: Check if this is necessary. This error message will be displayed if something went really wrong.*/}
      <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full">
        {errors?.error || errors}
      </div>
    </>
  );
}
