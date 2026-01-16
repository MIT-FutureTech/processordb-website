# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Repository Structure

```
processordb-website/
├── app.vue                    # Root application component
├── nuxt.config.ts             # Nuxt configuration
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── postcss.config.js          # PostCSS configuration
├── eslint.config.js           # ESLint configuration
├── components.json            # Component library configuration
├── ecosystem.config.js        # PM2 ecosystem configuration
│
├── assets/                    # Static assets
│   ├── css/
│   │   ├── main.css          # Main stylesheet
│   │   └── tailwind.css      # Tailwind base styles
│   └── people.js             # People data
│
├── components/                # Vue components
│   ├── Breadcrumbs.vue       # Breadcrumb navigation
│   ├── DataTable.vue         # Reusable data table
│   ├── Footer.vue            # Site footer
│   ├── ManufacturersTable.vue # Manufacturers listing
│   ├── Navbar.vue            # Navigation bar
│   ├── PrivateTable.vue      # Private data table
│   ├── UsersPhoto.vue        # User photo component
│   ├── UsersTable.vue        # Users table
│   │
│   ├── Forms/                # Form components
│   │   ├── CpuForm.vue       # CPU entry form
│   │   ├── FpgaForm.vue      # FPGA entry form
│   │   ├── GpuForm.vue       # GPU entry form
│   │   ├── RegisterForm.vue  # User registration form
│   │   └── UpdatePassword.vue # Password update form
│   │
│   ├── Graphs/               # Chart/graph components
│   │   ├── CPUsGraph.client.vue  # CPU visualization
│   │   ├── FPGAsGraph.client.vue  # FPGA visualization
│   │   └── GPUsGraph.client.vue  # GPU visualization
│   │
│   └── ui/                   # UI component library (shadcn-style)
│       ├── breadcrumb/       # Breadcrumb components
│       ├── dropdown-menu/    # Dropdown menu components
│       └── table/            # Table components
│
├── pages/                     # Application pages (file-based routing)
│   ├── index.vue             # Home page
│   ├── login.vue             # Login page
│   ├── team.vue              # Team page
│   │
│   ├── admin/                # Admin pages
│   │   └── profile.vue       # Admin profile
│   │
│   ├── CPU/                  # CPU-related pages
│   │   ├── list.vue          # CPU listing
│   │   ├── form.vue          # CPU form
│   │   └── [id].vue          # CPU detail page
│   │
│   ├── FPGA/                 # FPGA-related pages
│   │   ├── list.vue          # FPGA listing
│   │   ├── form.vue          # FPGA form
│   │   └── [id].vue          # FPGA detail page
│   │
│   ├── GPU/                  # GPU-related pages
│   │   ├── list.vue          # GPU listing
│   │   ├── form.vue          # GPU form
│   │   └── [id].vue          # GPU detail page
│   │
│   ├── SoC/                  # SoC-related pages
│   │   ├── list.vue          # SoC listing
│   │   └── form.vue          # SoC form
│   │
│   └── manufacturers/        # Manufacturer pages
│       └── list.vue          # Manufacturers listing
│
├── server/                    # Server-side code
│   └── api/                  # API endpoints
│       ├── cpus.js           # CPU API routes
│       ├── gpus.js           # GPU API routes
│       └── socs.js           # SoC API routes
│
├── middleware/                # Route middleware
│   └── passwordProtect.global.js  # Global password protection
│
├── plugins/                   # Nuxt plugins
│   ├── highcharts.client.js  # Highcharts integration
│   ├── oh-vue-icons.js      # Icon library
│   └── vue-query.js          # Vue Query setup
│
├── lib/                       # Utility libraries
│   ├── encrypter.js          # Encryption utilities
│   ├── isLogged.js           # Authentication check
│   └── utils.ts              # General utilities
│
└── public/                    # Public static files
    ├── favicon.ico           # Site favicon
    ├── fonts/                # Custom fonts
    └── *.jpg, *.png, *.svg   # Profile images and assets
```

### Key Features

- **Processor Database**: Manage and display CPUs, GPUs, FPGAs, and SoCs
- **User Management**: Registration, authentication, and profile management
- **Data Visualization**: Interactive charts using Highcharts
- **Form Management**: Dedicated forms for each processor type
- **Manufacturer Tracking**: List and manage processor manufacturers
- **Team Page**: Display team member profiles and information
- **Admin Panel**: Administrative interface for managing the database

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
