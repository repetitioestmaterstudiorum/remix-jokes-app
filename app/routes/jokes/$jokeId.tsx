import { useParams } from "@remix-run/react";

export default function JokeRoute() {
  const params = useParams();
  return (
    <div>
      <h2>The parameter for this route is: {params.jokeId}</h2>
      <p>Here's your hilarious joke:</p>
      <p>
        Why don't you find hippopotamuses hiding in trees? They're really good
        at it.
      </p>
    </div>
  );
}
