import { Form, useParams } from "@remix-run/react";
import Button from "./Button";
import FormField from "./FormField";
import { useEffect, useState } from "react";

// This component is used on the create and update post pages.
export default function PostForm({ errors, action, groups, post, isCreating }) {
  const [postTags, setPostTags] = useState("");
  const [postGroup, setPostGroup] = useState("");
  const [postImages, setPostIamges] = useState("");
  const [postContent, setPostContent] = useState("");

  // If we are updating a post, set the initial values.
  useEffect(() => {
    if (post) {
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
      <Form method="POST" action={action}>
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
          placeholderText="What do you want to share?"
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
          <option value="">Select a group (optional)</option>
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
          placeholderText="e.g. javascript, react, remix"
        />

        {/* The images field. */}
        <FormField
          label="Images (separate with commas)"
          name="images"
          defaultValue={postImages}
          type="text"
          errors={errors?.images}
          element="input"
          placeholderText="e.g. https://i.imgur.com/abc123.jpg, https://i.imgur.com/def456.jpg"
        />

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
