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

### Manual Deployment

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

### Automated Webhook Deployment

This repository uses GitHub Actions with webhook-based deployment. The deployment workflow automatically triggers when code is pushed to specific branches.

#### Staging vs Production Deployment

- **Staging Environment:**
  - **Branch:** `dev`
  - **Domain:** `staging.processordb.mit.edu`
  - **Server:** `128.52.141.130`
  - **GitHub Environment:** `staging`
  - **Webhook Endpoint:** `http://staging.processordb.mit.edu/api/deploy`

- **Production Environment:**
  - **Branch:** `main`
  - **Domain:** `processordb.mit.edu` (or your production domain)
  - **Server:** Production server IP
  - **GitHub Environment:** `production`
  - **Webhook Endpoint:** Production webhook URL

The GitHub Actions workflow automatically selects the environment based on the branch:
- Pushes to `dev` branch → triggers `staging` environment deployment
- Pushes to `main` branch → triggers `production` environment deployment

#### GitHub Environments and Secrets Configuration

To enable automated deployments, you must configure environment-specific secrets in GitHub:

1. **Navigate to Repository Settings:**
   - Go to: `https://github.com/MIT-FutureTech/processordb-website/settings/environments`

2. **Configure Staging Environment:**
   - Click on `staging` environment (or create it if it doesn't exist)
   - Add the following secrets:
     - **`WEBHOOK_URL`:** `https://staging.processordb.mit.edu/api/deploy` (HTTPS enabled)
     - **`WEBHOOK_SECRET`:** The secret token that matches `DEPLOY_WEBHOOK_SECRET` in your staging server's `.env` file
   - **Note:** SSL certificate is configured and active. Use `https://` for the webhook URL.

3. **Configure Production Environment:**
   - Click on `production` environment (or create it if it doesn't exist)
   - Add the following secrets:
     - **`WEBHOOK_URL`:** Your production webhook endpoint URL
     - **`WEBHOOK_SECRET`:** The secret token that matches `DEPLOY_WEBHOOK_SECRET` in your production server's `.env` file

**Important Notes:**
- Each environment (staging/production) has its own set of secrets
- The `WEBHOOK_SECRET` must match the `DEPLOY_WEBHOOK_SECRET` value in the corresponding server's `.env` file
- Environment secrets are only accessible to workflows that explicitly reference that environment
- The workflow file (`.github/workflows/deploy.yml`) uses `environment: ${{ github.ref == 'refs/heads/main' && 'production' || 'staging' }}` to automatically select the correct environment based on the branch

#### How It Works

App must be built and configured manually in desired instance for this workflow to trigger!

1. Developer pushes code to `dev` or `main` branch
2. GitHub Actions workflow triggers
3. Workflow determines environment based on branch (`dev` → `staging`, `main` → `production`)
4. Workflow retrieves environment-specific secrets (`WEBHOOK_URL` and `WEBHOOK_SECRET`)
5. Workflow sends POST request to the webhook endpoint with `X-Webhook-Secret` header
6. Server receives webhook, validates secret, and runs deployment script
7. Deployment script pulls latest code, builds, and restarts the application

#### Webhook Security

The webhook endpoint uses **secret-based authentication** rather than IP restrictions:

- **Authentication Method:** `X-Webhook-Secret` header must match `DEPLOY_WEBHOOK_SECRET` in the server's `.env` file
- **Why Secret-Based:** GitHub Actions IP ranges change frequently and are difficult to maintain. Secret-based authentication provides stronger security regardless of source IP.
- **Security Notes:**
  - The webhook secret should be a strong, random value (64+ characters recommended)
  - Never expose the secret in logs, public repositories, or commit messages
  - The secret is validated on every webhook request before deployment is triggered
  - Requests without a valid secret receive `401 Unauthorized` response

#### Monitoring Deployment Logs

After triggering a deployment (via webhook or manually), you can monitor the deployment process:

**Real-time Log Monitoring:**
```bash
# Watch all logs in real-time (recommended)
pm2 logs ProcessorDB-website-staging

# Watch only the last 100 lines, then follow
pm2 logs ProcessorDB-website-staging --lines 100

# Watch only error logs
pm2 logs ProcessorDB-website-staging --err

# Watch only output logs
pm2 logs ProcessorDB-website-staging --out
```

**View Recent Logs:**
```bash
# View last 50 lines without following
pm2 logs ProcessorDB-website-staging --lines 50 --nostream

# View last 200 lines
pm2 logs ProcessorDB-website-staging --lines 200 --nostream
```

**What to Look For:**
When monitoring deployment logs, you'll see:
- `"Deployment triggered for staging (dev)"` - Webhook received
- `"Starting deployment for staging..."` - Deployment script started
- `"Pulling latest code from dev..."` - Git operations
- `"Installing dependencies..."` - npm install
- `"Building application..."` - Build process
- `"Restarting PM2 application..."` - PM2 restart
- `"Deployment completed successfully for staging!"` - Success

**Additional Log Sources:**
```bash
# Nginx access logs (webhook requests)
sudo tail -f /var/log/nginx/staging.processordb.mit.edu.access.log

# Nginx error logs
sudo tail -f /var/log/nginx/staging.processordb.mit.edu.error.log

# Filter for webhook requests only
sudo tail -f /var/log/nginx/staging.processordb.mit.edu.access.log | grep "/api/deploy"
```

**Troubleshooting Failed Deployments:**
```bash
# Check PM2 process status
pm2 status ProcessorDB-website-staging

# Check for errors in logs
pm2 logs ProcessorDB-website-staging --err --lines 50

# Check nginx errors
sudo tail -50 /var/log/nginx/staging.processordb.mit.edu.error.log

# Manually test deployment script
cd ~/processordb-website-staging
bash scripts/deploy.sh staging dev
```

## Reverse Proxy (Nginx)

The application is served through nginx as a reverse proxy. Configuration files are located at:
- `/etc/nginx/sites-available/processordb.mit.edu`
- `/etc/nginx/sites-available/processordb.csail.mit.edu`

### Configuration Summary

**Domain: `staging.processordb.mit.edu`**
- **HTTPS:** Port 443 with SSL/TLS (Let's Encrypt certificates via certbot)
- **HTTP:** Port 80 automatically redirects to HTTPS (301 redirect)
- **Frontend (Nuxt 3):** All requests to `/` are proxied to `http://localhost:3000`
- **Backend API:** Requests to `/backend/api/` are proxied to `http://localhost:3001/api/`
- **Webhook:** `/api/deploy` endpoint accessible via HTTPS

**Key Proxy Headers:**
- `Host`: Preserves original host header
- `X-Real-IP`: Client's real IP address
- `X-Forwarded-For`: Forwarded IP chain
- `X-Forwarded-Proto`: Original protocol (http/https)

### Managing Nginx

```bash
# Test nginx configuration
sudo nginx -t

# Reload nginx (after config changes)
sudo systemctl reload nginx

# Restart nginx
sudo systemctl restart nginx

# Check nginx status
sudo systemctl status nginx
```

**Note:** The application runs on `localhost:3000` and is not directly accessible from outside. All external traffic goes through nginx on ports 80/443.

## Setting Up Staging Environment

### DNS Record Setup

**Status:** The DNS record for `staging.processordb.mit.edu` has been set up by MIT IT and is currently active.

**Current Configuration:**
- **Domain:** `staging.processordb.mit.edu`
- **Record Type:** `A` record
- **IP Address:** `128.52.141.130` (staging server IP)
- **Status:** Active and resolving

**Verify DNS is working:**
```bash
# Check if DNS record exists
dig +short staging.processordb.mit.edu

# Should return: 128.52.141.130
```

### Current Staging Setup

**DNS Status:** Configured by MIT IT - `staging.processordb.mit.edu` points to `128.52.141.130`

The staging environment is currently configured with:

1. **Nginx Configuration:** `/etc/nginx/sites-available/staging.processordb.mit.edu`
   - Frontend proxy: `http://localhost:3000` (Nuxt.js)
   - Backend API proxy: `http://localhost:3001/api/` (via `/backend/api/` path)
   - Webhook endpoint: `/api/deploy` → `http://localhost:3000` (secured by webhook secret authentication)
   - **Access:** Currently **publicly accessible** - no IP restrictions are enabled. All IP restriction directives in nginx config are commented out.

2. **Application Services:**
   - **Frontend:** PM2 app `ProcessorDB-website-staging` running on port `3000`
   - **Backend API:** Docker container `processordb` running on port `3001`
   - **Database:** Docker container `hardware-db-postgres` running on port `5432`

3. **Environment Variables:**
   - Frontend `.env`: `SITE_URL`, `BACKEND_URL`, `DEPLOY_WEBHOOK_SECRET`
   - Backend `.env`: Database credentials and JWT secrets
   - PM2 ecosystem config loads `.env` file automatically

4. **Deployment:**
   - Webhook endpoint: `https://staging.processordb.mit.edu/api/deploy` (HTTPS enabled)
   - Deployment script: `~/processordb-website-staging/scripts/deploy.sh`
   - Git credentials: Configured via credential helper

5. **SSL/HTTPS:**
   - SSL certificate: Let's Encrypt (managed by certbot)
   - Certificate location: `/etc/letsencrypt/live/staging.processordb.mit.edu/`
   - HTTP (port 80): Automatically redirects to HTTPS
   - HTTPS (port 443): Active and serving content
   - Auto-renewal: Enabled via certbot timer

## SSL Certificate Setup with Certbot

The staging site uses Let's Encrypt SSL certificates managed by certbot for automated certificate renewal.

### Current Status

✅ **SSL is configured and active:**
- Certificate obtained and installed
- HTTP automatically redirects to HTTPS
- Auto-renewal is enabled via systemd timer
- Certificate expires: March 1, 2026 (auto-renewed before expiration)

### Certificate Information

```bash
# View certificate details
sudo certbot certificates

# Check certificate expiration
sudo certbot certificates | grep -A 5 "staging.processordb.mit.edu"

# Test certificate renewal (dry run)
sudo certbot renew --dry-run
```

### Auto-Renewal

Certbot automatically renews certificates before they expire. The renewal process is managed by a systemd timer:

```bash
# Check certbot timer status
sudo systemctl status certbot.timer

# View next renewal time
sudo systemctl list-timers certbot.timer

# Manually trigger renewal (if needed)
sudo certbot renew
```

**Note:** Certificates are automatically renewed twice daily. The renewal process:
1. Checks if certificates are within 30 days of expiration
2. Renews certificates if needed
3. Reloads nginx to apply new certificates
4. No downtime during renewal

### Initial Setup (Already Completed)

The SSL certificate was set up using:

```bash
# Install certbot
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# Obtain and configure certificate
sudo certbot --nginx -d staging.processordb.mit.edu --non-interactive --agree-tos --email admin@processordb.mit.edu --redirect
```

This command:
- Obtained the SSL certificate from Let's Encrypt
- Configured nginx with HTTPS
- Enabled HTTP to HTTPS redirect
- Set up automatic renewal

### Updating Application URLs

After enabling HTTPS, update your application configuration to use HTTPS URLs:

**Frontend `.env` file (`~/processordb-website-staging/.env`):**
```env
SITE_URL=https://staging.processordb.mit.edu/
BACKEND_URL=https://staging.processordb.mit.edu/backend/api
```

**GitHub Actions Environment Secrets:**
Update the `WEBHOOK_URL` in GitHub repository settings:
- Go to: Repository → Settings → Environments → Staging
- Update `WEBHOOK_URL` from `http://` to `https://staging.processordb.mit.edu/api/deploy`

**After updating URLs:**
```bash
# Rebuild the application to pick up new environment variables
cd ~/processordb-website-staging
npm run build
pm2 restart ProcessorDB-website-staging
```

### Troubleshooting SSL

```bash
# Check nginx SSL configuration
sudo nginx -t

# View SSL certificate details
openssl s_client -connect staging.processordb.mit.edu:443 -servername staging.processordb.mit.edu < /dev/null 2>/dev/null | openssl x509 -noout -dates

# Check if HTTP redirects to HTTPS
curl -I http://staging.processordb.mit.edu

# Test HTTPS connection
curl -I https://staging.processordb.mit.edu

# View certbot logs
sudo tail -f /var/log/letsencrypt/letsencrypt.log
```

### Manual Certificate Renewal

If auto-renewal fails or you need to manually renew:

```bash
# Renew all certificates
sudo certbot renew

# Renew specific certificate
sudo certbot renew --cert-name staging.processordb.mit.edu

# Renew and reload nginx
sudo certbot renew && sudo systemctl reload nginx
```

## Restricting Access to Internal MIT Networks

**Current Status:** The staging site (`staging.processordb.mit.edu`) is currently **publicly accessible** with no IP restrictions. All IP restriction directives in the nginx configuration are commented out.

To make a subdomain (e.g., staging) only accessible from internal MIT networks, you can restrict access at the nginx level using IP whitelisting by uncommenting and configuring the IP restriction directives.

**Note:** The webhook endpoint (`/api/deploy`) uses secret-based authentication and does not have IP restrictions. This section applies to frontend and backend API access only.

### Quick Setup for Staging Instance

**For staging instance at `128.52.141.130`:**

**Current Status:** IP restrictions are currently **disabled** (commented out). The staging site is publicly accessible.

To enable IP restrictions:

1. **SSH into the staging server:**
   ```bash
   ssh ubuntu@128.52.141.130
   # or use your preferred SSH method
   ```

2. **Edit the nginx configuration file:**
   ```bash
   sudo nano /etc/nginx/sites-available/staging.processordb.mit.edu
   ```

3. **Uncomment and configure IP restrictions** in each location block - Your config should look like this:

```nginx
server {
    server_name staging.processordb.mit.edu;
    
    # Frontend location - INTERNAL ONLY
    location / {
        # Allow MIT internal networks only
        allow 18.0.0.0/8;        # Main MIT network (includes 128.x.x.x)
        allow 192.168.0.0/16;    # Private networks
        allow 10.0.0.0/8;        # Private networks
        allow 127.0.0.1;         # Localhost
        deny all;                # Block all other IPs
        
        # Proxy to your staging app
        proxy_pass http://localhost:3000;  # or whatever port staging uses
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Backend location - INTERNAL ONLY (if applicable)
    location /backend/ {
        allow 18.0.0.0/8;
        allow 192.168.0.0/16;
        allow 10.0.0.0/8;
        allow 127.0.0.1;
        deny all;
        
        proxy_pass http://localhost:3001/;  # or staging backend port
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # SSL configuration (from certbot)
    listen 443 ssl;
    listen [::]:443 ssl;
    ssl_certificate /etc/letsencrypt/live/staging.processordb.mit.edu/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/staging.processordb.mit.edu/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

# HTTP to HTTPS redirect (also internal-only)
server {
    if ($host = staging.processordb.mit.edu) {
        return 301 https://$host$request_uri;
    }
    
    server_name staging.processordb.mit.edu;
    listen 80;
    listen [::]:80;
    return 404;
}
```

4. **Test the configuration:**
   ```bash
   sudo nginx -t
   ```

5. **Reload nginx:**
   ```bash
   sudo systemctl reload nginx
   ```

6. **Verify it's working:**
   ```bash
   # From an internal MIT network - should work
   curl -I https://staging.processordb.mit.edu
   
   # From external - should return 403 Forbidden
   # (test from a non-MIT network)
   ```

### MIT Internal Network Ranges

MIT uses the following IP ranges for internal networks:
- **18.0.0.0/8** - Main MIT network range (includes 18.x.x.x, 128.x.x.x, etc.)
  - This is the primary MIT network range that covers most MIT IP addresses
  - Includes the staging server IP `128.52.141.130`
- **192.168.0.0/16** - Private network ranges (if used internally by MIT)
- **10.0.0.0/8** - Private network ranges (if used internally by MIT)
- **127.0.0.1** - Localhost (always allow for local access)

**Note:** The staging server IP `128.52.141.130` is within MIT's 18.0.0.0/8 range. The `128.52.0.0/16` subnet is commonly used by CSAIL (Computer Science and Artificial Intelligence Laboratory) at MIT.

### Nginx Configuration for Internal-Only Access

**Current Status:** IP restrictions are **disabled** (commented out) in the nginx configuration. The staging site is publicly accessible.

To enable IP restrictions, you need to **uncomment** the `allow` and `deny` directives in your nginx server block. The directives are already present in the config file but are commented out.

**Location in config file:** `/etc/nginx/sites-available/staging.processordb.mit.edu`

**To enable restrictions, uncomment these directives:**

```nginx
server {
    server_name staging.processordb.mit.edu;
    
    # Restrict access to MIT internal networks only
    location / {
        # Uncomment these lines to enable IP restrictions:
        allow 18.0.0.0/8;        # Main MIT network (includes 128.x.x.x)
        allow 192.168.0.0/16;    # Private networks (if used internally)
        allow 10.0.0.0/8;        # Private networks (if used internally)
        allow 127.0.0.1;         # Localhost
        deny all;                # Block all other IPs
        
        # Your existing proxy settings
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Backend API - same restrictions if needed
    location /backend/api/ {
        # Uncomment these lines to enable IP restrictions:
        allow 18.0.0.0/8;        # Main MIT network (includes 128.x.x.x)
        allow 192.168.0.0/16;    # Private networks (if used internally)
        allow 10.0.0.0/8;        # Private networks (if used internally)
        allow 127.0.0.1;         # Localhost
        deny all;                # Block all other IPs
        
        proxy_pass http://localhost:3001/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Important:** The webhook endpoint (`/api/deploy`) should **NOT** have IP restrictions enabled, as it uses secret-based authentication and needs to be accessible from GitHub Actions IPs (which change frequently).

### Implementation Steps

1. **Edit the nginx configuration file:**
   ```bash
   sudo nano /etc/nginx/sites-available/staging.processordb.mit.edu
   ```

2. **Add allow/deny directives** to each `location` block where you want restrictions

3. **Test the configuration:**
   ```bash
   sudo nginx -t
   ```

4. **Reload nginx:**
   ```bash
   sudo systemctl reload nginx
   ```

### Testing Access Restrictions

**From an internal MIT network:**
```bash
curl -I https://staging.processordb.mit.edu
# Should return 200 OK
```

**From an external network (should be blocked):**
```bash
curl -I https://staging.processordb.mit.edu
# Should return 403 Forbidden
```

### Alternative: More Restrictive Access

If you need to restrict to specific MIT subnets only (more restrictive than the full 18.0.0.0/8 range):

```nginx
location / {
    # Allow only specific MIT subnets (more restrictive)
    allow 128.52.0.0/16;      # CSAIL network range (includes staging server 128.52.141.130)
    allow 18.7.0.0/16;        # Example: specific MIT subnet
    allow 127.0.0.1;          # Localhost
    deny all;                 # Block all other IPs
    
    # ... proxy settings
}
```

**Note:** Using `128.52.0.0/16` would restrict access to only CSAIL networks, which is more restrictive than `18.0.0.0/8` (which allows all MIT networks).

### Custom Error Page (Optional)

You can customize the 403 error page:

```nginx
location / {
    allow 18.0.0.0/8;
    deny all;
    
    error_page 403 /403.html;
    location = /403.html {
        root /var/www/html;
        internal;
    }
    
    # ... proxy settings
}
```

**Important Notes:**
- **Current Configuration:** The staging site is currently **publicly accessible** with no IP restrictions enabled
- **To Enable Restrictions:** Uncomment the `allow`/`deny` directives in `/etc/nginx/sites-available/staging.processordb.mit.edu`
- **After Enabling:** Test nginx config (`sudo nginx -t`) and reload (`sudo systemctl reload nginx`)
- **Access Restrictions:** When enabled, restrictions apply to all requests, including SSL/TLS handshakes
- **Error Response:** Users outside MIT networks will see a 403 Forbidden error when restrictions are enabled
- **VPN Access:** VPN connections to MIT networks will be treated as internal if they use MIT IP ranges
- **Testing:** Test thoroughly from both internal and external networks before deploying restrictions
- **Webhook Endpoint:** The `/api/deploy` endpoint does **NOT** use IP restrictions. It relies on secret-based authentication (`X-Webhook-Secret` header) for security. This allows GitHub Actions to trigger deployments from any IP address while maintaining strong security through the webhook secret. **Do not enable IP restrictions on the webhook endpoint.**

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
