import { Form, NavLink } from "@remix-run/react";
import { useState } from "react";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import FormField from "./FormField";
import SnippetFolderCard from "./SnippetFolderCard";

export default function NavigationMenu({ actionData, snippetFolders }) {
  const [newCollection, setNewCollection] = useState(false);
  const classActive = "block py-2 pr-4 pl-3 text-white bg-blue-700";
  const classNotActive = "block py-2 pr-4 pl-3 text-gray-400 hover:bg-gray-700 hover:text-white transition duration-300 ease-in-out";

  return (
    <nav className="fixed w-72 h-full top-16 left-0 pt-10 overflow-x-hidden text-center bg-gray-900 text-white">
      <div className="flex flex-row justify-between items-center mx-8">
        <h2 className="text-2xl font-bold text-center text-gray-400">Collections</h2>
        {newCollection ? (
          <button onClick={() => setNewCollection(false)} className="text-blue-500">
            <MinusIcon className="w-6 h-6" />
          </button>
        ) : (
          <button onClick={() => setNewCollection(true)} className=" text-blue-500">
            <PlusIcon className="w-6 h-6" />
          </button>
        )}
      </div>
      {newCollection && (
        <Form method="POST" action="/snippets" className="flex flex-col mx-8">
          <FormField label="Name" name="name" type="text" errors={actionData?.name} element="input" />
          <button
            type="submit"
            className="w-full p-2 my-2 text-white bg-blue-500 rounded-lg shadow-sm focus:outline-none focus:bg-blue-600"
          >
            Create
          </button>
        </Form>
      )}
      <hr className="my-4" />
      <ul>
        <li>
          <NavLink
            end
            to="/snippets"
            className={({ isActive }) =>
              isActive
                ? classActive + " text-lg font-bold text-center"
                : classNotActive + " text-lg font-bold text-center"
            }
          >
            All snippets
          </NavLink>
        </li>
        {snippetFolders.map((snippet) => (
          <li key={snippet._id}>
            <NavLink
              to={snippet._id.toString()}
              className={({ isActive }) => (isActive ? classActive : classNotActive)}
            >
              <SnippetFolderCard snippet={snippet} />
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
