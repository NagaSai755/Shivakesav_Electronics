-- fixflow_db Database Schema Export
-- Generated on: 2025-08-29
-- This file contains the complete database schema for the service management system

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'admin'
);

-- Customers table
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    alternate_phone VARCHAR(20),
    address TEXT NOT NULL,
    city VARCHAR(100),
    state VARCHAR(100),
    pin_code VARCHAR(10),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Technicians table
CREATE TABLE technicians (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'technician',
    joining_date TIMESTAMP NOT NULL,
    base_salary NUMERIC(10, 2),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Product categories and models
CREATE TABLE product_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(255) NOT NULL
);

CREATE TABLE brands (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    display_name VARCHAR(255) NOT NULL
);

CREATE TABLE models (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    brand_id INTEGER REFERENCES brands(id)
);

-- Job sheets table
CREATE TABLE job_sheets (
    id SERIAL PRIMARY KEY,
    job_id VARCHAR(50) NOT NULL UNIQUE,
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
    problem_reported TEXT,
    technician_id INTEGER REFERENCES technicians(id),
    estimated_amount NUMERIC(10, 2),
    status VARCHAR(20) DEFAULT 'pending',
    priority VARCHAR(10) DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Inventory table
CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    part_number VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    quantity INTEGER NOT NULL DEFAULT 0,
    unit_price NUMERIC(10, 2) NOT NULL,
    supplier VARCHAR(255),
    minimum_stock INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    job_sheet_id INTEGER REFERENCES job_sheets(id),
    amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(20) NOT NULL,
    payment_date TIMESTAMP DEFAULT NOW(),
    reference_number VARCHAR(100),
    notes TEXT
);

-- Invoices table
CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    job_sheet_id INTEGER REFERENCES job_sheets(id),
    customer_id INTEGER REFERENCES customers(id),
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_address TEXT NOT NULL,
    city VARCHAR(100),
    state VARCHAR(100),
    pin_code VARCHAR(10),
    product_type VARCHAR(100),
    brand VARCHAR(100),
    model_number VARCHAR(100),
    serial_number VARCHAR(100),
    service_charge NUMERIC(10, 2) DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_terms VARCHAR(20) DEFAULT 'CASH',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Invoice parts table
CREATE TABLE invoice_parts (
    id SERIAL PRIMARY KEY,
    invoice_id INTEGER REFERENCES invoices(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL
);

-- D-Invoices table
CREATE TABLE d_invoices (
    id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    job_sheet_id INTEGER REFERENCES job_sheets(id),
    customer_id INTEGER REFERENCES customers(id),
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_address TEXT NOT NULL,
    city VARCHAR(100),
    state VARCHAR(100),
    pin_code VARCHAR(10),
    product_type VARCHAR(100),
    brand VARCHAR(100),
    model_number VARCHAR(100),
    serial_number VARCHAR(100),
    service_charge NUMERIC(10, 2) DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_terms VARCHAR(20) DEFAULT 'CASH',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- D-Invoice parts table
CREATE TABLE d_invoice_parts (
    id SERIAL PRIMARY KEY,
    d_invoice_id INTEGER REFERENCES d_invoices(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL
);

-- Quotations table
CREATE TABLE quotations (
    id SERIAL PRIMARY KEY,
    quotation_number VARCHAR(50) NOT NULL UNIQUE,
    job_sheet_id INTEGER REFERENCES job_sheets(id),
    customer_id INTEGER REFERENCES customers(id),
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
    service_charge NUMERIC(10, 2) DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_terms VARCHAR(20) DEFAULT 'CASH',
    validity_days INTEGER DEFAULT 10,
    status VARCHAR(20) DEFAULT 'pending',
    remarks TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Quotation parts table
CREATE TABLE quotation_parts (
    id SERIAL PRIMARY KEY,
    quotation_id INTEGER REFERENCES quotations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL
);

-- Sessions table (for user authentication)
CREATE TABLE session (
    sid VARCHAR NOT NULL PRIMARY KEY,
    sess JSON NOT NULL,
    expire TIMESTAMP(6) NOT NULL
);

-- Indexes for better performance
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_technicians_employee_id ON technicians(employee_id);
CREATE INDEX idx_job_sheets_job_id ON job_sheets(job_id);
CREATE INDEX idx_job_sheets_status ON job_sheets(status);
CREATE INDEX idx_job_sheets_customer_id ON job_sheets(customer_id);
CREATE INDEX idx_job_sheets_technician_id ON job_sheets(technician_id);
CREATE INDEX idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX idx_d_invoices_invoice_number ON d_invoices(invoice_number);
CREATE INDEX idx_quotations_quotation_number ON quotations(quotation_number);
CREATE INDEX idx_quotations_status ON quotations(status);
CREATE INDEX idx_session_expire ON session(expire);