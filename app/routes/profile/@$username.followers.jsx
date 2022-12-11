import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { Link } from "react-router-dom";
import Button from "~/components/Button";
import NavigateBackButton from "~/components/NavigateBackButton";
import connectDb from "~/db/connectDb.server";
import { getUser } from "~/utils/auth.server";
import { handleFollow } from "~/utils/follow.server";

export async function loader({ request, params }) {
  // Connect to the database
  const db = await connectDb();
  // Find the user using the username from the request params
  const user = await db.models.User.findOne({ username: params.username });
  const currentUser = await getUser(request);
  // Find the users that the current user is followers
  const followers = await db.models.User.find({ _id: { $in: user.followers } });
  return json({ followers, currentUser });
}

export default function FollowingPage() {
  const { followers, currentUser } = useLoaderData();
  function isFollowing(currentUser, user) {
    return currentUser.following.includes(user._id);
  }

  return (
    <div className="flex flex-row">
      <div className="w-full">
        <NavigateBackButton showText={true} />
        <h1 className="text-3xl font-bold border border-gray-600 p-4">Followers</h1>
        <div className="border-x border-b border-gray-600">
          {followers.length === 0 && <p className="text-xl font-bold p-4">You have no followers yet.</p>}
          {followers.map((user) => (
            <div key={user._id} className="flex flex-row p-4 items-center">
              <Link to={`/profile/@${user.username}`} className="w-1/12">
                <img src={user.avatar} alt="avatar" className="rounded-full w-10 h-10" />
              </Link>
              <div className="w-11/12">
                <div className="flex flex-row">
                  <div className="w-10/12">
                    <Link to={`/profile/@${user.username}`}>
                      <p className="text-xl font-bold">
                        {user.firstName} {user.lastName}
                      </p>
                      <h1 className="text-sm text-gray-600">@{user.username}</h1>
                    </Link>
                  </div>
                  <div className="w-2/12">
                    {currentUser && currentUser?._id !== user._id && (
                      <Form method="post">
                        <input type="hidden" name="username" value={user.username} />
                        <Button type="submit" name="_action" value="follow">
                          {isFollowing(currentUser, user) ? "Unfollow" : "Follow"}
                        </Button>
                      </Form>
                    )}
                  </div>
                </div>
                <p className="text-sm">{user.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export async function action({ request }) {
  const form = await request.formData();
  const action = form.get("_action");
  const username = form.get("username");

  if (action === "follow") {
    return await handleFollow(request, username);
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
