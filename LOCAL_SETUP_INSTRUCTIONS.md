# SHIVAKESHAVA ELECTRONICS - Local Setup Instructions

## Prerequisites

1. **Node.js** (version 18 or higher)
2. **PostgreSQL** database server
3. **Git** (optional, for version control)

## Database Setup

### Option 1: Local PostgreSQL
1. Install PostgreSQL on your system
2. Create a new database:
   ```sql
   CREATE DATABASE shivakeshava_electronics;
   CREATE USER shiva_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE shivakeshava_electronics TO shiva_user;
   ```

### Option 2: Cloud Database (Recommended)
- **Neon**: https://neon.tech (Free tier available)
- **Supabase**: https://supabase.com (Free tier available)
- **PlanetScale**: https://planetscale.com (Free tier available)

## Installation Steps

1. **Extract all project files** to your desired directory
2. **Navigate to the project directory**:
   ```bash
   cd shivakeshava-electronics
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Create environment file**:
   Create a `.env` file in the root directory with:
   ```env
   # Database Configuration
   DATABASE_URL="postgresql://username:password@localhost:5432/shivakeshava_electronics"
   
   # Or for cloud database (example format):
   # DATABASE_URL="postgresql://user:pass@host:5432/dbname?sslmode=require"
   
   # Server Configuration
   NODE_ENV=development
   PORT=5000
   ```

5. **Setup database schema**:
   ```bash
   npm run db:push
   ```

6. **Start the application**:
   ```bash
   npm run dev
   ```

7. **Access the application**:
   Open your browser and go to: `http://localhost:5000`

## Project Structure

```
shivakeshava-electronics/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/         # Application pages
│   │   ├── lib/           # Utilities and PDF generation
│   │   └── types/         # TypeScript type definitions
│   └── index.html
├── server/                # Backend Express server
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Data layer
│   └── db.ts            # Database connection
├── shared/               # Shared types and schemas
│   └── schema.ts        # Database schema and types
├── package.json         # Dependencies and scripts
├── drizzle.config.ts    # Database configuration
└── .env                 # Environment variables (create this)
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open database management interface

## Features Included

✓ **Dashboard** with job tracking and metrics
✓ **Job Sheet Management** with acknowledgment PDFs
✓ **Customer Management** with contact details
✓ **Technician Management** with performance tracking
✓ **Invoice Generation** (GST and Non-GST) with PDF export
✓ **Payment Tracking** and billing management
✓ **Inventory Management** for parts and supplies
✓ **PDF Generation** for acknowledgments and invoices

## Business Information Pre-configured

- **Company**: SHIVAKESHAVA ELECTRONICS
- **Address**: Dr. No 29-14-62, 2nd Floor, Beside Andhra Hospital, Seshadri Sastri Street, Governorpet, Vijayawada – 2
- **Contact**: Ph: 9182193469, 9642365559 | Landline: 08664534719
- **Email**: shivakesavelecronics@gmail.com

## Customization

To modify company details, update the following files:
- `client/src/lib/pdf-generator.ts` - PDF headers and contact info
- `client/src/components/layout/sidebar.tsx` - Application branding
- `client/index.html` - Page title and meta description

## Support

For technical support or customization requests, refer to the code comments and documentation within the files.