# MySQL Success Guide - Final Steps

## Current Situation

Your desktop app (.exe) is working perfectly, but it's showing a connection error because:

1. **Database mismatch**: App expects MySQL but schema is PostgreSQL
2. **Missing tables**: Database tables don't match what the app needs
3. **Wrong connection**: Environment not configured properly

## Complete Fix (10 minutes)

### Step 1: Reset MySQL Database

Open **phpMyAdmin** (http://localhost/phpmyadmin) and run:

```sql
DROP DATABASE IF EXISTS shivakeshava_electronics;
CREATE DATABASE shivakeshava_electronics;
USE shivakeshava_electronics;
```

### Step 2: Create All Tables

Run this complete table creation script:

```sql
-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin'
);

-- Customers table  
CREATE TABLE customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  alternate_phone VARCHAR(20),
  address TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Technicians table
CREATE TABLE technicians (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'technician',
  joining_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  base_salary DECIMAL(10, 2),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product types table
CREATE TABLE product_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  display_name VARCHAR(255) NOT NULL
);

-- Brands table
CREATE TABLE brands (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  product_type_id INT,
  FOREIGN KEY (product_type_id) REFERENCES product_types(id)
);

-- Models table
CREATE TABLE models (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  brand_id INT,
  FOREIGN KEY (brand_id) REFERENCES brands(id)
);

-- Job sheets table
CREATE TABLE job_sheets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id VARCHAR(50) UNIQUE NOT NULL,
  customer_id INT,
  product_type_id INT,
  brand_id INT,
  model_id INT,
  model_number VARCHAR(100),
  serial_number VARCHAR(100),
  purchase_date TIMESTAMP NULL,
  warranty_status VARCHAR(20) DEFAULT 'out_warranty',
  job_type VARCHAR(20) NOT NULL,
  job_classification VARCHAR(30) NOT NULL,
  job_mode VARCHAR(20) DEFAULT 'indoor',
  technician_id INT,
  problem_description TEXT,
  estimated_cost DECIMAL(10, 2),
  actual_cost DECIMAL(10, 2),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (product_type_id) REFERENCES product_types(id),
  FOREIGN KEY (brand_id) REFERENCES brands(id),
  FOREIGN KEY (model_id) REFERENCES models(id),
  FOREIGN KEY (technician_id) REFERENCES technicians(id)
);
```

### Step 3: Insert Sample Data

```sql
-- Product types
INSERT INTO product_types (name, display_name) VALUES 
('ac', 'Air Conditioner'),
('washing_machine', 'Washing Machine'),
('refrigerator', 'Refrigerator'),
('microwave', 'Microwave'),
('tv', 'Television');

-- Technicians
INSERT INTO technicians (employee_id, name, phone, role, joining_date, base_salary) VALUES
('EMP001', 'Ravi Kumar', '9182193469', 'technician', '2024-01-01', 15000.00),
('EMP002', 'Suresh Reddy', '9642365559', 'technician', '2024-01-15', 14000.00),
('EMP003', 'Prakash Singh', '9876543212', 'technician', '2024-02-01', 13000.00);

-- Brands
INSERT INTO brands (name, display_name, product_type_id) VALUES
('lg', 'LG', 1), ('samsung', 'Samsung', 1), ('voltas', 'Voltas', 1),
('whirlpool', 'Whirlpool', 2), ('ifb', 'IFB', 2);

-- Admin user
INSERT INTO users (username, password, name, role) VALUES
('admin', 'admin123', 'SHIVAKESHAVA ELECTRONICS', 'admin');
```

### Step 4: Verify Tables

Check tables were created:

```sql
SHOW TABLES;
SELECT COUNT(*) FROM product_types;
SELECT COUNT(*) FROM technicians;
SELECT * FROM technicians;
```

### Step 5: Create .env File

In your desktop app folder (where it's installed), create `.env`:

```env
DATABASE_URL=mysql://root:@localhost:3306/shivakeshava_electronics
NODE_ENV=production
PORT=5000
```

### Step 6: Test Desktop App

1. **Close** desktop app completely
2. **Start** MySQL in XAMPP
3. **Launch** SHIVAKESHAVA ELECTRONICS from Start Menu

## Success Result

✅ **Loading Screen**: "SHIVAKESHAVA ELECTRONICS - Starting..."  
✅ **Dashboard Loads**: Shows Active Jobs: 0, Completed Today: 0  
✅ **Sample Data**: 5 product types, 3 technicians visible  
✅ **Full Functionality**: Create job sheets, manage customers  

## If Still Connection Error

Double-check:
1. MySQL service running in XAMPP (green light)
2. Database `shivakeshava_electronics` exists
3. Tables created successfully (7 tables total)
4. `.env` file in correct location

Your desktop app (.exe) is perfect - it just needs this database setup!