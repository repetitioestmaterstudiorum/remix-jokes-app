# remix-jokes-app

This is my version of the remix jokes app tutorial that can be found here https://remix.run/docs/en/v1/tutorials/jokes and here https://www.youtube.com/watch?v=hsIWJpuxNj0

## develop

```sh
npm run dev
```

## deploy

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`

### change hosting template

- when running `npx create-remix@latest` there are a few choices for hosting. Run that again creates a new project, then copy over the `app/` folder to the new project that's pre-configured for your target server.

```sh
cd ..
# create a new project, and pick a pre-configured host
npx create-remix@latest
cd my-new-remix-app
# remove the new project's app (not the old one!)
rm -rf app
# copy your app over
cp -R ../my-old-remix-app/app app
```

## useful commands

- initialize Prisma with sqlite: `npx prisma init --datasource-provider sqlite` - likely similar commands exist for other databases
- `npx prisma db push`: creates a db in `prisma/dev.db` according to the schema `prisma/schema.prisma` (also generates TS types for prisma (somewhere?))
- (insert (create) fixtures from `prisma/seed.ts`: `node --require esbuild-register prisma/seed.ts` - happens automatically when "resetting the database" thanks to the prisma entry in package.json -> if not, run `npx prisma db seed`)
- `npx prisma studio` spins up a local server to manage the DB via web client on localhost:5555
