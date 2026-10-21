# Ember & Vine

Netlify-ready static restaurant site with Netlify Functions for shared content and image storage.

## Deploy to Netlify

### Git-connected deploy

1. Put the contents of this folder in a Git repository and import that repository in Netlify.
2. Set the site's base directory to this project folder if it is inside a larger repository. The included `netlify.toml` publishes `public/` and deploys the functions in `netlify/functions/`.
3. In Netlify, add an environment variable named `EV_STORAGE_ADMIN_TOKEN`. Use a long random secret, set its scope to **Functions**, and make it available in the **Production** deploy context. Keep it out of Git and do not put it in `netlify.toml`.
4. Deploy or trigger a new deploy after setting the variable.
5. Sign in to the site's Admin console and select **Connect cloud storage**. Enter the same secret. It stays in that browser tab's session storage.

You can also deploy with the Netlify CLI after logging in and linking the site:

```powershell
npm install
npx netlify-cli login
npx netlify-cli link
npm run deploy
```

For local Netlify development, run `npm run dev`. To use the storage functions locally, set `EV_STORAGE_ADMIN_TOKEN` in a local `.env` file. `.env` is ignored by Git.

## Persistent data

- Netlify Blobs stores the public website settings, page copy, menu, branches, promotions, and reviews.
- Uploaded logo, favicon, hero, about, dish, and branch pictures are saved as image blobs. The browser app uploads these images before publishing the updated site data.
- The first **Connect cloud storage** action publishes the current browser's public site content to Netlify. Afterwards, people visiting the site load that shared content.
- A write requires the secret token. Image reads and public site-content reads are public, as those values are displayed on the public website.
- Uploaded pictures are limited to 4 MB each after the app's image resizing.

## Menu photography

The 27 sample menu items, homepage burger hero, and ribeye story image use real food photos from the Unsplash image CDN. They need an internet connection to load and are illustrative sample photos, not photographs of Ember & Vine's actual dishes. An image uploaded through the Admin menu overrides the corresponding default photo, and connected cloud storage saves uploaded replacements in Netlify Blobs. Unsplash's license allows free use in personal and commercial projects; attribution is appreciated: https://unsplash.com/license.

## Current app limits

The original demo login, user accounts, orders, addresses, cart, and manager/admin operational records still use browser storage. They are not shared or backed by this content store. The demo authentication is client-side and is not suitable for real customer accounts, payments, or personal order data. A production ordering system needs server-side authentication and a database for customer and order records.

## Page files

Each page view has its own HTML entry in `public/pages/`, page stylesheet in `public/assets/css/pages/`, and JavaScript bootstrap in `public/assets/js/pages/`. Shared styles and interactive behavior live in `public/assets/css/app.css` and `public/assets/js/app.js`.

Open `public/index.html` for the home page. Demo logins:

| Role | Email | Password |
|---|---|---|
| Admin | admin@emberandvine.com | admin123 |
| Manager | manager@emberandvine.com | manager123 |
| Customer | sophia@example.com | customer123 |

The web fonts and icon library load from Google Fonts and jsDelivr.
