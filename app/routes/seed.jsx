import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useTransition } from "@remix-run/react";
import connectDb from "~/db/connectDb.server";
import bcrypt from "bcryptjs";

export const loader = async ({ request }) => {
  const db = await connectDb();
  const posts = await db.models.Post.countDocuments();
  const users = await db.models.User.countDocuments();
  const groups = await db.models.Group.countDocuments();
  const comments = await db.models.Comment.countDocuments();
  const tags = await db.models.Tag.countDocuments();

  return json({ posts, users, groups, comments, tags });
};

export default function Seed() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const transition = useTransition();

  const isSeeding = transition.state === "submitting" || transition.state === "loading";

  return (
    <div>
      <div className="text-center">
        <h1 className="text-2xl font-bold">Seed</h1>
        <div className="p-4 rounded mt-4">
          <p>
            Database has <span className="text-red-500 font-bold">{loaderData.posts}</span> posts,{" "}
            <span className="text-red-500 font-bold">{loaderData.users}</span> users,{" "}
            <span className="text-red-500 font-bold">{loaderData.groups}</span> groups,{" "}
            <span className="text-red-500 font-bold">{loaderData.comments}</span> comments, and{" "}
            <span className="text-red-500 font-bold">{loaderData.tags}</span> tags.
          </p>
          <p className="mt-4"> Are you sure you want to delete the existing data and seed the database?</p>
          <Form method="post" className="mt-4">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              {isSeeding ? "Seeding..." : "Seed"}
            </button>
          </Form>
          {actionData && actionData.error && <p className="mt-4 text-red-500">{actionData.error}</p>}
        </div>
      </div>
    </div>
  );
}

export async function action({ request }) {
  // Seed the database with some data.
  try {
    const db = await connectDb();
    await db.models.Post.deleteMany({});
    await db.models.User.deleteMany({});
    await db.models.Group.deleteMany({});
    await db.models.Comment.deleteMany({});
    await db.models.Tag.deleteMany({});
    const password = await bcrypt.hash("password", 10);
    const user1 = await db.models.User.create({
      username: "john",
      password: password,
      firstName: "John",
      lastName: "Doe",
      avatar: `https://avatars.dicebear.com/api/bottts/john.svg`,
      bio: "I'm a bio",
    });
    const user2 = await db.models.User.create({
      username: "jane",
      password: password,
      firstName: "Jane",
      lastName: "Doe",
      avatar: `https://avatars.dicebear.com/api/bottts/jane.svg`,
      bio: "I'm a bio",
    });

    for (let i = 0; i < 10; i++) {
      await db.models.User.create({
        username: `user${i}`,
        password: password,
        firstName: `User${i}`,
        lastName: `Doe`,
        avatar: `https://avatars.dicebear.com/api/bottts/user${i}.svg`,
        bio: "I'm a bio",
      });
    }

    const tag1 = await db.models.Tag.create({
      name: "javascript",
    });
    const tag2 = await db.models.Tag.create({
      name: "react",
    });
    const tag3 = await db.models.Tag.create({
      name: "remix",
    });
    const tag4 = await db.models.Tag.create({
      name: "mongoose",
    });
    const tag5 = await db.models.Tag.create({
      name: "mongodb",
    });

    const group1 = await db.models.Group.create({
      name: "Remix",
      description: "A group for remix",
      createdBy: user1._id,
      members: [user1._id, user2._id],
    });
    const group2 = await db.models.Group.create({
      name: "React",
      description: "A group for react",
      createdBy: user2._id,
      members: [user1._id, user2._id],
      privacy: "private",
    });

    const post1 = await db.models.Post.create({
      content: "Hello world from John!",
      createdBy: user1._id,
      tags: [tag1._id, tag2._id, tag3._id],
      stars: [user2._id, user1._id],
      bookmarks: [user2._id],
      images: [
        "https://images.unsplash.com/photo-1670680460892-9f2dd0ec6cdc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1887&q=80",
      ],
      group: null,
    });
    const post2 = await db.models.Post.create({
      content: "Hello world from Jane!",
      createdBy: user2._id,
      tags: [tag1._id, tag2._id],
      stars: [user1._id],
      bookmarks: [user1._id],
      images: [
        "https://images.unsplash.com/photo-1670611554940-c813196be2fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
        "https://images.unsplash.com/photo-1670735403682-0faa5ec7dd75?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
      ],
      group: null,
      createdAt: new Date("2021-01-01"),
    });

    const post3 = await db.models.Post.create({
      content: "Hello world from John in Remix public group!",
      createdBy: user1._id,
      tags: [tag1._id, tag2._id, tag3._id],
      stars: [user2._id, user1._id],
      bookmarks: [user2._id],
      images: [
        "https://images.unsplash.com/photo-1670680460892-9f2dd0ec6cdc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1887&q=80",
      ],
      group: group1._id,
    });
    const post4 = await db.models.Post.create({
      content: "Hello world from Jane in React private group!",
      createdBy: user2._id,
      tags: [tag1._id, tag2._id],
      stars: [user1._id],
      bookmarks: [user1._id],
      images: [
        "https://images.unsplash.com/photo-1670611554940-c813196be2fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
        "https://images.unsplash.com/photo-1670735403682-0faa5ec7dd75?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
      ],
      group: group2._id,
      createdAt: new Date("2021-01-01"),
    });

    const comment1 = await db.models.Comment.create({
      content: "Comment from John",
      createdBy: user1._id,
      post: post1._id,
    });
    const comment2 = await db.models.Comment.create({
      content: "Comment from Jane",
      createdBy: user2._id,
      post: post1._id,
    });
    const comment3 = await db.models.Comment.create({
      content: "Comment from John",
      createdBy: user1._id,
      post: post2._id,
    });
    const comment4 = await db.models.Comment.create({
      content: "Comment from Jane",
      createdBy: user2._id,
      post: post2._id,
    });

    const comment5 = await db.models.Comment.create({
      content: "Comment from John",
      createdBy: user1._id,
      post: post3._id,
    });
    const comment6 = await db.models.Comment.create({
      content: "Comment from Jane",
      createdBy: user2._id,
      post: post3._id,
    });

    post1.comments = [comment1._id, comment2._id];
    post2.comments = [comment3._id, comment4._id];
    post3.comments = [comment5._id, comment6._id];

    await post1.save();
    await post2.save();
    await post3.save();

    group1.posts = [post3._id];
    group2.posts = [post4._id];

    await group1.save();
    await group2.save();

    tag1.posts = [post1._id, post2._id, post3._id, post4._id];
    tag2.posts = [post1._id, post2._id, post3._id, post4._id];
    tag3.posts = [post3._id, post4._id];

    await tag1.save();
    await tag2.save();
    await tag3.save();

    user1.following = [user2._id];
    user1.followers = [user2._id];

    user2.following = [user1._id];
    user2.followers = [user1._id];

    user1.starredPosts = [post1._id, post2._id, post3._id, post4._id];
    user2.starredPosts = [post1._id, post3._id];

    user1.bookmarkedPosts = [post2._id, post4._id];
    user2.bookmarkedPosts = [post1._id, post3._id];

    await user1.save();
    await user2.save();

    console.log("Database seeded!");

    return redirect("/explore");
  } catch (error) {
    console.error(error);
    return json({ error: error.message }, { status: 500 });
  }
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
