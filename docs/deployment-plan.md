# Deployment plan

## Online static website — planned

The production target is a subdomain served by DirectAdmin Shared Hosting over HTTPS. The current Vite production build outputs static files to dist/; it does not need PHP, a database, or a persistent Node.js process on the host. A separate build:offline command creates a relative-path static bundle in dist-offline/ as groundwork for the later offline wrapper.

When the subdomain and hosting document root are ready:

1. Run the type check, lint, and production build on the development machine.
2. Set APP_BASE_PATH=/ for a subdomain rooted at its document root, or set the matching path if the site is hosted below a URL path.
3. Upload the contents of dist/ to that subdomain's document root.
4. Enable HTTPS for the subdomain in DirectAdmin and check that the site and static assets load over HTTPS.

The project does not contain a production domain, hosting credentials, or deployment automation. Production source maps are disabled.

## Windows offline package — future

offline-app/ is reserved for a separate offline application wrapper. Electron is not installed or configured. The online React application will remain independent of Electron. A later phase will select and document the packaging and local asset-loading approach, then define a separate offline build target. The current configurable Vite base path is groundwork only; no offline package or installer exists.

## Current status

Implemented: a static Vite build, configurable base path, source-map exclusion, and a separate relative-path static build target. The offline target is not an application package.

Planned: DirectAdmin deployment, HTTPS configuration, a bilingual presentation, offline asset validation, and a Windows package.