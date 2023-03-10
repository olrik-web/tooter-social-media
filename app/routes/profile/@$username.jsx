import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import connectDb from "~/db/connectDb.server";
import { logOut, getUser } from "~/utils/auth.server";
import Button from "~/components/Button";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import NavigateBackButton from "~/components/NavigateBackButton";
import { handleFollow } from "~/utils/follow.server";

export async function loader({ request, params }) {
  // Get the user that is currently logged in.
  const currentUser = await getUser(request);

  // Find the current user using the userId from the session.
  const db = await connectDb();
  const user = await db.models.User.findOne({ username: params.username });

  // Find the user's posts.
  const posts = await db.models.Post.find({ createdBy: user._id });

  return json({ user, posts, currentUser });
}

export default function Profile() {
  // Get the user from the loader.
  const { user, posts, currentUser } = useLoaderData();
  const postsCount = posts.length;
  const memberSince = new Date(user.createdAt).toLocaleDateString();

  function isFollowing(currentUser, user) {
    return currentUser?.following.includes(user._id);
  }

  function isFollowedBy(currentUser, user) {
    return currentUser?.followers.includes(user._id);
  }

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
        {currentUser && currentUser?._id === user._id && (
          <div className="px-4">
            <Form method="post">
              <Button type="submit" name="_action" value="logOut">
                Log Out
              </Button>
            </Form>
          </div>
        )}
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
          {currentUser && currentUser?._id === user._id && <Button path="settings">Edit profile</Button>}
        </div>
        <p className="text-sm my-4">{user.bio}</p>
        <div className="flex flex-row items-center justify-start gap-x-2">
          <CalendarDaysIcon className="h-4 w-4 text-gray-500" />
          <p className="text-sm text-gray-500">Member since {memberSince}</p>
        </div>
        <div className="flex flex-row items-center justify-start gap-x-2 my-2">
          <Link to={`/profile/@${user.username}/following`}>
            {user.following.length} <span className="text-gray-500">Following</span>
          </Link>
          <Link to={`/profile/@${user.username}/followers`}>
            {user.followers.length} <span className="text-gray-500">Followers</span>
          </Link>
        </div>
        {/* Text that shows if we are following or followed by the user. */}
        <div className="my-2">{isFollowedBy(currentUser, user) && <p className="text-gray-500">@{user.username} follows you</p>}</div>
        {/* Follow/unfollow button */}
        <div className="flex flex-row items-center justify-start gap-x-2 my-2">
          {/* Display a (un)follow button if we are logged in and not on our own profile. */}
          {currentUser && currentUser?._id !== user._id && (
            <Form method="post">
              <Button type="submit" name="_action" value="follow">
                {isFollowing(currentUser, user) ? "Unfollow" : "Follow"}
              </Button>
            </Form>
          )}
        </div>
      </div>
      {/* Toots, replies, stars */}
      <div className="flex flex-row items-center justify-evenly my-4 gap-x-4 text-center">
        <NavLink
          end
          to={`/profile/@${user.username}`}
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

export async function action({ request, params }) {
  const form = await request.formData();
  const action = form.get("_action");

  if (action === "follow") {
    return await handleFollow(request, params.username);
  } else if (action === "logOut") {
    return await logOut(request);
  }
  return null;
}

// Catch any unexpected errors and display them to the user.
export function ErrorBoundary({ error }) {
  return (
    <div className="text-red-500 text-center">
      <h1 className="text-2xl font-bold">Error</h1>
      <p>{error.message}</p>
    </div>
  );
}
