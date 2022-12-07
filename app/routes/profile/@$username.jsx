import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import connectDb from "~/db/connectDb.server";
import { requireUserLogin, logOut } from "~/utils/auth.server";
import { updatePostBookmark, updatePostStar } from "~/utils/post.server";
import Button from "~/components/Button";
import { ArrowLeftIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import PostCard from "~/components/PostCard";
import NavigateBackButton from "~/components/NavigateBackButton";

export async function loader({ request, params }) {
  // Get the user that is currently logged in.
  const currentUserId = await requireUserLogin(request);

  console.log(request.url);

  // Find the current user using the userId from the session.
  const db = await connectDb();
  const user = await db.models.User.findOne({ username: params.username });
  const currentUser = await db.models.User.findById(currentUserId);

  // Find the user's posts.
  const posts = await db.models.Post.find({ createdBy: user._id });

  return json({ user, posts, currentUser, requestUrl: request.url });
}

export default function Profile() {
  // Get the user from the loader.
  const { user, posts, currentUser, requestUrl } = useLoaderData();
  const postsCount = posts.length;
  const memberSince = new Date(user.createdAt).toLocaleDateString();

  return (
    <>
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
      {/* TODO: Cover image */}
      {/* Profile picture */}
      <div className="m-4">
        <img
          src={user.avatar}
          alt="avatar"
          className="h-32 w-32 rounded-full border-4 border-gray-200 dark:border-gray-800"
        />
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
            isActive ? "w-full font-bold border-b-2 border-blue-600" : "w-full text-gray-500"
          }
        >
          Toots
        </NavLink>
        <NavLink
          to={`/profile/@${user.username}/comments`}
          className={({ isActive }) =>
            isActive ? "w-full font-bold border-b-2 border-blue-600" : "w-full text-gray-500"
          }
        >
          Comments
        </NavLink>
        <NavLink
          to={`/profile/@${user.username}/starred`}
          className={({ isActive }) =>
            isActive ? "w-full font-bold border-b-2 border-blue-600" : "w-full text-gray-500"
          }
        >
          Starred Toots
        </NavLink>
      </div>
      <Outlet />

      <Form method="post">
        <Button type="submit" classType="primary" name="_action" value="logOut">
          Log Out
        </Button>
      </Form>
    </>
  );
}
