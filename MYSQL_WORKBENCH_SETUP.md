# MySQL Workbench Setup - Complete Database Solution

## The Real Problem

Your desktop app is still trying to use PostgreSQL code with MySQL database. That's why you're getting the `specialization` column error - the code expects PostgreSQL but you have MySQL.

## Complete Solution

### Step 1: Create MySQL Database Properly

Open **MySQL Workbench** or **phpMyAdmin** and run this complete script:

```sql
-- Create and use database
DROP DATABASE IF EXISTS shivakeshava_electronics;
CREATE DATABASE shivakeshava_electronics CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE shivakeshava_electronics;

-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

-- Technicians table (matching the schema exactly)
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

-- Insert sample product types
INSERT INTO product_types (name, display_name) VALUES 
('ac', 'Air Conditioner'),
('washing_machine', 'Washing Machine'),
('refrigerator', 'Refrigerator'),
('microwave', 'Microwave'),
('tv', 'Television'),
('water_heater', 'Water Heater'),
('cooler', 'Air Cooler'),
('iron', 'Iron'),
('mixer', 'Mixer Grinder'),
('other', 'Other Appliances');

-- Insert sample technicians
INSERT INTO technicians (employee_id, name, phone, role, joining_date, base_salary, status) VALUES
('EMP001', 'Ravi Kumar', '9876543210', 'technician', '2024-01-01', 15000.00, 'active'),
('EMP002', 'Suresh Reddy', '9876543211', 'technician', '2024-01-15', 14000.00, 'active'),
('EMP003', 'Prakash Singh', '9876543212', 'technician', '2024-02-01', 13000.00, 'active'),
('EMP004', 'Vijay Sharma', '9876543213', 'technician', '2024-02-15', 12000.00, 'active');

-- Insert sample brands for each product type
INSERT INTO brands (name, display_name, product_type_id) VALUES
('lg', 'LG', 1), ('samsung', 'Samsung', 1), ('voltas', 'Voltas', 1),
('whirlpool', 'Whirlpool', 2), ('ifb', 'IFB', 2), ('bosch', 'Bosch', 2),
('haier', 'Haier', 3), ('godrej', 'Godrej', 3), ('blue_star', 'Blue Star', 3);

-- Insert sample admin user
INSERT INTO users (username, password, name, role) VALUES
('admin', '$2b$10$example_hash_here', 'Administrator', 'admin');

-- Verify data
SELECT 'Product Types:' as Info;
SELECT * FROM product_types;

SELECT 'Technicians:' as Info;
SELECT * FROM technicians;

SELECT 'Tables Created:' as Info;
SHOW TABLES;
```

### Step 2: Update .env File

Create/update `.env` file in your desktop app installation directory:

```env
DATABASE_URL=mysql://root:@localhost:3306/shivakeshava_electronics
NODE_ENV=production
PORT=5000
```

### Step 3: Restart Desktop App

1. Close SHIVAKESHAVA ELECTRONICS desktop app completely
2. Start MySQL service in XAMPP/WAMP
3. Launch desktop app from Start Menu

## What Should Happen

✅ Loading screen appears  
✅ "SHIVAKESHAVA ELECTRONICS - Starting..." message  
✅ Server connects to MySQL database  
✅ Dashboard loads with sample data:
- **Product Types**: 10 types (AC, Washing Machine, etc.)
- **Technicians**: 4 technicians (Ravi, Suresh, Prakash, Vijay)
- **Active Jobs**: 0 (ready for new job sheets)

## Test Database Connection

Run this in MySQL Workbench to verify:

```sql
USE shivakeshava_electronics;
SELECT COUNT(*) as total_tables FROM information_schema.tables WHERE table_schema = 'shivakeshava_electronics';
SELECT COUNT(*) as product_types FROM product_types;
SELECT COUNT(*) as technicians FROM technicians;
```

Should show:
- **total_tables**: 7
- **product_types**: 10  
- **technicians**: 4

The database is now properly structured to match your application's needs!