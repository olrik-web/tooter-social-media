import { json, redirect } from "@remix-run/node";
import connectDb from "~/db/connectDb.server";
import { getUserId, requireUserLogin } from "./auth.server";

/*
 * This function creates a post document in the database and returns the post document.
 * It is called when the user clicks the create post button.
 */
export async function createPost(request, content, groupId, tags, images) {
  // Connecting to the database
  const db = await connectDb();

  // Getting the user from the request and returning an error message and a status code of 400 (Bad Request) if the user is not found.
  const userId = await getUserId(request);
  if (!userId) {
    return json({ error: "User not found.", status: 400 });
  }

  // Checking if the title is empty and returning an error message and a status code of 400 (Bad Request) if it is.
  if (!content || content.length === 0) {
    return json({ content: { message: "Content cannot be empty.", status: 400 } });
  }

  if (content.length > 500) {
    return json({
      content: { message: "Content cannot be more than 500 characters.", status: 400 },
    });
  }

  try {
    console.log("Creating post...");
    // If the tags are not empty, then we check if the tags already exist in the database. If they do, then we add the tag id to the tags array. If they don't, then we create a new tag document and add the tag id to the tags array.
    let tagsArray = [];
    console.log("tags: ", tags);
    if (tags && tags.length > 0) {
      for (let i = 0; i < tags.length; i++) {
        const tag = await db.models.Tag.findOne({ name: tags[i] });
        if (tag) {
          console.log("Tag already exists.");
          tagsArray.push(tag._id);
        } else {
          console.log("Tag does not exist.");
          const newTag = await db.models.Tag.create({ name: tags[i] });
          tagsArray.push(newTag._id);
        }
      }
    }
    console.log("Created tags...");
    console.log(tagsArray);

    // Creating the post document in the database
    const newPost = await db.models.Post.create({
      content,
      createdBy: userId,
      group: groupId || null,
      tags: tagsArray,
      images: images || [],
    });

    console.log("Post created successfully.");

    // Adding the post id to the tags post array
    if (tagsArray.length > 0) {
      for (const tagId of tagsArray) {
        const tag = await db.models.Tag.findById(tagId);
        tag.posts.push(newPost._id);
        await tag.save();
      }
    }
    return newPost;
  } catch (error) {
    console.log(error);
    return json({ error: "Post could not be created.", status: 400 });
  }
}

/*
 * This function updates the post document with the given id and returns the updated post document.
 */
export async function updatePost(request, params, content, groupId, tags, images) {
  // Connecting to the database
  const db = await connectDb();

  // Getting the user from the request and returning an error message and a status code of 400 (Bad Request) if the user is not found.
  const userId = await requireUserLogin(request);

  // Checking if the title is empty and returning an error message and a status code of 400 (Bad Request) if it is.
  if (!content || content.length === 0) {
    return json({ content: { message: "Content cannot be empty.", status: 400 } });
  }

  if (content.length > 500) {
    return json({
      content: { message: "Content cannot be more than 500 characters.", status: 400 },
    });
  }

  try {
    // Find the user document with the given id
    const user = await db.models.User.findById(userId);
    console.log("Updating post...");
    // If the tags are not empty, then we check if the tags already exist in the database. If they do, then we add the tag id to the tags array. If they don't, then we create a new tag document and add the tag id to the tags array.
    let tagsArray = [];
    console.log("tags: ", tags);
    if (tags && tags.length > 0) {
      for (let i = 0; i < tags.length; i++) {
        const tag = await db.models.Tag.findOne({ name: tags[i] });
        if (tag) {
          console.log("Tag already exists.");
          tagsArray.push(tag._id);
        } else {
          console.log("Tag does not exist.");
          const newTag = await db.models.Tag.create({ name: tags[i] });
          tagsArray.push(newTag._id);
        }
      }
    }
    console.log("Created tags...");
    console.log(tagsArray);
    console.log(request.params);

    // Update the post document in the database
    const post = await db.models.Post.findById(params.postId);
    // Checking if the user is the owner of the post
    if (post.createdBy.toString() !== user._id.toString()) {
      return json({ error: "You are not the owner of this post.", status: 400 });
    }
    post.content = content;
    post.group = groupId || null;
    post.tags = tagsArray;
    post.images = images || [];
    await post.save();

    console.log("Post updated successfully.");

    // Adding the post id to the tags post array
    if (tagsArray.length > 0) {
      for (const tagId of tagsArray) {
        const tag = await db.models.Tag.findById(tagId);
        tag.posts.push(post._id);
        await tag.save();
      }
    }
    // TODO: Return redirect
    if (groupId) {
      return redirect(`/groups/${groupId}/${post._id}`);
    } else {
      return redirect(`/profile/@${user.username}/${post._id}`);
    }
  } catch (error) {
    console.log(error);
    return json({ error: "Post could not be updated.", status: 400 });
  }
}

// This function uses pagination to return a certain number of post documents in the database.
export async function getPostsPaginated(page, limit) {
  // Connecting to the database
  const db = await connectDb();

  // Getting all the post documents in the database
  const posts = await db.models.Post.find()
    .skip((page - 1) * limit)
    .limit(limit);
  return posts;
}

// This function uses pagnation to return a certain number of post documents in the database that are created by the user with the given id.
export async function getPostsByUserPaginated(userId, page, limit) {
  // Connecting to the database
  const db = await connectDb();

  // Getting all the post documents in the database that are created by the user with the given id
  const posts = await db.models.Post.find({ createdBy: userId })
    .skip((page - 1) * limit)
    .limit(limit);
  return posts;
}

/*
 * This function deletes the post document with the given id.
 */
export async function deletePost(userId, postId) {
  // Connecting to the database
  const db = await connectDb();

  // Getting the post document with the given id
  const post = await db.models.Post.findById(postId);

  if (post.createdBy.toString() !== userId.toString()) {
    return json({ error: "You are not authorized to delete this post.", status: 401 });
  } else {
    // Updating the post document's deleted property to true
    post.isDeleted = true;
    // Saving the updated post document
    const updatedSnippet = await post.save();
    return updatedSnippet;
  }
}

// This function updates the post favorite field of the post document with the given id.
export async function updatePostStar(postId, userId, redirectUrl) {
  try {
    // Connecting to the database
    const db = await connectDb();

    // Getting the post document with the given id
    const post = await db.models.Post.findById(postId);
    const user = await db.models.User.findById(userId);
    // Checking if the user is already in the stars array
    const hasStarred = post.stars.includes(userId);

    // Updating the stars array
    if (hasStarred) {
      post.stars = post.stars.filter((star) => star != userId);
      user.starredPosts = user.starredPosts.filter((star) => star != postId);
    } else {
      post.stars.push(userId);
      user.starredPosts.push(postId);
    }

    // Saving the updated post document
    await post.save();
    await user.save();

    return redirect(redirectUrl);
  } catch (error) {
    console.log(error);
    return json({ error: "Post could not be updated.", status: 400 });
  }
}

// This function updates the post bookmark field of the post document with the given id.
export async function updatePostBookmark(postId, userId, redirectUrl) {
  // Connecting to the database
  const db = await connectDb();

  // Getting the post document with the given id
  const post = await db.models.Post.findById(postId);
  const user = await db.models.User.findById(userId);

  // Checking if the user is already in the bookmarks array
  const hasBookmarked = post.bookmarks.includes(userId);

  // Updating the bookmarks array
  if (hasBookmarked) {
    post.bookmarks = post.bookmarks.filter((bookmark) => bookmark != userId);
    user.bookmarkedPosts = user.bookmarkedPosts.filter((bookmark) => bookmark != postId);
  } else {
    post.bookmarks.push(userId);
    user.bookmarkedPosts.push(postId);
  }

  // Saving the updated post document
  await post.save();
  await user.save();
  return redirect(redirectUrl);
}

export async function createComment(userId, postId, content) {
  // Connecting to the database
  const db = await connectDb();

  // Creating the comment document in the database
  const newComment = await db.models.Comment.create({
    content,
    createdBy: userId,
    post: postId,
  });

  // Getting the post document with the given id
  const post = await db.models.Post.findById(postId);

  // Adding the comment id to the post comments array
  post.comments.push(newComment._id);

  // Saving the updated post document
  await post.save();

  return newComment;
}

export async function hasUserStarredPost(postId, userId) {
  // Connecting to the database
  const db = await connectDb();

  // Getting the post document with the given id
  const post = await db.models.Post.findById(postId);

  // Checking if the user is already in the stars array
  const hasStarred = post.stars.includes(userId);

  return hasStarred;
}

export async function hasUserBookmarkedPost(postId, userId) {
  // Connecting to the database
  const db = await connectDb();

  // Getting the post document with the given id
  const post = await db.models.Post.findById(postId);

  // Checking if the user is already in the bookmarks array
  const hasBookmarked = post.bookmarks.includes(userId);

  return hasBookmarked;
}
