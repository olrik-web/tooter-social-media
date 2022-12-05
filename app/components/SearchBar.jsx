import { Form, NavLink } from "@remix-run/react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

export default function SearchBar({ handleSearchTermChange }) {
  const classActive =
    "block p-3 rounded-lg text-lg font-bold text-center text-white bg-blue-700 transition duration-300 ease-in-out";
  const classNotActive =
    "block p-3 rounded-lg text-lg font-bold text-center text-white bg-blue-500 hover:bg-blue-700 hover:text-white transition duration-300 ease-in-out";

  return (
    <div className="flex flex-row items-center justify-center w-full">
      <Form
        method="get"
        onChange={handleSearchTermChange}
        className="w-full"
      >
        <input
          className="w-full p-2 my-2 mx-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
          name="searchQuery"
          type="text"
          placeholder="Search"
        />
      </Form>
      <NavLink to="./create" className={({ isActive }) => (isActive ? classActive : classNotActive)}>
        <div className="flex flex-row items-center whitespace-nowrap gap-x-4">
          <p className="text-sm">New Snippet</p>
          <PlusCircleIcon className="w-6 h-6" />
        </div>
      </NavLink>
    </div>
  );
}
