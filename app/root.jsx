import Navbar from "./components/Navbar";
import styles from "./styles/app.css";

const {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} = require("@remix-run/react");

export const meta = () => ({
  charset: "utf-8",
  title: "Tooter",
  viewport: "width=device-width,initial-scale=1",
});

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-slate-50 text-black dark:bg-black dark:text-gray-50">
        {/* TODO: New Navbar here */}
        {/* <Navbar /> */}
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
