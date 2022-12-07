import { Link } from "@remix-run/react";
import SearchBar from "./SearchBar.jsx";

export default function MenuRight({ users, tags, handleSearchTermChange }) {
  return (
    <div className="sticky top-0 m-2">
      <SearchBar handleSearchTermChange={handleSearchTermChange} />
      {/* Search results */}
      <div className="mt-2 p-2 rounded-3xl dark:bg-gray-800">
        <h2 className="text-xl font-bold">Users</h2>
        {users.map((user) => (
          <Link
            to={`/profile/@${user.username}`}
            key={user._id}
            className="flex flex-row gap-x-2 items-center p-2 my-2 rounded-3xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
          >
            <img className="w-8 h-8 rounded-full" src={user.avatar} alt="avatar" />
            <p>@{user.username}</p>
          </Link>
        ))}
      </div>
      <div className="mt-2 p-2 rounded-3xl dark:bg-gray-800">
        <h2 className="text-xl font-bold">Tags</h2>
        {tags.map((tag) => (
          <Link
            to={`/tags/${tag.name}`}
            key={tag._id}
            className="flex flex-row gap-x-2 items-center p-2 my-2 rounded-3xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
          >
            <p>#{tag.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
