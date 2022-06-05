import type { Joke } from "@prisma/client";
import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { db } from "~/utils/db.server";

export const action: ActionFunction = async ({ request }) => {
  // get data from HTML form
  const form = await request.formData();
  const name = form.get("name");
  const content = form.get("content");
  if (typeof name !== "string" || typeof content !== "string") {
    throw new Error(
      `action(): form contents submitted incorrectly (name: ${name}, content: ${content})`
    );
  }

  // insert data into the DB
  const joke: Joke | null = await db.joke.create({
    data: { name, content },
  });
  if (!joke)
    throw new Error(
      `action(): could not create joke with name ${name} and content ${content}`
    );

  return redirect(`/jokes/${joke.id}`);
};

export default function NewJokeRoute() {
  return (
    <div>
      <p>Add your own hilarious joke</p>
      <form method="post">
        <div>
          <label>
            Name: <input type="text" name="name" />
          </label>
        </div>
        <div>
          <label>
            Content: <textarea name="content" />
          </label>
        </div>
        <div>
          <button type="submit" className="button">
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
