/*
 * This file is used to handle the follow and unfollow functionality of the users.
 * It is used to add and remove the user from the followers/following lists.
 */

import { json } from "@remix-run/node";
import connectDb from "~/db/connectDb.server";
import { getUser } from "./auth.server";

export async function handleFollow(request, otherUserUsername) {
  // Connect to the database
  const db = await connectDb();

  // Get the current user
  const currentUser = await getUser(request);

  // Get the user to follow/unfollow
  const otherUser = await db.models.User.findOne({
    username: otherUserUsername,
  });
  // Check if the user is already following the other user
  if (isFollowing(currentUser, otherUser)) {
    // If so, unfollow the other user
    return unfollowUser(currentUser, otherUser);
  } else {
    // If not, follow the other user
    return followUser(currentUser, otherUser);
  }
}

async function followUser(currentUser, otherUser) {
  try {
    // Add the user to the followers list of the user to follow
    otherUser.followers.push(currentUser._id);
    await otherUser.save();

    // Add the user to the following list of the current user
    currentUser.following.push(otherUser._id);
    await currentUser.save();

    return json({ success: true });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

async function unfollowUser(currentUser, otherUser) {
  try {
    // Remove the user from the followers list of the user to unfollow
    otherUser.followers.pull(currentUser._id);
    await otherUser.save();

    // Remove the user from the following list of the current user
    currentUser.following.pull(otherUser._id);
    await currentUser.save();

    return json({ success: true });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

function isFollowing(currentUser, user) {
  return currentUser.following.includes(user._id);
}
