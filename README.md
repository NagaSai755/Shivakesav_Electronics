# SHIVAKESAVA ELECTRONICS - Service Management System

A comprehensive electronic appliance service center management application built for SHIVAKESAVA ELECTRONICS.

## Company Information

**SHIVAKESAVA ELECTRONICS**  
Electronic Appliance Service & Repair Center  
Dr. No 29-14-62, 2nd Floor, Beside Andhra Hospital  
Seshadri Sastri Street, Governorpet, Vijayawada – 2  

📞 Ph: 9182193469, 9642365559  
📞 Landline: 08664534719  
📧 Email: shivakesavelecronics@gmail.com

## Features

✅ **Dashboard** - Real-time job tracking and business metrics  
✅ **Job Sheet Management** - Complete job lifecycle with acknowledgment PDFs  
✅ **Customer Management** - Contact details and service history  
✅ **Technician Management** - Staff tracking and performance metrics  
✅ **Invoice Generation** - GST and Non-GST invoices with PDF export  
✅ **Payment Tracking** - Billing and payment management  
✅ **Inventory Management** - Parts and supplies tracking  
✅ **PDF Generation** - Professional acknowledgments and invoices  

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript  
- **Database**: PostgreSQL + Drizzle ORM
- **UI**: Tailwind CSS + Radix UI + shadcn/ui
- **PDF**: Client-side generation with custom templates
- **State Management**: TanStack Query + React Hook Form

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Git (optional)

### Installation

1. **Download and extract** this project to your laptop

2. **Navigate to project folder**:
   ```bash
   cd shivakeshava-electronics
   ```

3. **Replace package.json** with the local version:
   ```bash
   mv package-local.json package.json
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Setup database**:
   - Create PostgreSQL database
   - Copy `.env.example` to `.env`
   - Update DATABASE_URL in `.env`

6. **Initialize database**:
   ```bash
   npm run db:push
   ```

7. **Start application**:
   ```bash
   npm run dev
   ```

8. **Access application**:
   Open http://localhost:5000

## Database Configuration

### Local PostgreSQL
```sql
CREATE DATABASE shivakeshava_electronics;
CREATE USER shiva_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE shivakeshava_electronics TO shiva_user;
```

### Environment Variables (.env)
```env
DATABASE_URL="postgresql://shiva_user:your_password@localhost:5432/shivakeshava_electronics"
NODE_ENV=development
PORT=5000
```

### Cloud Database Options
- **Neon** (https://neon.tech) - Recommended
- **Supabase** (https://supabase.com)
- **PlanetScale** (https://planetscale.com)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run start` - Start production server
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open database management UI

## Project Structure

```
shivakeshava-electronics/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── lib/           # PDF generation & utilities
│   │   └── types/         # TypeScript definitions
│   └── index.html
├── server/                # Express backend
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API endpoints
│   ├── storage.ts        # Data layer
│   └── db.ts            # Database connection
├── shared/               # Shared schemas
│   └── schema.ts        # Database schema & types
└── README.md            # This file
```

## Customization

### Company Details
All business information is pre-configured. To modify:
- **PDF Templates**: `client/src/lib/pdf-generator.ts`
- **App Branding**: `client/src/components/layout/sidebar.tsx`
- **Page Title**: `client/index.html`

### Adding Features
1. Update schema in `shared/schema.ts`
2. Add API routes in `server/routes.ts`
3. Create components in `client/src/components/`
4. Add pages in `client/src/pages/`

## Production Deployment

### Build for Production
```bash
npm run build
npm run start
```

### Environment Variables
Set these in production:
```env
NODE_ENV=production
DATABASE_URL="your_production_database_url"
PORT=5000
```

## Support

- Check code comments for implementation details
- Refer to `LOCAL_SETUP_INSTRUCTIONS.md` for detailed setup
- All business data is pre-configured for SHIVAKESHAVA ELECTRONICS

## License

MIT License - Customized for SHIVAKESHAVA ELECTRONICS
