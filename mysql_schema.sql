-- MySQL database schema for FixFlow
-- Converted from PostgreSQL format and aligned with Drizzle schema

SET foreign_key_checks = 0;

-- Drop tables if they exist (in reverse dependency order)
DROP TABLE IF EXISTS d_invoice_parts;
DROP TABLE IF EXISTS invoice_parts;
DROP TABLE IF EXISTS quotation_parts;
DROP TABLE IF EXISTS d_invoices;
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS quotations;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS job_sheets;
DROP TABLE IF EXISTS models;
DROP TABLE IF EXISTS brands;
DROP TABLE IF EXISTS product_types;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS technicians;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS users;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
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
    city VARCHAR(100),
    state VARCHAR(100),
    pin_code VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Technicians table
CREATE TABLE technicians (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'technician',
    joining_date TIMESTAMP NOT NULL,
    base_salary DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product types table
CREATE TABLE product_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(255) NOT NULL
);

-- Brands table (updated to match Drizzle schema)
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

-- Inventory table
CREATE TABLE inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    min_quantity INT NOT NULL DEFAULT 5,
    unit_price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Job sheets table (updated with missing fields)
CREATE TABLE job_sheets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id VARCHAR(50) NOT NULL UNIQUE,
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
    agent_id INT,
    customer_complaint TEXT NOT NULL,
    reported_issue TEXT,
    agent_remarks TEXT,
    accessories_received TEXT,
    estimated_amount DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'pending',
    priority VARCHAR(20) DEFAULT 'medium',
    job_start_date_time TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (product_type_id) REFERENCES product_types(id),
    FOREIGN KEY (brand_id) REFERENCES brands(id),
    FOREIGN KEY (model_id) REFERENCES models(id),
    FOREIGN KEY (technician_id) REFERENCES technicians(id),
    FOREIGN KEY (agent_id) REFERENCES users(id)
);

-- Payments table
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_sheet_id INT,
    client_amount DECIMAL(10,2) NOT NULL,
    internal_amount DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0,
    advance_paid DECIMAL(10,2) DEFAULT 0,
    balance DECIMAL(10,2) NOT NULL,
    payment_mode VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_sheet_id) REFERENCES job_sheets(id)
);

-- Invoices table (updated to match Drizzle schema)
CREATE TABLE invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    job_sheet_id INT NOT NULL,
    invoice_type VARCHAR(20) NOT NULL,
    service_charge DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0,
    subtotal DECIMAL(10,2) NOT NULL,
    gst_rate DECIMAL(5,2) DEFAULT 18,
    gst_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'cash',
    model_number VARCHAR(100),
    serial_number VARCHAR(100),
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_address TEXT NOT NULL,
    remarks TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_sheet_id) REFERENCES job_sheets(id)
);

-- Invoice parts table
CREATE TABLE invoice_parts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT NOT NULL,
    part_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id)
);

-- D-Invoices table (updated to match Drizzle schema)
CREATE TABLE d_invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    job_sheet_id INT NOT NULL,
    invoice_type VARCHAR(20) NOT NULL,
    service_charge DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0,
    subtotal DECIMAL(10,2) NOT NULL,
    gst_rate DECIMAL(5,2) DEFAULT 18,
    gst_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'cash',
    model_number VARCHAR(100),
    serial_number VARCHAR(100),
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_address TEXT NOT NULL,
    remarks TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_sheet_id) REFERENCES job_sheets(id)
);

-- D-Invoice parts table
CREATE TABLE d_invoice_parts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT NOT NULL,
    part_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (invoice_id) REFERENCES d_invoices(id)
);

-- Quotations table
CREATE TABLE quotations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quotation_number VARCHAR(50) NOT NULL UNIQUE,
    job_sheet_id INT,
    customer_id INT,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_address TEXT NOT NULL,
    city VARCHAR(100),
    state VARCHAR(100),
    pin_code VARCHAR(10),
    product_type VARCHAR(100),
    brand VARCHAR(100),
    model VARCHAR(100),
    model_number VARCHAR(100),
    serial_number VARCHAR(100),
    service_charge DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_terms VARCHAR(100) DEFAULT 'CASH',
    validity_days INT DEFAULT 10,
    status VARCHAR(20) DEFAULT 'pending',
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (job_sheet_id) REFERENCES job_sheets(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Quotation parts table
CREATE TABLE quotation_parts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quotation_id INT,
    name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (quotation_id) REFERENCES quotations(id)
);

SET foreign_key_checks = 1;
