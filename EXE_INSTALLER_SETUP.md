# 📦 EXE Installer Setup for SHIVAKESHAVA ELECTRONICS

## Overview
Create a downloadable .exe installer that users can download from S3 and install your service management application on their Windows systems.

## 🎯 Solution: Electron + Installer Package

### Step 1: Convert to Electron App

Create `electron-main.js` in your project root:
```javascript
const { app, BrowserWindow, shell } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;
let serverProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    icon: path.join(__dirname, 'assets/icon.ico'), // Add your app icon
    title: 'SHIVAKESHAVA ELECTRONICS - Service Management'
  });

  // Start the Express server
  if (!isDev) {
    serverProcess = spawn('node', [path.join(__dirname, 'server/index.js')], {
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' }
    });
  }

  // Load the React app
  const startUrl = isDev ? 'http://localhost:5000' : 'http://localhost:5000';
  mainWindow.loadURL(startUrl);

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (serverProcess) {
      serverProcess.kill();
    }
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('before-quit', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});
```

### Step 2: Update package.json for Electron

Add to your `package.json`:
```json
{
  "main": "electron-main.js",
  "homepage": "./",
  "scripts": {
    "electron": "electron .",
    "electron-dev": "concurrently \"npm run dev\" \"wait-on http://localhost:5000 && electron .\"",
    "build-electron": "npm run build && electron-builder",
    "dist": "npm run build && electron-builder --publish=never"
  },
  "devDependencies": {
    "electron": "^22.0.0",
    "electron-builder": "^24.0.0",
    "electron-is-dev": "^2.0.0",
    "concurrently": "^7.6.0",
    "wait-on": "^7.0.1"
  },
  "build": {
    "appId": "com.shivakeshava.electronics",
    "productName": "SHIVAKESHAVA ELECTRONICS",
    "directories": {
      "output": "dist-electron"
    },
    "files": [
      "build/**/*",
      "server/**/*",
      "shared/**/*",
      "node_modules/**/*",
      "electron-main.js",
      "package.json"
    ],
    "win": {
      "target": "nsis",
      "icon": "assets/icon.ico"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true,
      "shortcutName": "SHIVAKESHAVA ELECTRONICS"
    }
  }
}
```

### Step 3: Create Build Script

Create `build-installer.js`:
```javascript
const builder = require('electron-builder');
const path = require('path');

async function buildInstaller() {
  console.log('Building SHIVAKESHAVA ELECTRONICS installer...');
  
  const config = {
    appId: 'com.shivakeshava.electronics',
    productName: 'SHIVAKESHAVA ELECTRONICS',
    directories: {
      output: 'dist-installer'
    },
    files: [
      'build/**/*',
      'server/**/*',
      'shared/**/*',
      'node_modules/**/*',
      'electron-main.js',
      'package.json'
    ],
    win: {
      target: {
        target: 'nsis',
        arch: ['x64']
      },
      icon: 'assets/icon.ico'
    },
    nsis: {
      oneClick: false,
      allowToChangeInstallationDirectory: true,
      createDesktopShortcut: true,
      createStartMenuShortcut: true,
      shortcutName: 'SHIVAKESHAVA ELECTRONICS',
      installerIcon: 'assets/icon.ico',
      uninstallerIcon: 'assets/icon.ico',
      installerHeaderIcon: 'assets/icon.ico',
      displayLanguageSelector: false,
      runAfterFinish: true
    }
  };

  try {
    const result = await builder.build({
      targets: builder.Platform.WINDOWS.createTarget(),
      config
    });
    console.log('Build completed!');
    console.log('Installer location:', result);
  } catch (error) {
    console.error('Build failed:', error);
  }
}

buildInstaller();
```

### Step 4: Create Production Build Script

Create `prepare-release.js`:
```javascript
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Preparing SHIVAKESHAVA ELECTRONICS for release...');

// 1. Build the React frontend
console.log('📦 Building frontend...');
execSync('npm run build', { stdio: 'inherit' });

// 2. Copy server files
console.log('📁 Preparing server files...');
if (!fs.existsSync('build/server')) {
  fs.mkdirSync('build/server', { recursive: true });
}

// Copy server directory
execSync('cp -r server/* build/server/', { stdio: 'inherit' });
execSync('cp -r shared build/', { stdio: 'inherit' });

// 3. Create production package.json
const prodPackage = {
  name: "shivakeshava-electronics",
  version: "1.0.0",
  description: "SHIVAKESHAVA ELECTRONICS Service Management System",
  main: "electron-main.js",
  scripts: {
    "start": "node server/index.js"
  },
  dependencies: {
    // Include only production dependencies
    "express": "^4.18.2",
    "mysql2": "^3.6.0",
    "drizzle-orm": "^0.28.0",
    // Add other runtime dependencies
  }
};

fs.writeFileSync('build/package.json', JSON.stringify(prodPackage, null, 2));

// 4. Create .env template
const envTemplate = `DATABASE_URL=mysql://root:@localhost:3306/shivakeshava_electronics
NODE_ENV=production
PORT=5000`;

fs.writeFileSync('build/.env.example', envTemplate);

console.log('✅ Release preparation complete!');
```

## 🏗️ Alternative: Simple Installer Package

### Option 1: Create Windows Installer with NSIS

Create `installer.nsi`:
```nsis
!include MUI2.nsh

Name "SHIVAKESHAVA ELECTRONICS"
OutFile "SHIVAKESHAVA-ELECTRONICS-Setup.exe"
InstallDir "$PROGRAMFILES\SHIVAKESHAVA ELECTRONICS"

!define MUI_ABORTWARNING
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "LICENSE.txt"
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_WELCOME
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_UNPAGE_FINISH

!insertmacro MUI_LANGUAGE "English"

Section "Application Files" SecFiles
  SetOutPath "$INSTDIR"
  
  ; Copy all application files
  File /r "build\*.*"
  File /r "server\*.*"
  File /r "shared\*.*"
  File /r "node_modules\*.*"
  File "package.json"
  File "start-app.bat"
  
  ; Create shortcuts
  CreateDirectory "$SMPROGRAMS\SHIVAKESHAVA ELECTRONICS"
  CreateShortCut "$SMPROGRAMS\SHIVAKESHAVA ELECTRONICS\SHIVAKESHAVA ELECTRONICS.lnk" "$INSTDIR\start-app.bat"
  CreateShortCut "$DESKTOP\SHIVAKESHAVA ELECTRONICS.lnk" "$INSTDIR\start-app.bat"
  
  ; Registry entries
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\SHIVAKESHAVA" "DisplayName" "SHIVAKESHAVA ELECTRONICS"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\SHIVAKESHAVA" "UninstallString" "$INSTDIR\uninstall.exe"
  
  WriteUninstaller "$INSTDIR\uninstall.exe"
SectionEnd

Section "Uninstall"
  Delete "$INSTDIR\*.*"
  RMDir /r "$INSTDIR"
  Delete "$SMPROGRAMS\SHIVAKESHAVA ELECTRONICS\*.*"
  RMDir "$SMPROGRAMS\SHIVAKESHAVA ELECTRONICS"
  Delete "$DESKTOP\SHIVAKESHAVA ELECTRONICS.lnk"
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\SHIVAKESHAVA"
SectionEnd
```

### Option 2: PowerShell Installer Script

Create `install.ps1`:
```powershell
# SHIVAKESHAVA ELECTRONICS Installer
Write-Host "Installing SHIVAKESHAVA ELECTRONICS Service Management System..." -ForegroundColor Green

# Check if Node.js is installed
$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
    Write-Host "Node.js is required. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Create installation directory
$installPath = "$env:PROGRAMFILES\SHIVAKESHAVA ELECTRONICS"
New-Item -ItemType Directory -Path $installPath -Force

# Copy application files
Copy-Item -Path ".\*" -Destination $installPath -Recurse -Force

# Install dependencies
Set-Location $installPath
npm install --production

# Create desktop shortcut
$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut("$env:USERPROFILE\Desktop\SHIVAKESHAVA ELECTRONICS.lnk")
$shortcut.TargetPath = "$installPath\start-app.bat"
$shortcut.WorkingDirectory = $installPath
$shortcut.Save()

Write-Host "Installation completed successfully!" -ForegroundColor Green
Write-Host "You can now run SHIVAKESHAVA ELECTRONICS from your desktop." -ForegroundColor Yellow
```

## 📤 S3 Upload Setup

### Upload Script `upload-to-s3.js`:
```javascript
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1' // Change to your region
});

async function uploadInstaller() {
  const filePath = './dist-installer/SHIVAKESHAVA-ELECTRONICS-Setup.exe';
  const fileContent = fs.readFileSync(filePath);
  
  const params = {
    Bucket: 'your-bucket-name',
    Key: 'downloads/SHIVAKESHAVA-ELECTRONICS-Setup.exe',
    Body: fileContent,
    ContentType: 'application/octet-stream',
    ACL: 'public-read'
  };

  try {
    const result = await s3.upload(params).promise();
    console.log('Upload successful:', result.Location);
    return result.Location;
  } catch (error) {
    console.error('Upload failed:', error);
  }
}

uploadInstaller();
```

## 🎯 Complete Build Process

1. **Install dependencies:**
   ```bash
   npm install electron electron-builder electron-is-dev concurrently wait-on --save-dev
   ```

2. **Build the installer:**
   ```bash
   npm run build
   node prepare-release.js
   npm run build-electron
   ```

3. **Upload to S3:**
   ```bash
   node upload-to-s3.js
   ```

4. **Share download link:**
   ```
   https://your-bucket.s3.amazonaws.com/downloads/SHIVAKESHAVA-ELECTRONICS-Setup.exe
   ```

Your users will be able to download and install your service management application as a standalone Windows application!