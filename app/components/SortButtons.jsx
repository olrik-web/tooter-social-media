import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline";

export default function SortButtons({
  sort,
  setSort,
  sortOrderDescDate,
  setSortOrderDescDate,
  sortOrderDescTitle,
  setSortOrderDescTitle,
  sortOrderDescFavorite,
  setSortOrderDescFavorite,
}) {
  const activeSortClass = "text-white font-semibold py-2 px-4 bg-blue-500 hover:bg-blue-700 rounded transition duration-300 ease-in-out";
  const sortClass = "text-gray-800 font-semibold py-2 px-4 rounded hover:bg-gray-300 transition duration-300 ease-in-out";

  return (
    <div className="flex flex-col items-center lg:flex-row bg-gray-200 rounded">
      <div className="mx-4">
      Sort:
      </div>
      <button
        className={sort === "title" ? activeSortClass : sortClass}
        onClick={() => {
          setSort("title");
          setSortOrderDescTitle(!sortOrderDescTitle);
        }}
      >
        <div className="flex flex-row gap-x-2 items-center">
          Title
          {sort === "title" ? (
            sortOrderDescTitle ? (
              <ArrowDownIcon className="w-6 h-6" />
            ) : (
              <ArrowUpIcon className="w-6 h-6" />
            )
          ) : null}
        </div>
      </button>
      <button
        className={sort === "date" ? activeSortClass : sortClass}
        onClick={() => {
          setSort("date");
          setSortOrderDescDate(!sortOrderDescDate);
        }}
      >
        <div className="flex flex-row gap-x-2 items-center">
          Date
          {sort === "date" ? (
            sortOrderDescDate ? (
              <ArrowDownIcon className="w-6 h-6" />
            ) : (
              <ArrowUpIcon className="w-6 h-6" />
            )
          ) : null}
        </div>
      </button>
      <button
        className={sort === "favorite" ? activeSortClass : sortClass}
        onClick={() => {
          setSort("favorite");
          setSortOrderDescFavorite(!sortOrderDescFavorite);
        }}
      >
        <div className="flex flex-row gap-x-2 items-center">
          Favorite
          {sort === "favorite" ? (
            sortOrderDescFavorite ? (
              <ArrowDownIcon className="w-6 h-6" />
            ) : (
              <ArrowUpIcon className="w-6 h-6" />
            )
          ) : null}
        </div>
      </button>
    </div>
  );
}
