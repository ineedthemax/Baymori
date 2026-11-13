# Deploy Baymori on Cloudflare Pages

## Recommended for ongoing updates: GitHub-connected Cloudflare Pages

1. Push this project to a private GitHub repository.
2. In Cloudflare > Workers & Pages > Create application > Pages > Import existing Git repository.
3. Choose **Next.js (Static HTML Export)**.
4. Production branch: `main`. Build command: `npm run build`. Output directory: `out`.
5. Deploy first to `*.pages.dev`; verify `/`, `/transfer/`, hero animation, mobile navigation, and both Jotform submissions.
6. Connect the Baymori domain in **Custom domains** after testing. Verify DNS records and email records first.

This project is statically exported and uses Jotform embeds for submissions. No server-side Next.js features are required currently.

## Build locally

```bash
npm install
npm run lint
npm run build
```

The `out/` directory can be deployed as static assets.

The standalone ZIP `baymori-cloudflare-upload.zip` can be deployed through Pages Direct Upload without Node or GitHub, but that route does not become Git-connected automatically. Do not upload the Next.js source ZIP as a static asset ZIP.
