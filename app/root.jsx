import { useState } from "react";
import NavigationMenu from "./components/NavigationMenu";
import styles from "./styles/app.css";
import { getUser, requireUserLogin } from "~/utils/auth.server";
import connectDb from "./db/connectDb.server";

const { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } = require("@remix-run/react");

export const meta = () => ({
  charset: "utf-8",
  title: "Tooter",
  viewport: "width=device-width,initial-scale=1",
});

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export async function loader({ request }) {
  const currentUser = await getUser(request);
  return { currentUser };
}

export default function App() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { currentUser } = useLoaderData();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-slate-50 text-black dark:bg-black dark:text-gray-50">
        {/* Show the navigation menu on the left and the page content (Outlet) on the right */}
        <div className="flex flex-row">
          <NavigationMenu currentUser={currentUser} isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
          <div className={`w-full transition-all duration-300 ${isExpanded ? "ml-64" : "ml-24"} mb-4`}>
            <Outlet />
          </div>
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
