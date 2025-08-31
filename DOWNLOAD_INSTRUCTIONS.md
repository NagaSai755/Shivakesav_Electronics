# Download & Setup Instructions - SHIVAKESHAVA ELECTRONICS

## 🚨 IMPORTANT: Database Setup Required

The error you're seeing (`DATABASE_URL must be set`) is **normal and expected** for local setup. Here's how to fix it:

## Quick Setup (5 Minutes)

### Step 1: Download Project
- In Replit: Click **three dots (⋯)** → **"Download as Zip"**
- Extract to your desired folder

### Step 2: Setup for Windows
```cmd
cd your-project-folder
move package-local.json package.json
npm install
```

### Step 3: Database Configuration
```cmd
copy .env.example .env
notepad .env
```

**Edit the .env file with your MySQL database details:**

**For XAMPP/WAMP (Most Common):**
```env
DATABASE_URL="mysql://root:@localhost:3306/shivakeshava_electronics"
NODE_ENV=development
PORT=5000
```

**For MySQL with Password:**
```env
DATABASE_URL="mysql://username:password@localhost:3306/shivakeshava_electronics"
NODE_ENV=development
PORT=5000
```

### Step 4: Create Database
**Option A - Using phpMyAdmin (XAMPP/WAMP):**
1. Open http://localhost/phpmyadmin
2. Click "New" in left sidebar
3. Database name: `shivakeshava_electronics`
4. Click "Create"

**Option B - Using MySQL Command Line:**
```cmd
mysql -u root -p
CREATE DATABASE shivakeshava_electronics;
exit
```

### Step 5: Initialize Database
```cmd
npm run db:push
```

### Step 6: Start Application
```cmd
npm run dev:win
```

## Don't Have MySQL? Easy Options

### Option 1: XAMPP (Recommended)
1. Download from https://www.apachefriends.org/
2. Install and start MySQL service
3. Use phpMyAdmin to create database

### Option 2: Cloud MySQL (Free)
1. Sign up at https://planetscale.com
2. Create MySQL database
3. Copy connection string to your `.env` file

## Files Included in Download

✅ **package-local.json** - Windows-compatible package.json  
✅ **start-windows.bat** - One-click startup script  
✅ **WINDOWS_SETUP_GUIDE.md** - Detailed Windows instructions  
✅ **.env.example** - Database configuration template  
✅ **QUICK_WINDOWS_FIX.md** - Immediate error fixes  

## Alternative Startup Methods

**Method 1: Batch File (Easiest)**
```cmd
start-windows.bat
```

**Method 2: Direct Command**
```cmd
set NODE_ENV=development && tsx server/index.ts
```

**Method 3: PowerShell**
```powershell
$env:NODE_ENV="development"; tsx server/index.ts
```

## What You Get

Your downloaded application includes:

### 🏢 Business Features
- Complete job sheet management
- Customer & technician tracking
- PDF invoice generation (GST & Non-GST)
- Payment tracking
- Dashboard with real-time metrics

### 🎨 Customization
- Pre-configured with SHIVAKESHAVA ELECTRONICS branding
- Your business address and contact details
- Professional PDF templates
- Company logo ready

### 💻 Technical Features
- Modern React frontend
- PostgreSQL database
- PDF generation
- Responsive design
- Windows compatibility

## Need Help?

**For the error you're seeing:** Follow Step 3 above to create the `.env` file
**For Windows issues:** Check `WINDOWS_SETUP_GUIDE.md`
**For MySQL setup:** Check `MYSQL_SETUP_GUIDE.md`
**For MySQL Workbench:** Check `MYSQL_WORKBENCH_SETUP.md`
**For database setup:** Check `LOCAL_SETUP_INSTRUCTIONS.md`

Your application is **fully functional and ready to use** once the database is configured!