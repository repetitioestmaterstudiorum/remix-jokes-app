import type { LoaderFunction } from "@remix-run/node";
import type { Joke } from "@prisma/client";
import { useLoaderData, Link } from "@remix-run/react";
import { db } from "~/utils/db.server";

export const loader: LoaderFunction = async () => {
  const count = await db.joke.count();
  const randomRowNumber = Math.floor(Math.random() * count);
  const [randomJoke] = await db.joke.findMany({
    take: 1,
    skip: randomRowNumber,
  });
  return randomJoke;
};

export default function JokesIndexRoute() {
  const randomJoke: Joke = useLoaderData();

  return (
    <div>
      <h2>Here's a random joke:</h2>
      <p>{randomJoke.content}</p>
      <Link to={randomJoke.id}>"{randomJoke.name}" Permalink</Link>
    </div>
  );
}
