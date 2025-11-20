# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

## Deploy

```bash
git pull origin main

npm run build

# Load nvm (required for pm2 to be available)
source ~/.nvm/nvm.sh

# First deployment only:
pm2 start ecosystem.config.cjs

# For redeployments (app already running):
pm2 restart ProcessorDB-website
# OR for zero-downtime reload:
pm2 reload ProcessorDB-website
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
