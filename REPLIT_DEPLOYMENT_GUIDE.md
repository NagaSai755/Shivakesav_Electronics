# Replit Deployment Guide - SHIVAKESHAVA ELECTRONICS

## Overview
Deploy your SHIVAKESHAVA ELECTRONICS Service Management System using Replit Deployments for the simplest, most affordable production deployment.

## Why Replit Deployments?

### Advantages
- **Zero server management** - No EC2, no nginx, no PM2 setup
- **Automatic HTTPS** - SSL certificates handled automatically
- **Built-in monitoring** - Deployment health and logs included
- **One-click deployment** - Deploy directly from your Replit workspace
- **Cost effective** - Starting at $7/month for always-on hosting
- **Automatic scaling** - Handles traffic spikes automatically
- **Global CDN** - Fast loading worldwide

### Features Included
- **Custom domain support** - Use your own domain name
- **Environment variables** - Secure configuration management
- **Automatic backups** - Your code and database are backed up
- **99.9% uptime** - Production-ready reliability
- **Real-time logs** - Monitor your application performance

## Step-by-Step Deployment

### Step 1: Prepare Your Application

Your application is already configured for deployment! The existing setup includes:
- ✅ Production build scripts
- ✅ Environment variable support
- ✅ PostgreSQL database integration
- ✅ Proper error handling
- ✅ Security configurations

### Step 2: Database Migration (If Needed)

Since you're currently using MySQL locally, you can:

**Option A**: Keep PostgreSQL (Recommended)
- Your application already supports PostgreSQL
- Replit provides managed PostgreSQL database
- No code changes needed

**Option B**: Use External MySQL
- Connect to AWS RDS MySQL or other hosted MySQL
- Update DATABASE_URL environment variable

### Step 3: Deploy Using Replit Interface

1. **Open your Replit workspace**
2. **Click the "Deploy" button** in the top navigation
3. **Choose deployment type**:
   - **Autoscale**: Pay per request (good for variable traffic)
   - **Reserved VM**: Fixed monthly cost (predictable billing)

### Step 4: Configure Deployment Settings

**Deployment Configuration**:
- **Name**: `shivakeshava-electronics`
- **Region**: Choose closest to your users (Asia for India)
- **Build Command**: `npm run build` (already configured)
- **Run Command**: `npm start` (already configured)

**Environment Variables**:
Add these in the deployment settings:
```
NODE_ENV=production
DATABASE_URL=(provided by Replit PostgreSQL)
PORT=5000
```

### Step 5: Database Setup

If using Replit PostgreSQL:
1. **Add PostgreSQL addon** in deployment settings
2. **Database URL** will be automatically provided
3. **Create tables** using the provided SQL scripts (adapted for PostgreSQL)

### Step 6: Custom Domain (Optional)

1. **Purchase domain** (e.g., `shivakeshavaelectronics.com`)
2. **Add CNAME record** pointing to your Replit deployment
3. **Configure custom domain** in Replit deployment settings
4. **SSL certificate** automatically provisioned

## Database Schema for PostgreSQL

Since Replit uses PostgreSQL, here's the schema conversion:

```sql
-- Create tables in PostgreSQL format
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  alternate_phone VARCHAR(20),
  address TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE technicians (
  id SERIAL PRIMARY KEY,
  employee_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'technician',
  joining_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  base_salary DECIMAL(10, 2),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  display_name VARCHAR(255) NOT NULL
);

CREATE TABLE brands (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  product_type_id INTEGER REFERENCES product_types(id)
);

CREATE TABLE models (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  brand_id INTEGER REFERENCES brands(id)
);

CREATE TABLE job_sheets (
  id SERIAL PRIMARY KEY,
  job_id VARCHAR(50) UNIQUE NOT NULL,
  customer_id INTEGER REFERENCES customers(id),
  product_type_id INTEGER REFERENCES product_types(id),
  brand_id INTEGER REFERENCES brands(id),
  model_id INTEGER REFERENCES models(id),
  model_number VARCHAR(100),
  serial_number VARCHAR(100),
  purchase_date TIMESTAMP,
  warranty_status VARCHAR(20) DEFAULT 'out_warranty',
  job_type VARCHAR(20) NOT NULL,
  job_classification VARCHAR(30) NOT NULL,
  job_mode VARCHAR(20) DEFAULT 'indoor',
  technician_id INTEGER REFERENCES technicians(id),
  problem_description TEXT,
  estimated_cost DECIMAL(10, 2),
  actual_cost DECIMAL(10, 2),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

-- Insert sample data
INSERT INTO product_types (name, display_name) VALUES 
('ac', 'Air Conditioner'),
('washing_machine', 'Washing Machine'),
('refrigerator', 'Refrigerator'),
('microwave', 'Microwave'),
('tv', 'Television');

INSERT INTO technicians (employee_id, name, phone, role, joining_date, base_salary) VALUES
('EMP001', 'Ravi Kumar', '9182193469', 'technician', '2024-01-01', 15000.00),
('EMP002', 'Suresh Reddy', '9642365559', 'technician', '2024-01-15', 14000.00),
('EMP003', 'Prakash Singh', '9876543212', 'technician', '2024-02-01', 13000.00);
```

## Pricing Breakdown

### Autoscale Deployment
- **Free tier**: Up to 1000 requests/month
- **Paid tier**: $0.000021 per request
- **Estimated cost**: $5-15/month for small business

### Reserved VM Deployment  
- **Starter**: $7/month (0.25 vCPU, 0.5GB RAM)
- **Pro**: $20/month (1 vCPU, 2GB RAM) 
- **Max**: $56/month (2 vCPU, 4GB RAM)

**Recommended**: Reserved VM Starter at $7/month for your service center.

## Benefits for Your Business

### For SHIVAKESHAVA ELECTRONICS
- **Access from anywhere** - Staff can use from home/field
- **Mobile friendly** - Works on phones/tablets
- **No IT maintenance** - Focus on your business, not servers
- **Automatic updates** - Deploy new features instantly
- **Secure** - HTTPS encryption and data protection
- **Reliable** - 99.9% uptime guarantee

### Customer Benefits
- **Faster service** - Real-time job tracking
- **Professional image** - Modern web interface
- **Better communication** - Automated notifications
- **Transparency** - Clear pricing and progress updates

## Deployment Timeline

- **Preparation**: 30 minutes (environment variables, domain setup)
- **Deployment**: 5 minutes (click deploy and wait)
- **Database setup**: 15 minutes (run SQL scripts)
- **Testing**: 30 minutes (verify all features work)
- **Domain configuration**: 24-48 hours (DNS propagation)

**Total**: Your application can be live in under 2 hours!

## Post-Deployment

### Monitoring
- **Deployment dashboard** - Traffic, performance, errors
- **Real-time logs** - Debug issues quickly  
- **Uptime monitoring** - Get alerts if site goes down

### Maintenance
- **Automatic security updates** - No server patching needed
- **Database backups** - Automatic daily backups
- **Code deployments** - Push updates with one click

### Support
- **Replit community** - Active developer community
- **Documentation** - Comprehensive guides and tutorials
- **Email support** - Direct support for paid plans

Your SHIVAKESHAVA ELECTRONICS application will be accessible globally at your custom domain within hours!