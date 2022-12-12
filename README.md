# Welcome to Tooter! :trumpet:

[Check out the running solution on Render](https://tooter.onrender.com/) (Please be patient if it appears to be stuck loading. It is hosted using a free plan, which goes on "standby" after a while. It should be ready within a few minutes)
  Create an account or use the following credentials to login:

```sh
Username: john
Password: password
```

## What is Tooter? :thinking:

Tooter is a social media platform, where users can post short messages (toots) and follow other users. It is inspired by Twitter and Mastodon.
It was created as the final exam project for the course "Advanced Web Programming" at Business Academy Aarhus.

A toot is a short sound made by a trumpet or other musical instrument. The word shares similarities with the word "tweet", which is used by Twitter.
Apparently, the name "Toot" is a slang term for fart and a drug reference. I didn't know that when I chose the name. :sweat_smile: 

The purpose of Tooter is to demonstrate my knowledge of the following technologies:

- [Remix](https://remix.run/) - A framework for building React apps with server-side rendering, routing, data fetching, and more.
- [MongoDB](https://www.mongodb.com/) - A document database with the scalability and flexibility that you want with the querying and indexing that you need.
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for rapidly building custom designs.
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces.
- [Mongoose](https://mongoosejs.com/) - Elegant MongoDB object modeling.

## Features :sparkles:

- [x] Create an account
- [x] Login
- [x] Logout
- [x] Edit account
- [x] Follow/unfollow other users
- [x] Post toots
- [x] Edit toots
- [x] Delete toots
- [x] Star(like) toots
- [x] Bookmark toots
- [x] Comment on toots
- [x] See a list of the most starred toots
- [x] See a list of the most recent toots
- [x] See a list of the most recent toots from the users you follow
- [x] Create public and private groups, where you can post toots
- [x] View a list of all groups you are a member of
- [x] View a profile page for a user
- [x] View all toots from a user
- [x] View all comments from a user
- [x] View all starred toots from a user
- [x] Search for users and tags
- [x] Dark mode and light mode (based on system preferences)
- [x] Responsive design
- [x] Some basic accessibility features
- [x] Nested routes
- [x] Optimistic UI
- [x] Pending UI
- [x] Error UI


## Development :computer:

Read the [Remix Docs](https://remix.run/docs) for more information on the Remix framework.

Clone the repository and add a `.env` file to your root directory. The file should include the following key/value pairs:

```
MONGODB_URL=mongodb+srv://<username>:<password>@cluster0.97ocrib.mongodb.net/<db name>
```

and

```
SECRET=<secret>
```

If you want to run the solution on your machine. Type the following in the terminal:

To install the required dependencies

```sh
npm install
```

To run the solution locally

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

