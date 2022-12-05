# Welcome to Snip Elephant

- [Check out the running solution](https://awp-snippet-saver-q9p5.onrender.com/) (Please be patient if it appears to be stuck loading. It is hosted using a free plan, which goes on "standby" after a while. It should be ready within a few minutes)
- Create a new user or use the following:
- Email: admin@admin.com
- Password: snip123

## Snip Elephant

Snip Elephant is a school assignment which is built using React, [Remix Framework](https://remix.run/), MongoDB and Mongoose. 

The purpose of Snip Elephant is too allow developers to save code snippets. The snippets are saved in folders to allow the user to organise their snippets for quick access. It is called Snip Elephant because an elephant has great memory and can remember your code snippets so you don't have to. 

It is a work in progress. Here I've listed some of the missing features, which I'm working on:
- Edit/delete collections
- Edit/delete profile 
- About page
- Make it a progressive web app (installable, service worker, offline access, caching, push notifications)
- Dark Mode
- Auto-save funcionality when creating/editing a snippet
- Export code to HTML, PDF, plaintext, JSON ...?
- Accept cookies popup
- Several UI improvements

## Development

Read the [Remix Docs](https://remix.run/docs) for more information on the Remix framework. 

Clone the repository and add a ```.env``` file to your root directory. The file should include the following key/value pairs:
```
MONGODB_URL=mongodb+srv://<your username>:<your password>@cluster0.97ocrib.mongodb.net/<your database>
```
and 
```
SECRET=<your secret>
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

## Below are a few screenshots of the UI

### The front page
![Front page](/app/images/Homepage.png)

### Signing up
![Signing up](/app/images/SignUp.png)

### Creating a new snippet
![Creating a new snippet](/app/images/CreateSnippet.png)

### Seaching for a snippet
![Searching for a snippet](/app/images/Searching.png)
