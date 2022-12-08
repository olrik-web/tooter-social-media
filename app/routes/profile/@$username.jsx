import { json } from "@remix-run/node";
import { Form, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import connectDb from "~/db/connectDb.server";
import { requireUserLogin, logOut } from "~/utils/auth.server";
import Button from "~/components/Button";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import NavigateBackButton from "~/components/NavigateBackButton";

export async function loader({ request, params }) {
  // Get the user that is currently logged in.
  await requireUserLogin(request);

  console.log(request.url);

  // Find the current user using the userId from the session.
  const db = await connectDb();
  const user = await db.models.User.findOne({ username: params.username });

  // Find the user's posts.
  const posts = await db.models.Post.find({ createdBy: user._id });

  return json({ user, posts });
}

export default function Profile() {
  // Get the user from the loader.
  const { user, posts } = useLoaderData();
  const postsCount = posts.length;
  const memberSince = new Date(user.createdAt).toLocaleDateString();

  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center justify-start px-4 gap-x-4">
          <div>
            <NavigateBackButton />
          </div>
          <div>
            <h2 className="text-2xl font-bold">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-sm text-gray-500">{postsCount} Toots</p>
          </div>
        </div>
        <div className="px-4">
          <Form method="post">
            <Button type="submit" name="_action" value="logOut">
              Log Out
            </Button>
          </Form>
        </div>
      </div>
      {/* TODO: Cover image */}
      {/* Profile picture */}
      <div className="m-4">
        <img src={user.avatar} alt="avatar" className="h-32 w-32 rounded-full border-4 border-gray-200 dark:border-gray-800" />
      </div>
      {/* Profile info */}
      <div className="m-4">
        <div className="flex flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-sm text-gray-500">@{user.username}</p>
          </div>
          <Button path="settings">Edit profile</Button>
        </div>
        <p className="text-sm my-4">{user.bio}</p>
        <div className="flex flex-row items-center justify-start gap-x-2">
          <CalendarDaysIcon className="h-4 w-4 text-gray-500" />
          <p className="text-sm text-gray-500">Member since {memberSince}</p>
        </div>
        <div className="flex flex-row items-center justify-start gap-x-2 my-2">
          <p>
            {user.following.length} <span className="text-gray-500">Following</span>
          </p>
          <p>
            {user.followers.length} <span className="text-gray-500">Followers</span>
          </p>
        </div>
      </div>
      {/* Toots, replies, stars */}
      <div className="flex flex-row items-center justify-evenly my-4 gap-x-4 text-center">
        <NavLink
          to={`/profile/@${user.username}/toots`}
          className={({ isActive }) =>
            isActive
              ? "w-full font-bold border-b-2 border-blue-600"
              : "w-full text-gray-500 hover:font-bold hover:border-b-2 hover:border-blue-600 dark:hover:text-white transition duration-300 ease-in-out"
          }
        >
          Toots
        </NavLink>
        <NavLink
          to={`/profile/@${user.username}/comments`}
          className={({ isActive }) =>
            isActive
              ? "w-full font-bold border-b-2 border-blue-600"
              : "w-full text-gray-500 hover:font-bold hover:border-b-2 hover:border-blue-600 dark:hover:text-white transition duration-300 ease-in-out"
          }
        >
          Comments
        </NavLink>
        <NavLink
          to={`/profile/@${user.username}/starred`}
          className={({ isActive }) =>
            isActive
              ? "w-full font-bold border-b-2 border-blue-600"
              : "w-full text-gray-500 hover:font-bold hover:border-b-2 hover:border-blue-600 dark:hover:text-white transition duration-300 ease-in-out"
          }
        >
          Starred Toots
        </NavLink>
      </div>
      <Outlet />
    </>
  );
}

export function action({ request, params }) {
  return logOut(request);
}
