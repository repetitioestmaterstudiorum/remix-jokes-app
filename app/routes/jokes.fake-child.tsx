export default function JokesFakeChildRoute() {
  return (
    <div>
      <h1>JokesFakeChildRoute</h1>
      <p>
        This file is called jokes.fake-child.tsx, and it's on the same level as
        the file jokes.tsx and the folder "jokes". This renders the file under
        /jokes/fake-child while the file is not a child (and does not load stuff
        from) jokes.tsx (unlike all files in the folder jokes).
      </p>
    </div>
  );
}
