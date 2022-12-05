import { Link, NavLink } from "@remix-run/react";
import { useState } from "react";
import logo from "../images/dall-e-elephant.png";
import { Bars3Icon, XMarkIcon} from "@heroicons/react/24/outline";

export default function Navbar() {
  const [clicked, setClicked] = useState(false);

  const classActive =
    "block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white";
  const classNotActive =
    "block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent transition duration-300 ease-in-out";

  function handleClick() {
    setClicked(!clicked);
  }
  return (
    <nav className="fixed top-0 z-10 w-full py-2 bg-gray-900 xl:px-16">
      <Link to="/" className="flex items-center absolute top-0 left-8">
        <img className="w-16 inline-block" src={logo} alt="Logo" />
        <p className="text-xl font-semibold  dark:text-white">Snip Elephant</p>
      </Link>
      <div className="container flex justify-end items-center mx-auto flex-wrap">
        <button
          type="button"
          onClick={handleClick}
          className="inline-flex items-center p-4 md:hidden text-white overflow-hidden whitespace-nowrap"
        >
          {clicked ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>
        <div
          className={
            clicked
              ? "w-full md:w-auto z-10 absolute md:static top-14 transition-all ease-in-out duration-300 left-0"
              : "w-full md:w-auto z-10 absolute md:static top-14 transition-all ease-in-out duration-300 -left-full  "
          }
        >
          <ul className="flex flex-col p-4 mt-4 bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <NavLink
                to="/"
                onClick={handleClick}
                className={({ isActive }) => (isActive ? classActive : classNotActive)}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                onClick={handleClick}
                className={({ isActive }) => (isActive ? classActive : classNotActive)}
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/snippets"
                onClick={handleClick}
                className={({ isActive }) => (isActive ? classActive : classNotActive)}
              >
                Snippets
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/profile"
                onClick={handleClick}
                className={({ isActive }) => (isActive ? classActive : classNotActive)}
              >
                Profile
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
