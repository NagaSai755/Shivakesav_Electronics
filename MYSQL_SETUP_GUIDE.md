# MySQL Setup Guide - SHIVAKESHAVA ELECTRONICS

## Perfect! MySQL Configuration Complete

Your application is now configured to work with MySQL instead of PostgreSQL. Here's how to set it up locally:

## Quick MySQL Setup

### Step 1: Download Project
- In Replit: Click **three dots (⋯)** → **"Download as Zip"**
- Extract to your desired folder

### Step 2: Setup for Windows
```cmd
cd your-project-folder
move package-local.json package.json
npm install
```

### Step 3: MySQL Database Configuration
```cmd
copy .env.example .env
notepad .env
```

**Edit the .env file with your MySQL database details:**

### For XAMPP/WAMP (Most Common)
```env
DATABASE_URL="mysql://root:@localhost:3306/shivakeshava_electronics"
NODE_ENV=development
PORT=5000
```

### For Standard MySQL Installation
```env
DATABASE_URL="mysql://username:password@localhost:3306/shivakeshava_electronics"
NODE_ENV=development
PORT=5000
```

## MySQL Installation Options

### Option 1: XAMPP (Recommended for Windows)
1. Download from: https://www.apachefriends.org/
2. Install with default settings
3. Start Apache and MySQL from XAMPP Control Panel
4. Use phpMyAdmin to create database

### Option 2: MySQL Workbench (Professional)
1. Download from: https://dev.mysql.com/downloads/workbench/
2. Install MySQL Server and Workbench
3. Create database using Workbench interface
4. **See MYSQL_WORKBENCH_SETUP.md for detailed step-by-step instructions**

### Option 3: Command Line MySQL
1. Download from: https://dev.mysql.com/downloads/mysql/
2. Install with custom settings
3. Use MySQL command line to create database

## Create Database

### Using phpMyAdmin (XAMPP/WAMP)
1. Open http://localhost/phpmyadmin
2. Click "New" in left sidebar
3. Database name: `shivakeshava_electronics`
4. Click "Create"

### Using MySQL Workbench
1. Connect to your MySQL server
2. Click "Create Schema" icon
3. Name: `shivakeshava_electronics`
4. Click "Apply"

### Using Command Line
```cmd
mysql -u root -p
CREATE DATABASE shivakeshava_electronics;
exit
```

## Initialize Database Schema
```cmd
npm run db:push
```

## Start Application
```cmd
npm run dev:win
```

## Access Application
Open browser: http://localhost:5000

## Common MySQL Connection Strings

### XAMPP (Default)
```env
DATABASE_URL="mysql://root:@localhost:3306/shivakeshava_electronics"
```

### WAMP (Default)
```env
DATABASE_URL="mysql://root:@localhost:3306/shivakeshava_electronics"
```

### MySQL with Password
```env
DATABASE_URL="mysql://root:your_password@localhost:3306/shivakeshava_electronics"
```

### Custom User
```env
DATABASE_URL="mysql://your_username:your_password@localhost:3306/shivakeshava_electronics"
```

## Cloud MySQL Options (If you prefer not to install locally)

### PlanetScale (Free Tier)
1. Sign up at https://planetscale.com
2. Create database
3. Get connection string
4. Add to .env file

### Railway (Free Tier)
1. Sign up at https://railway.app
2. Create MySQL service
3. Get connection string
4. Add to .env file

## Troubleshooting

### "Cannot connect to MySQL server"
1. Ensure MySQL service is running (XAMPP Control Panel)
2. Check username/password in DATABASE_URL
3. Verify port (usually 3306)
4. Test connection with phpMyAdmin or Workbench

### "Database doesn't exist"
1. Create the database using one of the methods above
2. Ensure database name matches exactly: `shivakeshava_electronics`

### "Access denied for user"
1. Check username and password in DATABASE_URL
2. For XAMPP, default is usually `root` with no password
3. For custom MySQL, use your actual credentials

### "Port already in use"
Change PORT in .env file:
```env
PORT=3000
```

## Default MySQL Ports and Credentials

### XAMPP
- Host: localhost
- Port: 3306
- Username: root
- Password: (empty)
- phpMyAdmin: http://localhost/phpmyadmin

### WAMP
- Host: localhost
- Port: 3306
- Username: root
- Password: (empty)
- phpMyAdmin: http://localhost/phpmyadmin

## Application Features Ready

Your SHIVAKESHAVA ELECTRONICS system includes:
- ✅ Complete job sheet management
- ✅ Customer & technician tracking
- ✅ PDF invoice generation (GST & Non-GST)
- ✅ Payment tracking
- ✅ Dashboard with real-time metrics
- ✅ MySQL database integration
- ✅ Windows compatibility

All business information is pre-configured and ready to use!