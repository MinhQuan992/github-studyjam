# Web applications for the "Git & GitHub Study Jam" event

This monorepo project contains three sub-apps, building web applications for the "Git & GitHub Study Jam" event (organized by the [Google Developer Student Clubs - HCMUTE](https://www.facebook.com/gdsc.hcmute)).

The base of this project is from [Turborepo Tailwind CSS starter](https://github.com/vercel/turbo/tree/main/examples/with-tailwind).

Three sub-apps inside:

- `admin`: a [Next.js](https://nextjs.org/) app with [Tailwind CSS](https://tailwindcss.com/), allows the organizers to manage the activities.
- `participant`: another [Next.js](https://nextjs.org/) app with [Tailwind CSS](https://tailwindcss.com/), allows the participants to track the progress and marking results.
- `ggsheets-server`: an [Express](https://expressjs.com/) app to fetch the Google Form submissions of the participants.

Besides that, there are three packages:

- `ui`: a stub React component library with [Tailwind CSS](https://tailwindcss.com/) shared by both `admin` and `participant` applications.
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`).
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo.
