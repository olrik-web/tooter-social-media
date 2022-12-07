import { Form, Link, NavLink } from "@remix-run/react";
import { useState } from "react";
import {
  HomeIcon,
  ClockIcon,
  BookmarkIcon,
  UserGroupIcon,
  UserIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  HashtagIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import FormField from "./FormField";

export default function NavigationMenu({ actionData, snippetFolders, isExpanded, setIsExpanded }) {
  const classNotActive = `flex flex-row items-center h-16 ${
    isExpanded ? "justify-start pl-8" : "justify-center"
  } hover:bg-gray-900 transition-all duration-300 `;
  const classActive = "bg-gray-900 text-white font-bold";

  return (
    <nav
      className={`fixed h-screen flex flex-col flex-shrink-0 m-auto ${
        isExpanded ? "w-48" : "w-16"
      } transition-all duration-300`}
    >
      {/* Logo */}
      <Link to="/explore" className={classNotActive} title="Tooter" aria-label="Tooter">
        <img className="w-6 h-6" src="/images/logo.png" alt="Tooter Logo" />
        <span className={`${isExpanded ? "block ml-2 font-bold" : "hidden"}`}>Tooter</span>
      </Link>
      {/* Explore */}
      <NavLink to="/explore" className={({ isActive }) => (isActive ? classNotActive + classActive : classNotActive)} title="Explore" aria-label="Explore">
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
      {/* Bookmarks */}
      <NavLink to="/bookmarks" className={({ isActive }) => (isActive ? classNotActive + classActive : classNotActive)} title="Bookmarks" aria-label="Bookmarks">
        <BookmarkIcon className="w-6 h-6" />
        <span className={`${isExpanded ? "block ml-2" : "hidden"}`}>Bookmarks</span>
      </NavLink>
      {/* Groups */}
      <NavLink to="/groups" className={({ isActive }) => (isActive ? classNotActive + classActive : classNotActive)} title="Groups" aria-label="Groups">
        <UserGroupIcon className="w-6 h-6" />
        <span className={`${isExpanded ? "block ml-2" : "hidden"}`}>Groups</span>
      </NavLink>
      {/* Profile TODO: Add username to navlink, so it isn't active on another users profile */}
      <NavLink to="/profile" className={({ isActive }) => (isActive ? classNotActive + classActive : classNotActive)} title="Profile" aria-label="Profile">
        <UserIcon className="w-6 h-6" />
        <span className={`${isExpanded ? "block ml-2" : "hidden"}`}>Profile</span>
      </NavLink>
      {/* Toot */}
      <NavLink to="/toot" className={({ isActive }) => (isActive ? classNotActive + classActive : classNotActive)} title="New Toot" aria-label="New Toot">
        <PlusIcon className="w-6 h-6" />
        <span className={`${isExpanded ? "block ml-2" : "hidden"}`}>New Toot</span>
      </NavLink>
      {/* Expand/Collapse */}
      <button className={classNotActive} onClick={() => setIsExpanded(!isExpanded)} title="Expand/Collapse" aria-label="Expand/Collapse">
        {isExpanded ? <ArrowLeftIcon className="w-6 h-6" /> : <ArrowRightIcon className="w-6 h-6" />}
        <span className={`${isExpanded ? "block ml-2" : "hidden"}`}>Minimize</span>
      </button>
    </nav>
  );
}
