# JULIETTEMAROUNEK

Portfolio for JULIETTEMAROUNEK, director and art director.

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Sanity

Create a Sanity project, then set:

```bash
NEXT_PUBLIC_SITE_URL=https://juliettemarounek.com
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
```

The integrated Studio is available at `/studio` and uses Sanity login. Upload compressed web exports for videos, not heavy masters.

Add `http://localhost:3000`, the Vercel preview URL, and the final domain to Sanity CORS origins.

## Content

- Site settings: logo text, home hero video, hero fallback image, contact email, social links.
- Projects: manual order, thumbnail, main video, stills, role, client, year, credits, optional full-film URL.
- About page: short bio, optional portrait, optional contact email override.

## Verification

```bash
npm run lint
npm run build
```

Deploy on Vercel and connect Sanity from the Vercel Marketplace or by setting the env vars manually.
