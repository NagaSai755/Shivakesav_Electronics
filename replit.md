# SHIVAKESHAVA ELECTRONICS Service Management System

## Overview

SHIVAKESHAVA ELECTRONICS Service Management System is a comprehensive service center management application designed specifically for SHIVAKESHAVA ELECTRONICS, an electronic appliance service and repair center located in Vijayawada. The application manages the complete workflow from job sheet creation to technician assignment, customer management, inventory tracking, and billing. It features a dashboard-driven interface that provides real-time insights into active jobs, completed tasks, pending work, revenue tracking, and technician performance metrics.

## Business Information
- **Company Name**: SHIVAKESHAVA ELECTRONICS  
- **Business Type**: Electronic Appliance Service & Repair Center
- **Address**: Dr. No 29-14-62, 2nd Floor, Beside Andhra Hospital, Seshadri Sastri Street, Governorpet, Vijayawada – 2
- **Contact**: Ph: 9182193469, 9642365559 | Landline: 08664534719
- **Email**: shivakesavelecronics@gmail.com

## User Preferences

Preferred communication style: Simple, everyday language.

### Invoice Format Preferences
- **Updated Invoice Styling (August 28, 2025)**: Implemented exact format matching uploaded sample bill
- Brand tile with blue company name and **bold** authorization text positioned close to brand
- Added official GST number (37BYOPS6182A1Z1) and PAN (BYOPS6182A) below contact info
- Professional "TAX INVOICE" header with invoice metadata on right side  
- "Bill To" and "Service Details" sections with blue headers and bordered layout
- **Updated Bank Details**: UNION BANK OF INDIA, A/c: 014511010000133, IFSC: UBIN0801453, Governerpet, Vijayawada
- Simplified item description format following sample bill style (KORE00300052 DIAL UNIT AND SERVICE CHAR)
- Maintained GST-inclusive calculation logic and tax breakdown display
- Clean, professional styling with consistent blue color scheme (#3366cc)
- **A4 Sheet Optimization (August 28, 2025)**: Added 2px solid black outer border, optimized for A4 printing with reduced font sizes and tighter spacing
- **Applied to Both**: GST invoices and D-invoices both feature outer border and A4 optimization

### GST Calculation System
- **Updated to GST-Inclusive Rates (August 28, 2025)**: System now handles rates that include GST
- **Calculation Logic**: Taxable Amount = GST Inclusive Amount ÷ (1 + GST Rate/100)
- **Tax Breakdown**: For AP customers uses CGST+SGST, for other states uses IGST
- **Real-world Example**: ₹1180 entered → Taxable: ₹1000, GST: ₹180, Total: ₹1180
- **Applied to**: Regular invoices, D-invoices, and PDF generation
- **CRITICAL BUG FIX (August 29, 2025)**: Fixed GST calculation logic in PDF generation - AP customers now correctly show CGST+SGST instead of IGST. Updated PDF generator to use `customerState` field instead of parsing `customerAddress` for state detection.

### Dynamic Invoice Items (August 29, 2025)
- **Service Charge Conditional Display**: Service charge row only appears when amount > 0
- **Dynamic Item Numbering**: Parts automatically renumbered based on service charge presence
- **Clean Item Descriptions**: Removed hardcoded "KORE00300052 DIAL UNIT" placeholder text
- **Proper Row Count Calculation**: Empty rows adjust automatically for service charge inclusion

### Quotation System Updates (August 29, 2025)
- **Updated Validity Period**: Changed default validity from 30 days to 10 days
- **Simplified Heading**: Changed from "QUOTATION/PROFORMA INVOICE" to simply "QUOTATION"
- **Clean Item Table**: Removed empty row fillers from item description table for cleaner appearance
- **Merged Amount Table**: Integrated amount in words and net amount into main item table (removed separate table)
- **Remarks Management**: Remarks save to database but don't print in PDF output
- **Table Structure**: Added 17 rows total with horizontal line at bottom, no horizontal lines between item rows

### Automatic Job Sheet Status Management (August 29, 2025)
- **Technician Assignment Auto-Status**: When technician assigned to pending job → status changes to "in_progress"
- **Technician Removal Auto-Status**: When technician removed from in_progress job → status reverts to "pending"
- **Invoice Completion Auto-Status**: When invoice or D-invoice created → job sheet status changes to "completed"
- **Business Logic Integration**: Eliminates manual status updates, ensures accurate workflow tracking
- **Status Flow**: pending → (technician assigned) → in_progress → (invoice generated) → completed

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **State Management**: TanStack Query for server state management and React Hook Form for form handling
- **Data Validation**: Zod schemas for form validation and API data validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with structured route handlers
- **Middleware**: Express middleware for request logging, JSON parsing, and error handling
- **Development**: Hot reload with Vite integration for development mode

### Database and ORM
- **Database**: Dual support - PostgreSQL (Replit) and MySQL (Local deployment)
- **ORM**: Drizzle ORM with schema-first approach
- **Migrations**: Manual schema setup for MySQL due to drizzle.config.ts limitations
- **Connection**: Connection pooling with @neondatabase/serverless (Replit) or mysql2 (Local)
- **Local Setup**: MySQL database with manual table creation or memory storage option

### Data Models and Schema
The system uses a comprehensive relational schema with these core entities:
- **Users**: Admin and staff authentication
- **Customers**: Customer information and contact details
- **Technicians**: Staff management with performance tracking
- **Product Hierarchy**: Product types, brands, and models for service categorization
- **Job Sheets**: Central entity linking customers, technicians, and service requests
- **Inventory**: Parts and supplies management
- **Payments**: Billing and payment tracking with GST support

### Authentication and Session Management
- Session-based authentication using connect-pg-simple for PostgreSQL session storage
- Role-based access control with admin and technician roles
- Secure session handling with proper cookie configuration

### PDF Generation and Reporting
- Client-side PDF generation for job sheets and invoices
- Custom PDF templates for acknowledgment slips
- GST and non-GST invoice generation capabilities

### File Structure Organization
- **Shared Schema**: Common TypeScript types and Zod schemas in `/shared`
- **Frontend**: React application in `/client` with component-based architecture
- **Backend**: Express server in `/server` with modular route handlers
- **Database**: Centralized database connection and storage layer

### Development and Build Process
- **Development**: Concurrent frontend and backend development with hot reload
- **Type Safety**: Full TypeScript coverage across frontend, backend, and shared code
- **Build Process**: Vite for frontend bundling and esbuild for backend compilation
- **Code Quality**: ESLint and TypeScript strict mode for code quality

### Database Services
- **Replit Environment**: Neon Database with PostgreSQL for cloud deployment
- **Local Environment**: MySQL with mysql2 driver for local Windows deployment
- **Connection Pooling**: @neondatabase/serverless (Replit) or mysql2 (Local)
- **Schema Management**: Manual setup required for MySQL due to Drizzle config limitations

### UI and Styling Libraries
- **Radix UI**: Headless UI primitives for accessible components
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Utility for managing component variants

### Backend Services
- **Express.js**: Web application framework for Node.js
- **Drizzle ORM**: Type-safe ORM for PostgreSQL
- **Session Management**: connect-pg-simple for PostgreSQL session storage

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type system for JavaScript
- **TanStack Query**: Server state management for React
- **React Hook Form**: Form management with validation
- **Zod**: Schema validation library

### PDF and Document Generation
- **Client-side PDF generation**: Custom implementation for job sheets and invoices
- **Date manipulation**: date-fns for consistent date formatting and calculations

### Replit Integration
- **Development Environment**: Specialized Vite plugins for Replit development
- **Error Handling**: Runtime error overlay for development debugging
- **Cartographer**: Code mapping and navigation tools for Replit environment