# Windows Electron Setup for SHIVAKESHAVA ELECTRONICS

## Step 1: Update package.json

Add these lines to your `package.json`:

### Add main entry point (after line 5, after "license": "MIT",):
```json
"main": "electron.js",
```

### Update scripts section (replace lines 6-12):
```json
"scripts": {
  "dev": "set NODE_ENV=development && tsx server/index.ts",
  "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
  "start": "set NODE_ENV=production && node dist/index.js",
  "check": "tsc",
  "db:push": "drizzle-kit push",
  "electron": "electron .",
  "electron-dev": "set NODE_ENV=development && electron .",
  "build-electron": "npm run build && electron-builder",
  "dist": "npm run build && electron-builder"
},
```

### Add build configuration (at the end before closing }):
```json
"build": {
  "appId": "com.shivakeshava.electronics",
  "productName": "SHIVAKESHAVA ELECTRONICS",
  "directories": {
    "output": "dist-electron"
  },
  "files": [
    "dist/**/*",
    "server/**/*",
    "shared/**/*",
    "node_modules/**/*",
    "electron.js",
    "package.json",
    ".env"
  ],
  "win": {
    "target": "nsis",
    "icon": "assets/icon.ico"
  },
  "nsis": {
    "oneClick": false,
    "allowToChangeInstallationDirectory": true,
    "createDesktopShortcut": true,
    "shortcutName": "SHIVAKESHAVA ELECTRONICS Service Management"
  }
}
```

## Step 2: Create .env file

Create a `.env` file in your project root with your MySQL database settings:

```env
# Database Configuration for Local MySQL
DATABASE_URL="mysql://root:@localhost:3306/shivakeshava_electronics"

# Server Configuration
NODE_ENV=development
PORT=5000

# MySQL Connection Details
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=shivakeshava_electronics
```

## Step 3: Install Dependencies

```bash
npm install electron electron-builder --save-dev
npm install electron-is-dev --save
```

## Step 4: Test Commands

1. **Test Development Mode:**
   ```bash
   npm run electron-dev
   ```

2. **Build Desktop App:**
   ```bash
   npm run build-electron
   ```

3. **Create Installer:**
   ```bash
   npm run dist
   ```

## Step 5: Database Setup

Make sure your MySQL database is running and has the shivakeshava_electronics database created. Follow the instructions in `MYSQL_SUCCESS_GUIDE.md` for complete database setup.

## Troubleshooting

If you still get admin warnings:
1. Run PowerShell as regular user (not administrator)
2. Make sure MySQL service is running
3. Check if port 5000 is available

The installer will be created in the `dist-electron` folder as a `.exe` file that you can distribute to your customers.