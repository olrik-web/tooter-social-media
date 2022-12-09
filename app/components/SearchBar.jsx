import { Form } from "@remix-run/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";

export default function SearchBar({ handleSearchTermChange }) {

  return (
    <Form method="get" onChange={handleSearchTermChange}>
      <div className={`flex flex-row gap-x-2 items-center p-1 rounded-3xl dark:bg-gray-800`}>
        <MagnifyingGlassIcon className="w-6 h-6 text-gray-400" />
        <input
          className="dark:bg-gray-800 p-1 rounded-3xl dark:focus:outline-none"
          name="searchQuery"
          type="text"
          placeholder="Search"
          aria-label="Search"
          title="Search"
        />
      </div>
    </Form>
  );
}
