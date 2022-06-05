import type { Joke } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { db } from "~/utils/db.server";

type JokeForDisplay = Pick<Joke, "name" | "content">;
export const loader: LoaderFunction = async ({ params }) => {
  const joke: JokeForDisplay | null = await db.joke.findUnique({
    where: { id: params.jokeId },
    select: { name: true, content: true },
  });
  if (!joke) {
    throw new Error(`loader(): joke with id ${params.jokeId} not found`);
  }
  return joke;
};

export default function JokeRoute() {
  const params = useParams();
  const joke: JokeForDisplay = useLoaderData();
  return (
    <div>
      <h2>{joke?.name}</h2>
      <p>
        <strong>{joke?.content}</strong>
      </p>

      {/* dev info */}
      {process.env.NODE_ENV === "development" ? (
        <p>
          <i>
            route params: <br />
            {JSON.stringify(params, null, 2)}
          </i>
        </p>
      ) : null}
    </div>
  );
}
