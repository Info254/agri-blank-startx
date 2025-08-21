# Soko-Connect: Agricultural Platform for Kenya

## Project info

**URL**: https://lovable.dev/projects/6b3ca5f2-afd0-4a58-abcc-9d11687cf0ab

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/6b3ca5f2-afd0-4a58-abcc-9d11687cf0ab) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/6b3ca5f2-afd0-4a58-abcc-9d11687cf0ab) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)

## App Cache and Size Optimization Strategy

### Bundle Size

- Vite build uses code splitting and tree shaking.
- Vendor chunking for node_modules.
- CSS code split enabled.
- Assets inline limit set to 4KB.
- Minification via esbuild.

### Offline Capability

- Service worker caches key assets and API responses.
- IndexedDB/localStorage recommended for user data.
- Service worker auto-updates on new deploys.

### Image/Asset Compression

- Use compressed images (WebP, PNG, SVG).
- Optimize assets before upload.

### Lazy Loading

- Non-critical pages/components should use React.lazy and Suspense.

### Cache Management

- Limit cache size in service worker.
- Remove old caches on activate.

### Recommendations

- Audit bundle with Vite plugin (e.g., rollup-plugin-visualizer).
- Regularly review dependencies and remove unused packages.
- Document cache strategy for contributors.
