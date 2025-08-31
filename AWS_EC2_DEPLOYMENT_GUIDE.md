# AWS EC2 Deployment Guide - SHIVAKESHAVA ELECTRONICS

## Overview
Deploy your SHIVAKESHAVA ELECTRONICS Service Management System to AWS EC2 for production use.

## Prerequisites
- AWS EC2 instance (Ubuntu 20.04+ or Amazon Linux 2)
- Domain name (optional but recommended)
- SSH access to your EC2 instance

## Step 1: EC2 Instance Setup

### Launch EC2 Instance
1. **Instance Type**: t3.medium or larger (2 vCPUs, 4GB RAM minimum)
2. **AMI**: Ubuntu Server 22.04 LTS
3. **Security Group Rules**:
   - SSH (22) - Your IP only
   - HTTP (80) - 0.0.0.0/0
   - HTTPS (443) - 0.0.0.0/0
   - Custom TCP (5000) - 0.0.0.0/0 (for testing)

### Connect to Instance
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

## Step 2: Server Environment Setup

### Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### Install Node.js 20
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Install MySQL
```bash
sudo apt install mysql-server -y
sudo systemctl start mysql
sudo systemctl enable mysql
sudo mysql_secure_installation
```

### Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

### Install Nginx (Reverse Proxy)
```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

## Step 3: Database Setup

### Configure MySQL
```bash
sudo mysql -u root -p
```

Run these MySQL commands:
```sql
CREATE DATABASE shivakeshava_electronics CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'shivakeshava'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON shivakeshava_electronics.* TO 'shivakeshava'@'localhost';
FLUSH PRIVILEGES;
USE shivakeshava_electronics;

-- Create all tables
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin'
);

CREATE TABLE customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  alternate_phone VARCHAR(20),
  address TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

CREATE TABLE product_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  display_name VARCHAR(255) NOT NULL
);

CREATE TABLE brands (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  product_type_id INT,
  FOREIGN KEY (product_type_id) REFERENCES product_types(id)
);

CREATE TABLE models (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  brand_id INT,
  FOREIGN KEY (brand_id) REFERENCES brands(id)
);

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

EXIT;
```

## Step 4: Application Deployment

### Upload Application Code
```bash
# Create application directory
sudo mkdir -p /var/www/shivakeshava
sudo chown ubuntu:ubuntu /var/www/shivakeshava
cd /var/www/shivakeshava

# Upload your code (use scp, git, or other method)
# Example with scp from your local machine:
# scp -i your-key.pem -r ./your-project/* ubuntu@your-ec2-ip:/var/www/shivakeshava/
```

### Install Dependencies
```bash
cd /var/www/shivakeshava
npm install --production
```

### Create Production Environment File
```bash
nano .env
```

Add this content:
```env
DATABASE_URL=mysql://shivakeshava:your_secure_password@localhost:3306/shivakeshava_electronics
NODE_ENV=production
PORT=5000
```

### Build Application
```bash
npm run build
```

## Step 5: Process Management with PM2

### Create PM2 Ecosystem File
```bash
nano ecosystem.config.js
```

Add this content:
```javascript
module.exports = {
  apps: [{
    name: 'shivakeshava-electronics',
    script: 'dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: 'logs/err.log',
    out_file: 'logs/out.log',
    log_file: 'logs/combined.log',
    time: true
  }]
};
```

### Start Application with PM2
```bash
mkdir logs
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Step 6: Nginx Reverse Proxy Configuration

### Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/shivakeshava
```

Add this content:
```nginx
server {
    listen 80;
    server_name your-domain.com your-ec2-ip;

    client_max_body_size 100M;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/shivakeshava /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 7: SSL Certificate (Optional but Recommended)

### Install Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
```

### Generate SSL Certificate
```bash
sudo certbot --nginx -d your-domain.com
```

## Step 8: Firewall Configuration

### Configure UFW
```bash
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## Step 9: Monitoring and Maintenance

### Check Application Status
```bash
pm2 status
pm2 logs shivakeshava-electronics
```

### Monitor System Resources
```bash
htop
df -h
free -h
```

### Database Backup Script
Create `/home/ubuntu/backup-db.sh`:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u shivakeshava -p shivakeshava_electronics > "/home/ubuntu/backups/shivakeshava_${DATE}.sql"
```

### Setup Automatic Backups
```bash
mkdir -p /home/ubuntu/backups
chmod +x /home/ubuntu/backup-db.sh
crontab -e
# Add: 0 2 * * * /home/ubuntu/backup-db.sh
```

## Step 10: Application URLs

After deployment, your application will be available at:
- **HTTP**: `http://your-ec2-ip` or `http://your-domain.com`
- **HTTPS**: `https://your-domain.com` (if SSL configured)

## Troubleshooting

### Check Application Logs
```bash
pm2 logs shivakeshava-electronics
```

### Check Nginx Logs
```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Restart Services
```bash
pm2 restart shivakeshava-electronics
sudo systemctl restart nginx
sudo systemctl restart mysql
```

### Database Connection Issues
```bash
mysql -u shivakeshava -p -h localhost shivakeshava_electronics
```

## Security Recommendations

1. **Change default MySQL root password**
2. **Use strong password for database user**
3. **Keep system updated**: `sudo apt update && sudo apt upgrade`
4. **Configure fail2ban**: `sudo apt install fail2ban`
5. **Regular backups of database and application**
6. **Monitor logs regularly**

Your SHIVAKESHAVA ELECTRONICS application will be fully deployed and accessible to users worldwide!