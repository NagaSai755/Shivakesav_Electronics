# Local Database Conversion - MySQL Setup for Windows

## Quick Fix for Your Current Issue

The electron app is not showing a window because:

1. **Missing package.json configuration**
2. **Need to switch from PostgreSQL to MySQL for local**
3. **Admin warnings need to be suppressed**

## Step 1: Fix package.json

Open your `package.json` file and make these changes:

**Add after line 5 (after "license": "MIT",):**
```json
"main": "electron.js",
```

**Replace your scripts section (lines 6-12) with:**
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

**Add at the end of package.json (before the final }):**
```json
,
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
    "target": "nsis"
  },
  "nsis": {
    "oneClick": false,
    "allowToChangeInstallationDirectory": true,
    "createDesktopShortcut": true,
    "shortcutName": "SHIVAKESHAVA ELECTRONICS"
  }
}
```

## Step 2: Convert Database to MySQL

Update your `server/db.ts` file to use MySQL instead of PostgreSQL:

```typescript
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set in .env file");
}

// Create connection pool for MySQL
export const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  connectionLimit: 10,
});

export const db = drizzle(pool, { schema, mode: 'default' });
```

## Step 3: Convert Schema to MySQL

Update your `shared/schema.ts` file - change the imports:

```typescript
import { mysqlTable, text, varchar, int, timestamp, decimal, boolean, serial } from "drizzle-orm/mysql-core";
```

And change all table definitions from `pgTable` to `mysqlTable`.

## Step 4: Create .env File

Create a `.env` file in your project root:

```env
DATABASE_URL="mysql://root:@localhost:3306/shivakeshava_electronics"
NODE_ENV=development
PORT=5000
```

## Step 5: Install Dependencies

```bash
npm install mysql2 --save
npm install electron electron-builder --save-dev
```

## Step 6: Setup MySQL Database

1. Start XAMPP/WAMP
2. Create database: `shivakeshava_electronics`
3. Run the table creation scripts from `MYSQL_SUCCESS_GUIDE.md`

## Step 7: Test Desktop App

```bash
npm run electron
```

This should now:
1. ✅ Open a desktop window with loading screen
2. ✅ Start your Express server automatically  
3. ✅ Load SHIVAKESHAVA ELECTRONICS application
4. ✅ Show dashboard and all features

## Step 8: Create Installer

```bash
npm run dist
```

This creates the `.exe` installer in `dist-electron` folder that you can distribute to customers.