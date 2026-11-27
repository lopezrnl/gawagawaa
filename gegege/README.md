# Blank — a character study in blue

A multi-page character site for **Blank**, a girl with no past, no plot, and an
ocean of blue where her story should be. Built with React + Vite, using a
deep-ocean blue palette with cyan, violet and warm-sand accents.

The portrait and built-in gallery artwork are hand-built SVG components in
`src/art.jsx`. There are no external image assets to manage.

## Run locally

```bash
npm install
npm run dev
```

## Pages and features

- **Welcome** (`/`) — animated passphrase screen with a small rotating icebreaker.
- **Story** (`/app/story`) — Blank's portrait, three chapters, and a path to the
  other pages.
- **Dossier** (`/app/dossier`) — character profile, editable name slot, traits,
  and field notes.
- **Gallery** (`/app/gallery`) — Pinterest-style masonry, filters, lightbox,
  arrow-key navigation, PNG downloads, and image uploads.
- **Archive** (`/app/archive`) — story timeline, saved letters and fragments,
  local-storage information, preferences and reset tools.
- **About** (`/app/deploy`) — project details and Vercel deployment information.
- **Workspace navigation** — persistent desktop side nav and a slide-out mobile
  menu, plus a keyboard command palette (`Ctrl/⌘ + K`).
- **Modals** — compose letters and fragments, upload images, inspect gallery art,
  and use the keyboard command palette (`Ctrl/⌘ + K`).
- **Gallery** — filter built-in and uploaded studies, view them in a lightbox,
  navigate with arrow keys, download PNGs, or upload images by drop or browse.
- **Local-first storage** — entries and preferences stay in this browser. Export
  the archive as JSON or letters as Markdown for backups.

Uploaded images are resized and stored locally in the browser; they are not
uploaded to a server. Browser storage is limited, so export important content
before clearing site data.

## Build

```bash
npm run lint
npm run build
npm run preview
```

## Deploy to Vercel

The project is preconfigured in `vercel.json`:

- framework: `vite`
- build command: `npm run build`
- output directory: `dist`
- SPA rewrite to `index.html`
- long-lived caching for hashed assets

Import this folder at [vercel.com/new](https://vercel.com/new), or run:

```bash
npx vercel        # preview deployment
npx vercel --prod # production deployment
```

No environment variables are required. User-created archive content remains in
each visitor's browser; it is not shared between visitors.

The welcome passphrase is `trish28`. This is a client-side presentation gate,
not real authentication: the passphrase is included in the front-end bundle and
does not protect private content from someone inspecting the site. Do not use
this gate for sensitive information; real access control needs server-side
authentication.
