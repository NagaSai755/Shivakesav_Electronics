# Database Setup Fix - MySQL Tables

## The Error You're Seeing

`ERROR 1054 (42S22): Unknown column 'specialization' in 'field list'`

This means the technicians table was created without the `specialization` column. Here's the fix:

## Step 1: Fix Technicians Table

Open phpMyAdmin and run this command to add the missing column:

```sql
ALTER TABLE technicians ADD COLUMN specialization VARCHAR(255) AFTER email;
```

## Step 2: Complete Table Setup

If you haven't created all tables yet, run these commands in phpMyAdmin:

```sql
-- Create database (if not exists)
CREATE DATABASE IF NOT EXISTS shivakeshava_electronics;
USE shivakeshava_electronics;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'technician') DEFAULT 'technician',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product types table
CREATE TABLE IF NOT EXISTS product_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  display_name VARCHAR(100) NOT NULL
);

-- Brands table
CREATE TABLE IF NOT EXISTS brands (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  product_type_id INT,
  FOREIGN KEY (product_type_id) REFERENCES product_types(id)
);

-- Models table
CREATE TABLE IF NOT EXISTS models (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  brand_id INT,
  FOREIGN KEY (brand_id) REFERENCES brands(id)
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Technicians table (with specialization column)
CREATE TABLE IF NOT EXISTS technicians (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  specialization VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Job sheets table
CREATE TABLE IF NOT EXISTS job_sheets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id INT,
  technician_id INT,
  product_type VARCHAR(100),
  brand VARCHAR(100),
  model VARCHAR(100),
  problem_description TEXT,
  estimated_cost DECIMAL(10, 2),
  actual_cost DECIMAL(10, 2),
  status ENUM('pending', 'in_progress', 'completed', 'delivered') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (technician_id) REFERENCES technicians(id)
);

-- Insert sample data
INSERT IGNORE INTO product_types (name, display_name) VALUES 
('ac', 'Air Conditioner'),
('washing_machine', 'Washing Machine'),
('refrigerator', 'Refrigerator'),
('microwave', 'Microwave'),
('tv', 'Television');

INSERT IGNORE INTO technicians (employee_id, name, phone, specialization) VALUES
('EMP001', 'Ravi Kumar', '9876543210', 'AC & Refrigeration'),
('EMP002', 'Suresh Reddy', '9876543211', 'Electronics & TV'),
('EMP003', 'Prakash Singh', '9876543212', 'Washing Machine');
```

## Step 3: Verify Tables Created

Check that all tables exist:

```sql
SHOW TABLES;
```

You should see:
- brands
- customers  
- job_sheets
- models
- product_types
- technicians
- users

## Step 4: Check Sample Data

```sql
SELECT * FROM technicians;
SELECT * FROM product_types;
```

This should show the sample technicians and product types.

## Step 5: Create .env File

Create `.env` file in your desktop app installation folder:

```env
DATABASE_URL=mysql://root:@localhost:3306/shivakeshava_electronics
NODE_ENV=production
PORT=5000
```

## Step 6: Restart Desktop App

Close and restart your SHIVAKESHAVA ELECTRONICS desktop application.

The connection error should be resolved and you should see the dashboard loading with sample data!