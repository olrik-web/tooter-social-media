import { json } from "@remix-run/node";
import connectDb from "~/db/connectDb.server";
import { getUserId } from "./auth.server";

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
    
      // tagsArray = await Promise.all(
      //   tags.map(async (tag) => {
      //     const tagExists = await db.models.Tag.findOne({ name: tag.toLowerCase() });
      //     if (tagExists) {
      //       console.log("Tag already exists.");
      //       return tagExists._id;
      //     }
      //     console.log("Tag does not exist. Creating tag...");
      //     const newTag = await db.models.Tag.create({ name: tag.toLowerCase() });
      //     return newTag._id;
      //   })
      // );
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
 * This function returns the post document with the given id.
 */
export async function getPost(id) {
  // Connecting to the database
  const db = await connectDb();

  // Getting the post document with the given id
  const post = await db.models.Post.findById(id);
  return post;
}

/*
 * This function returns all the post documents in the database.
 */
export async function getPosts() {
  // Connecting to the database
  const db = await connectDb();

  // Getting all the post documents in the database
  const posts = await db.models.Post.find();
  return posts;
}

// This function returns all the post documents in the database that are created by the user with the given id.
export async function getPostsByUser(id) {
  // Connecting to the database
  const db = await connectDb();

  // Getting all the post documents in the database that are created by the user with the given id
  const posts = await db.models.Post.find({ createdBy: id });
  return posts;
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
 * This function updates the post document with the given id and returns the updated post document.
 */
export async function updatePost(postId, content, tags, images) {
  // Connecting to the database
  const db = await connectDb();

  // Getting the post document with the given id
  const post = await db.models.Post.findById(postId);

  // Updating the post document
  post.content = content;
  post.tags = tags;
  post.images = images;

  // Saving the updated post document
  const updatedSnippet = await post.save();
  return updatedSnippet;
}

/*
 * This function deletes the post document with the given id.
 */
export async function deletePost(id, userId) {
  // Connecting to the database
  const db = await connectDb();

  // Getting the post document with the given id
  const post = await db.models.Post.findById(id);

  if (post.createdBy.toString() !== userId.toString()) {
    return json({ error: "You are not authorized to delete this post.", status: 401 });
  } else {
    // Updating the post document's deleted property to true
    post.deleted = true;

    // Saving the updated post document
    const updatedSnippet = await post.save();
    return updatedSnippet;
  }
}

// This function updates the post favorite field of the post document with the given id.
export async function updatePostStar(postId, userId) {
  // Connecting to the database
  const db = await connectDb();

  // Getting the post document with the given id
  const post = await db.models.Post.findById(postId);

  // Checking if the user is already in the stars array
  const hasStared = post.stars.includes(userId);

  // Updating the stars array
  if (hasStared) {
    post.stars = post.stars.filter((star) => star != userId);
  } else {
    post.stars.push(userId);
  }

  // Saving the updated post document
  const updatedPost = await post.save();
  return updatedPost;
}

// This function updates the post bookmark field of the post document with the given id.
export async function updatePostBookmark(postId, userId) {
  // Connecting to the database
  const db = await connectDb();

  // Getting the post document with the given id
  const post = await db.models.Post.findById(postId);

  // Checking if the user is already in the bookmarks array
  const hasBookmarked = post.bookmarks.includes(userId);

  // Updating the bookmarks array
  if (hasBookmarked) {
    post.bookmarks = post.bookmarks.filter((bookmark) => bookmark != userId);
  } else {
    post.bookmarks.push(userId);
  }

  // Saving the updated post document
  const updatedPost = await post.save();
  return updatedPost;
}

// This function updates the post comment field of the post document with the given id.
export async function updatePostComment(postId, userId, comment) {
  // Connecting to the database
  const db = await connectDb();

  // Getting the post document with the given id
  const post = await db.models.Post.findById(postId);

  // Updating the comments array
  post.comments.push({ userId, comment });

  // Saving the updated post document
  const updatedPost = await post.save();
  return updatedPost;
}

// This function updates the post comment field of the post document with the given id.
export async function updatePostCommentDelete(postId, commentId) {
  // Connecting to the database
  const db = await connectDb();

  // Getting the post document with the given id
  const post = await db.models.Post.findById(postId);

  // Updating the comments array
  post.comments = post.comments.filter((comment) => comment._id != commentId);

  // Saving the updated post document
  const updatedPost = await post.save();
  return updatedPost;
}
