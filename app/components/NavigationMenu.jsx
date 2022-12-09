import { Link, NavLink } from "@remix-run/react";
import {
  ClockIcon,
  BookmarkIcon,
  UserIcon,
  UserGroupIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  HashtagIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

export default function NavigationMenu({ currentUser, isExpanded, setIsExpanded }) {
  const classNotActive = `flex flex-row items-center h-16 ${
    isExpanded ? "justify-start pl-12" : "justify-center"
  } hover:bg-gray-900 transition-all duration-300 rounded-3xl `;
  const classActive = "bg-gray-900 text-white font-bold";

  return (
    <nav
      className={`ml-4 fixed h-screen flex flex-col gap-y-2 flex-shrink-0 m-auto ${isExpanded ? "w-56" : "w-16"} transition-all duration-300`}
    >
      {/* Logo */}
      <Link to="/explore" className={classNotActive} title="Tooter" aria-label="Tooter">
        <img className="w-6 h-6" src="/images/logo.png" alt="Tooter Logo" />
        <span className={`${isExpanded ? "block ml-2 font-bold" : "hidden"}`}>Tooter</span>
      </Link>
      {/* Explore */}
      <NavLink
        to="/explore"
        className={({ isActive }) => (isActive ? classNotActive + classActive : classNotActive)}
        title="Explore"
        aria-label="Explore"
      >
        <HashtagIcon className="w-6 h-6" />
        <span className={`${isExpanded ? "block ml-2" : "hidden"}`}>Explore</span>
      </NavLink>
      {/* Recent */}
      <NavLink
        to="/public/local"
        className={({ isActive }) => (isActive ? classNotActive + classActive : classNotActive)}
        title="Recent"
        aria-label="Recent"
      >
        <ClockIcon className="w-6 h-6" />
        <span className={`${isExpanded ? "block ml-2" : "hidden"}`}>Recent</span>
      </NavLink>
      {currentUser ? (
        <>
          {/* Bookmarks */}
          <NavLink
            to="/bookmarks"
            className={({ isActive }) => (isActive ? classNotActive + classActive : classNotActive)}
            title="Bookmarks"
            aria-label="Bookmarks"
          >
            <BookmarkIcon className="w-6 h-6" />
            <span className={`${isExpanded ? "block ml-2" : "hidden"}`}>Bookmarks</span>
          </NavLink>
          {/* Groups */}
          <NavLink
            to="/groups"
            className={({ isActive }) => (isActive ? classNotActive + classActive : classNotActive)}
            title="Groups"
            aria-label="Groups"
          >
            <UserGroupIcon className="w-6 h-6" />
            <span className={`${isExpanded ? "block ml-2" : "hidden"}`}>Groups</span>
          </NavLink>
          {/* New Toot */}
          <NavLink
            to="/newToot"
            className={({ isActive }) => (isActive ? classNotActive + classActive : classNotActive)}
            title="New Toot"
            aria-label="New Toot"
          >
            <PlusIcon className="w-6 h-6" />
            <span className={`${isExpanded ? "block ml-2 whitespace-nowrap" : "hidden"}`}>New Toot</span>
          </NavLink>
          {/* Profile */}
          <NavLink
            to={`profile/@${currentUser.username}`}
            className={({ isActive }) => (isActive ? classNotActive + classActive : classNotActive)}
            title="Profile"
            aria-label="Profile"
          >
            {/* User's avatar */}
            <img className="w-6 h-6 rounded-full" src={currentUser.avatar} alt={`${currentUser.username}'s avatar`} />
            {/* User's name */}
            <span className={`${isExpanded ? "block ml-2" : "hidden"}`}>@{currentUser.username}</span>
          </NavLink>
        </>
      ) : (
        <NavLink
          to="/login"
          className={({ isActive }) => (isActive ? classNotActive + classActive : classNotActive)}
          title="Login"
          aria-label="Login"
        >
          <UserIcon className="w-6 h-6" />
          <span className={`${isExpanded ? "block ml-2" : "hidden"}`}>Login</span>
        </NavLink>
      )}

      {/* Expand/Collapse */}
      <button className={classNotActive} onClick={() => setIsExpanded(!isExpanded)} title="Expand/Collapse" aria-label="Expand/Collapse">
        {isExpanded ? <ArrowLeftIcon className="w-6 h-6" /> : <ArrowRightIcon className="w-6 h-6" />}
        <span className={`${isExpanded ? "block ml-2" : "hidden"}`}>Minimize</span>
      </button>
    </nav>
  );
}
