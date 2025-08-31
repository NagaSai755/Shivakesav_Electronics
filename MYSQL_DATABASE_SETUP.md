# MySQL Database Setup Instructions

## Prerequisites
- MySQL Workbench installed (already confirmed)
- MySQL Server running locally or accessible remotely

## Step 1: Create Database

1. Open **MySQL Workbench**
2. Connect to your MySQL server
3. Create a new database:
   ```sql
   CREATE DATABASE fixflow_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

## Step 2: Import Schema

1. In MySQL Workbench, select your `fixflow_db` database
2. Go to **Server** → **Data Import**
3. Select **Import from Self-Contained File**
4. Browse and select: `mysql_schema.sql`
5. Under **Default Target Schema**, select `fixflow_db`
6. Click **Start Import**

**Alternative Method (SQL Script):**
1. Open the `mysql_schema.sql` file in MySQL Workbench
2. Ensure `fixflow_db` is selected as active schema
3. Execute the entire script (Ctrl+Shift+Enter)

## Step 3: Verify Tables Created

Run this query to verify all tables were created:
```sql
USE fixflow_db;
SHOW TABLES;
```

You should see 14 tables:
- brands
- customers  
- d_invoice_parts
- d_invoices
- inventory
- invoice_parts
- invoices
- job_sheets
- models
- payments
- product_types
- quotation_parts
- quotations
- technicians
- users

## Step 4: Update Environment Configuration

1. Create or update your `.env` file with the MySQL connection string:
   ```
   DATABASE_URL=mysql://username:password@localhost:3306/fixflow_db
   ```

2. Replace `username` and `password` with your MySQL credentials

## Step 5: Test Connection

Run your application to test the database connection:
```bash
npm run dev
```

Check the console for "MySQL connection successful" message.

## Troubleshooting

### Connection Issues
- Verify MySQL server is running
- Check username/password in DATABASE_URL
- Ensure the database `fixflow_db` exists
- Check firewall settings if using remote MySQL

### Schema Issues
- If tables already exist, the script will drop and recreate them
- Ensure you have proper permissions to create/drop tables
- Check for any foreign key constraint errors

### Character Set Issues
- The database uses `utf8mb4` for full Unicode support
- Ensure your MySQL server supports this character set

## Security Notes
- Never commit your `.env` file with real credentials
- Use strong passwords for MySQL users
- Consider creating a dedicated MySQL user for this application
- Limit database permissions to only what's needed

## Next Steps
After successful setup:
1. Your application should connect to MySQL successfully
2. You can start using the FixFlow application
3. The schema is now compatible with your Drizzle ORM definitions
