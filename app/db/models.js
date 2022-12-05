import { mongoose } from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "Please provide an email."],
    unique: [true, "Email already exist."],
  },
  password: {
    type: String,
    required: [true, "Please provide a password."],
  },
  profile: {
    firstName: {
      type: String,
      required: [true, "Please provide a first name."],
    },
    lastName: {
      type: String,
      required: [true, "Please provide a last name."],
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const snippetSchema = new Schema({
  title: {
    type: String,
    required: [true, "Please provide a title."],
  },
  description: {
    type: String,
  },
  language: {
    type: String,
    required: [true, "Please provide a language."],
  },
  code: {
    type: String,
    required: [true, "Please provide code."],
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  snippetFolder: {
    type: Schema.Types.ObjectId,
    ref: "snippetFolders",
  },
});

const snippetFolderSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please provide a name."],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: [true, "Please provide a user."],
  },
});

// This is the array of models that will be exported to the database.
export const models = [
  {
    name: "users",
    schema: userSchema,
    collection: "users",
  },
  {
    name: "snippets",
    schema: snippetSchema,
    collection: "snippets",
  },
  {
    name: "snippetFolders",
    schema: snippetFolderSchema,
    collection: "snippetFolders",
  },
];
