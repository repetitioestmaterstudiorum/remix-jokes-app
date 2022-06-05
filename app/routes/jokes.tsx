import type { Joke } from "@prisma/client";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { Outlet, Link, useLoaderData } from "@remix-run/react";
import stylesUrl from "~/styles/jokes.css";
import { db } from "~/utils/db.server";

export const links: LinksFunction = () => {
  // executed on the server and client, remix magic: remix knows what to do with this, not used below
  return [{ rel: "stylesheet", href: stylesUrl }];
};

type JokeListItem = Pick<Joke, "id" | "name">;
export const loader: LoaderFunction = async () => {
  // executed on the server only
  const jokesListItems: JokeListItem[] = await db.joke.findMany({
    select: { id: true, name: true },
  });
  return jokesListItems;
};

export default function JokesRoute() {
  // executed on the server and client, gets data from the loader above
  const jokesListItems: JokeListItem[] = useLoaderData();

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
        </div>
      </header>
      <main className="jokes-main">
        <div className="container">
          <div className="jokes-list">
            <Link to=".">Get a random joke</Link>
            <p>Here are a few more jokes to check out:</p>
            <ul>
              {/* data from above */}
              {jokesListItems.map((j) => (
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
