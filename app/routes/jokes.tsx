import type { Joke } from "@prisma/client";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, Link, useLoaderData } from "@remix-run/react";
import stylesUrl from "~/styles/jokes.css";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

export const links: LinksFunction = () => {
  // executed on the server and client, remix magic: remix knows what to do with this, not used below
  return [{ rel: "stylesheet", href: stylesUrl }];
};

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
  jokeListItems: Pick<Joke, "id" | "name">[];
};

export const loader: LoaderFunction = async ({ request }) => {
  // executed on the server only
  const jokeListItems = await db.joke.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true },
  });
  const user = await getUser(request);

  const data: LoaderData = {
    jokeListItems,
    user,
  };
  return json(data);
};

export default function JokesRoute() {
  // executed on the server and client, gets data from the loader above
  const data: LoaderData = useLoaderData();

  return (
    <div className="jokes-layout">
      <header className="jokes-header">
        <div className="container">
          <h1 className="home-link">
            <Link to="/" title="Remix Jokes" aria-label="Remix Jokes">
              <span className="logo">🤪</span>
              <span className="logo-medium">J🤪KES</span>
            </Link>
          </h1>
          {data.user ? (
            <div className="user-info">
              <span>{`Hi ${data.user.username}`}</span>
              <form action="/logout" method="post">
                <button type="submit" className="button">
                  Logout
                </button>
              </form>
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </header>
      <main className="jokes-main">
        <div className="container">
          <div className="jokes-list">
            <Link to=".">Get a random joke</Link>
            <p>Here are a few more jokes to check out:</p>
            <ul>
              {/* data from above */}
              {data.jokeListItems.map((j) => (
                <li key={j.id}>
                  <Link to={j.id}>{j.name}</Link>
                </li>
              ))}
              {/* this one is the link to the fake child `jokes.fake-child.tsx` */}
              <li>
                <Link to="fake-child">Fake Child</Link>
              </li>
            </ul>
            <Link to="new" className="button">
              Add your own
            </Link>
          </div>
          <div className="jokes-outlet">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
