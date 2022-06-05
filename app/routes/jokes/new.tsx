import type { Joke } from "@prisma/client";
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { db } from "~/utils/db.server";

type ActionErrorResponse = {
  formError?: string;
  fieldErrors?: {
    name: ReturnType<typeof validateJokeName>;
    content: ReturnType<typeof validateJokeContent>;
  };
  fields?: {
    name: string;
    content: string;
  };
};

export const action: ActionFunction = async ({
  request,
}): Promise<Response | ActionErrorResponse> => {
  // get data from HTML form
  const form = await request.formData();
  const name = form.get("name");
  const content = form.get("content");
  if (typeof name !== "string" || typeof content !== "string") {
    return badRequest({
      formError: `action(): form contents submitted incorrectly`,
    });
  }

  // validata data
  const fieldErrors = {
    name: validateJokeName(name),
    content: validateJokeContent(content),
  };
  const fields = { name, content };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  // insert data into the DB
  const joke: Joke | null = await db.joke.create({
    data: fields,
  });
  if (!joke)
    throw new Error(
      `action(): could not create joke with name ${name} and content ${content}`
    );

  return redirect(`/jokes/${joke.id}`);
};

export default function NewJokeRoute() {
  const actionData: ActionErrorResponse | undefined = useActionData();

  return (
    <div>
      <p>Add your own hilarious joke</p>
      <form method="post">
        <div>
          <label>
            Name:{" "}
            <input
              type="text"
              defaultValue={actionData?.fields?.name}
              name="name"
              aria-invalid={Boolean(actionData?.fieldErrors?.name) || undefined}
              aria-errormessage={
                actionData?.fieldErrors?.name ? "name-error" : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.name ? (
            <p className="form-validation-error" role="alert" id="name-error">
              {actionData.fieldErrors.name}
            </p>
          ) : null}
        </div>
        <div>
          <label>
            Content:{" "}
            <textarea
              defaultValue={actionData?.fields?.content}
              name="content"
              aria-invalid={
                Boolean(actionData?.fieldErrors?.content) || undefined
              }
              aria-errormessage={
                actionData?.fieldErrors?.content ? "content-error" : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.content ? (
            <p
              className="form-validation-error"
              role="alert"
              id="content-error"
            >
              {actionData.fieldErrors.content}
            </p>
          ) : null}
        </div>
        <div>
          {actionData?.formError ? (
            <p className="form-validation-error" role="alert">
              {actionData.formError}
            </p>
          ) : null}
          <button type="submit" className="button">
            Add
          </button>
        </div>
      </form>
    </div>
  );
}

// helpers
function badRequest(data: ActionResponse) {
  return json(data, { status: 400 });
}

function validateJokeName(name: string) {
  if (name.length < 3) {
    return `joke name (${name}) must be at least 3 characters long`;
  }
}

function validateJokeContent(content: string) {
  if (content.length < 10) {
    return `joke content (${content}) must be at least 10 characters long`;
  }
}
