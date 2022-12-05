import { Form, useParams } from "@remix-run/react";
import Button from "./Button";
import FormField from "./FormField";
import * as languages from "react-syntax-highlighter/dist/cjs/languages/hljs";
import { docco, atomOneDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { useEffect, useState } from "react";

// This component is used on the create and update snippet pages.
export default function SnippetForm({ errors, action, snippetFolders, snippet, isCreating }) {
  const params = useParams();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [darkMode, setDarkMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [snippetTitle, setSnippetTitle] = useState("");
  const [snippetDescription, setSnippetDescription] = useState("");

  function handleCodeChange(e) {
    setCode(e.target.value);
    setCopied(false);
  }
  function handleLanguageChange(e) {
    setLanguage(e.target.value);
  }

  useEffect(() => {
    if (snippet) {
      setSnippetTitle(snippet.title);
      setSnippetDescription(snippet.description);
      setCode(snippet.code);
      setLanguage(snippet.language);
    }
  }, [snippet]);

  return (
    <>
      {/* The action will be "/update" or "/create" depending on which page the SnippetForm is used on. */}
      <Form method="POST" action={action} className="rounded-2xl bg-gray-200 p-6">
        <FormField
          label="Title"
          name="title"
          type="text"
          errors={errors?.title}
          element="input"
          defaultValue={snippetTitle}
          isRequired={true}
          autoFocus={true}
        />
        <FormField
          label="Description"
          name="description"
          type="text"
          errors={errors?.description}
          element="textarea"
          defaultValue={snippetDescription}
        />
        <FormField
          label="Language"
          name="language"
          type="text"
          errors={errors?.language}
          element="select"
          defaultValue={language}
          handleLanguageChange={handleLanguageChange}
          isRequired={true}
        >
          <option value="">Select a language</option>
          {Object.keys(languages).map((language) => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </FormField>
        <FormField
          label="Snippet Folder"
          name="snippetFolder"
          type="text"
          errors={errors?.snippetFolder}
          element="select"
          onChange={params.snippetFolderId}
          defaultValue={params.snippetFolderId}
          isRequired={true}
        >
          <option value="">Select a folder</option>
          {snippetFolders.map((folder) => (
            <option key={folder._id} value={folder._id}>
              {folder.name}
            </option>
          ))}
        </FormField>
        <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full">
          {errors?.snippetFolder?.message}
        </div>
        <div className="w-full text-center">
          <Button type="submit" classType="primary" name="_action" value="create">
            {isCreating ? "Saving..." : "Save"}
          </Button>
        </div>
      </Form>
      {/* This error message will be displayed if something went really wrong.*/}
      <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full">
        {errors?.error || errors}
      </div>
    </>
  );
}
