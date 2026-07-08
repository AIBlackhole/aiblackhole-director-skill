# Troubleshooting

Use this reference for online loading, route, deployment, and browser issues.

## First Checks

Ask for:

- the exact URL
- browser name and version if available
- device type
- screenshot of the error
- whether the same issue happens in a private/incognito window

Primary URL:

https://aiblackhole.net/panorama-viewer

Fallback URL if available:

https://panorama-director.pages.dev/panorama-viewer

## Common Issues

### Page does not open

Check:

1. DNS records for `aiblackhole.net`.
2. Cloudflare Pages custom domain binding.
3. HTTPS certificate status.
4. Whether the fallback Pages URL works.

### 404 on `/panorama-viewer`

Check whether the host is serving:

- `/panorama-viewer`
- `/panorama-viewer.html`
- `/panorama-viewer/`

If only the `.html` file exists, configure a redirect or route rewrite, or link directly to `panorama-viewer.html`.

### Assets fail to load

Check that these files are deployed together:

- `panorama-viewer.html`
- `panorama-director.js`
- favicon/logo assets
- any required CSS or image assets

Use browser developer tools to inspect failed network requests.

### Upload or screenshot does not work

Check:

1. Browser permissions.
2. Console errors.
3. Whether the page is served over HTTPS.
4. Whether the image file is very large or unsupported.

### UI appears but tools do not work

Check:

1. JavaScript console errors.
2. Whether `panorama-director.js` loaded successfully.
3. Browser WebGL support.
4. Browser extensions that may block scripts.

## Cloudflare Pages Notes

For a custom domain:

1. Add the domain in Cloudflare Pages custom domains.
2. Point DNS to Cloudflare as instructed.
3. Wait for certificate provisioning.
4. Test both apex domain and `www` if configured.
5. Purge cache after deploying route changes.

## Response Style

When helping non-technical users, avoid dumping diagnostics at once. Start with the exact URL, browser, and screenshot, then narrow the issue step by step.
