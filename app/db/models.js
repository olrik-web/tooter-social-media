import { mongoose } from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      // If for some reason no avatar is provided, use a default avatar.
      default: "/images/avatar.png",
    },
    staredPosts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    bookmarkedPosts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    groups: [
      {
        type: Schema.Types.ObjectId,
        ref: "Group",
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const postSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
      maxlength: 500, // Limit the description to 500 characters.
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    stars: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    group: {
      type: Schema.Types.ObjectId,
      ref: "Group",
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    media: [
      {
        type: Schema.Types.ObjectId,
        ref: "Media",
      },
    ],
  },
  { timestamps: true }
);

const commentSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
      maxlength: 500,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  },
  { timestamps: true }
);

const groupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  { timestamps: true }
);

const tagSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  { timestamps: true }
);

const mediaSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  },
  { timestamps: true }
);

// This is the array of models that will be exported to the database.
export const models = [
  {
    name: "User",
    schema: userSchema,
    collection: "users",
  },
  {
    name: "Post",
    schema: postSchema,
    collection: "posts",
  },
  {
    name: "Comment",
    schema: commentSchema,
    collection: "comments",
  },
  {
    name: "Group",
    schema: groupSchema,
    collection: "groups",
  },
  {
    name: "Tag",
    schema: tagSchema,
    collection: "tags",
  },
  {
    name: "Media",
    schema: mediaSchema,
    collection: "media",
  },
];
