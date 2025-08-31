var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  brands: () => brands,
  brandsRelations: () => brandsRelations,
  customers: () => customers,
  customersRelations: () => customersRelations,
  insertBrandSchema: () => insertBrandSchema,
  insertCustomerSchema: () => insertCustomerSchema,
  insertInventorySchema: () => insertInventorySchema,
  insertInvoicePartSchema: () => insertInvoicePartSchema,
  insertInvoiceSchema: () => insertInvoiceSchema,
  insertJobSheetSchema: () => insertJobSheetSchema,
  insertModelSchema: () => insertModelSchema,
  insertPaymentSchema: () => insertPaymentSchema,
  insertProductTypeSchema: () => insertProductTypeSchema,
  insertTechnicianSchema: () => insertTechnicianSchema,
  insertUserSchema: () => insertUserSchema,
  inventory: () => inventory,
  invoiceParts: () => invoiceParts,
  invoicePartsRelations: () => invoicePartsRelations,
  invoices: () => invoices,
  invoicesRelations: () => invoicesRelations,
  jobSheets: () => jobSheets,
  jobSheetsRelations: () => jobSheetsRelations,
  models: () => models,
  modelsRelations: () => modelsRelations,
  payments: () => payments,
  paymentsRelations: () => paymentsRelations,
  productTypes: () => productTypes,
  productTypesRelations: () => productTypesRelations,
  technicians: () => technicians,
  techniciansRelations: () => techniciansRelations,
  users: () => users,
  usersRelations: () => usersRelations
});
import { pgTable, text, varchar, integer, timestamp, numeric, serial } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("admin")
});
var customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  alternatePhone: varchar("alternate_phone", { length: 20 }),
  address: text("address").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var technicians = pgTable("technicians", {
  id: serial("id").primaryKey(),
  employeeId: varchar("employee_id", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("technician"),
  joiningDate: timestamp("joining_date").notNull(),
  baseSalary: numeric("base_salary", { precision: 10, scale: 2 }),
  status: varchar("status", { length: 20 }).default("active"),
  createdAt: timestamp("created_at").defaultNow()
});
var productTypes = pgTable("product_types", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  displayName: varchar("display_name", { length: 255 }).notNull()
});
var brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  displayName: varchar("display_name", { length: 255 }).notNull(),
  productTypeId: integer("product_type_id").references(() => productTypes.id)
});
var models = pgTable("models", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  displayName: varchar("display_name", { length: 255 }).notNull(),
  brandId: integer("brand_id").references(() => brands.id)
});
var jobSheets = pgTable("job_sheets", {
  id: serial("id").primaryKey(),
  jobId: varchar("job_id", { length: 50 }).notNull().unique(),
  customerId: integer("customer_id").references(() => customers.id),
  productTypeId: integer("product_type_id").references(() => productTypes.id),
  brandId: integer("brand_id").references(() => brands.id),
  modelId: integer("model_id").references(() => models.id),
  modelNumber: varchar("model_number", { length: 100 }),
  serialNumber: varchar("serial_number", { length: 100 }),
  purchaseDate: timestamp("purchase_date"),
  warrantyStatus: varchar("warranty_status", { length: 20 }).default("out_warranty"),
  jobType: varchar("job_type", { length: 20 }).notNull(),
  jobClassification: varchar("job_classification", { length: 30 }).notNull(),
  jobMode: varchar("job_mode", { length: 20 }).default("indoor"),
  technicianId: integer("technician_id").references(() => technicians.id),
  agentId: integer("agent_id").references(() => users.id),
  customerComplaint: text("customer_complaint").notNull(),
  reportedIssue: text("reported_issue"),
  agentRemarks: text("agent_remarks"),
  jobStartDateTime: timestamp("job_start_date_time"),
  status: varchar("status", { length: 20 }).default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  // 'accessories', 'spares', 'devices'
  quantity: integer("quantity").notNull().default(0),
  minQuantity: integer("min_quantity").notNull().default(5),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow()
});
var payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  jobSheetId: integer("job_sheet_id").references(() => jobSheets.id),
  clientAmount: numeric("client_amount", { precision: 10, scale: 2 }).notNull(),
  internalAmount: numeric("internal_amount", { precision: 10, scale: 2 }).notNull(),
  discount: numeric("discount", { precision: 10, scale: 2 }).default("0"),
  advancePaid: numeric("advance_paid", { precision: 10, scale: 2 }).default("0"),
  balance: numeric("balance", { precision: 10, scale: 2 }).notNull(),
  paymentMode: varchar("payment_mode", { length: 50 }),
  status: varchar("status", { length: 20 }).default("pending"),
  createdAt: timestamp("created_at").defaultNow()
});
var invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  invoiceNumber: varchar("invoice_number", { length: 50 }).notNull().unique(),
  jobSheetId: integer("job_sheet_id").notNull().references(() => jobSheets.id),
  invoiceType: varchar("invoice_type", { length: 20 }).notNull(),
  serviceCharge: numeric("service_charge", { precision: 10, scale: 2 }).notNull(),
  discount: numeric("discount", { precision: 10, scale: 2 }).default("0"),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  gstRate: numeric("gst_rate", { precision: 5, scale: 2 }).default("18"),
  gstAmount: numeric("gst_amount", { precision: 10, scale: 2 }).default("0"),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }).default("cash"),
  modelNumber: varchar("model_number", { length: 100 }),
  serialNumber: varchar("serial_number", { length: 100 }),
  brand: varchar("brand", { length: 100 }),
  gstin: varchar("gstin", { length: 20 }),
  workDone: text("work_done"),
  remarks: text("remarks"),
  invoiceDate: timestamp("invoice_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow()
});
var invoiceParts = pgTable("invoice_parts", {
  id: serial("id").primaryKey(),
  invoiceId: integer("invoice_id").notNull().references(() => invoices.id),
  partName: varchar("part_name", { length: 255 }).notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull()
});
var customersRelations = relations(customers, ({ many }) => ({
  jobSheets: many(jobSheets)
}));
var techniciansRelations = relations(technicians, ({ many }) => ({
  jobSheets: many(jobSheets)
}));
var usersRelations = relations(users, ({ many }) => ({
  jobSheets: many(jobSheets)
}));
var productTypesRelations = relations(productTypes, ({ many }) => ({
  brands: many(brands),
  jobSheets: many(jobSheets)
}));
var brandsRelations = relations(brands, ({ one, many }) => ({
  productType: one(productTypes, {
    fields: [brands.productTypeId],
    references: [productTypes.id]
  }),
  models: many(models),
  jobSheets: many(jobSheets)
}));
var modelsRelations = relations(models, ({ one, many }) => ({
  brand: one(brands, {
    fields: [models.brandId],
    references: [brands.id]
  }),
  jobSheets: many(jobSheets)
}));
var jobSheetsRelations = relations(jobSheets, ({ one, many }) => ({
  customer: one(customers, {
    fields: [jobSheets.customerId],
    references: [customers.id]
  }),
  productType: one(productTypes, {
    fields: [jobSheets.productTypeId],
    references: [productTypes.id]
  }),
  brand: one(brands, {
    fields: [jobSheets.brandId],
    references: [brands.id]
  }),
  model: one(models, {
    fields: [jobSheets.modelId],
    references: [models.id]
  }),
  technician: one(technicians, {
    fields: [jobSheets.technicianId],
    references: [technicians.id]
  }),
  agent: one(users, {
    fields: [jobSheets.agentId],
    references: [users.id]
  }),
  payments: many(payments),
  invoices: many(invoices)
}));
var paymentsRelations = relations(payments, ({ one }) => ({
  jobSheet: one(jobSheets, {
    fields: [payments.jobSheetId],
    references: [jobSheets.id]
  })
}));
var invoicesRelations = relations(invoices, ({ one, many }) => ({
  jobSheet: one(jobSheets, {
    fields: [invoices.jobSheetId],
    references: [jobSheets.id]
  }),
  invoiceParts: many(invoiceParts)
}));
var invoicePartsRelations = relations(invoiceParts, ({ one }) => ({
  invoice: one(invoices, {
    fields: [invoiceParts.invoiceId],
    references: [invoices.id]
  })
}));
var insertUserSchema = createInsertSchema(users).omit({ id: true });
var insertCustomerSchema = createInsertSchema(customers).omit({ id: true, createdAt: true });
var insertTechnicianSchema = createInsertSchema(technicians).omit({ id: true, createdAt: true });
var insertProductTypeSchema = createInsertSchema(productTypes).omit({ id: true });
var insertBrandSchema = createInsertSchema(brands).omit({ id: true });
var insertModelSchema = createInsertSchema(models).omit({ id: true });
var insertJobSheetSchema = createInsertSchema(jobSheets).omit({ id: true, createdAt: true, updatedAt: true });
var insertInventorySchema = createInsertSchema(inventory).omit({ id: true, createdAt: true });
var insertPaymentSchema = createInsertSchema(payments).omit({ id: true, createdAt: true });
var insertInvoiceSchema = createInsertSchema(invoices).omit({ id: true, createdAt: true, invoiceNumber: true });
var insertInvoicePartSchema = createInsertSchema(invoiceParts).omit({ id: true });

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, desc, count, sum, and, gte, lte, sql } from "drizzle-orm";
var DatabaseStorage = class {
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, parseInt(id)));
    return user || void 0;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || void 0;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  async getCustomers() {
    return await db.select().from(customers).orderBy(desc(customers.createdAt));
  }
  async getCustomer(id) {
    const [customer] = await db.select().from(customers).where(eq(customers.id, parseInt(id)));
    return customer || void 0;
  }
  async createCustomer(customer) {
    const [newCustomer] = await db.insert(customers).values(customer).returning();
    return newCustomer;
  }
  async updateCustomer(id, customer) {
    const [updatedCustomer] = await db.update(customers).set(customer).where(eq(customers.id, parseInt(id))).returning();
    return updatedCustomer;
  }
  async getTechnicians() {
    return await db.select().from(technicians).orderBy(desc(technicians.createdAt));
  }
  async getTechnician(id) {
    const [technician] = await db.select().from(technicians).where(eq(technicians.id, parseInt(id)));
    return technician || void 0;
  }
  async createTechnician(technician) {
    const [newTechnician] = await db.insert(technicians).values(technician).returning();
    return newTechnician;
  }
  async updateTechnician(id, technician) {
    const [updatedTechnician] = await db.update(technicians).set(technician).where(eq(technicians.id, parseInt(id))).returning();
    return updatedTechnician;
  }
  async getProductTypes() {
    return await db.select().from(productTypes);
  }
  async getBrands() {
    return await db.select({
      id: sql`MIN(${brands.id})`,
      name: sql`MIN(${brands.name})`,
      displayName: brands.displayName,
      productTypeId: sql`MIN(${brands.productTypeId})`
    }).from(brands).groupBy(brands.displayName).orderBy(brands.displayName);
  }
  async getBrandsByProductType(productTypeId) {
    return await db.select().from(brands).where(eq(brands.productTypeId, parseInt(productTypeId)));
  }
  async getModelsByBrand(brandId) {
    return await db.select().from(models).where(eq(models.brandId, parseInt(brandId)));
  }
  async createProductType(productType) {
    const [newProductType] = await db.insert(productTypes).values(productType).returning();
    return newProductType;
  }
  async createBrand(brand) {
    const [newBrand] = await db.insert(brands).values(brand).returning();
    return newBrand;
  }
  async createModel(model) {
    const [newModel] = await db.insert(models).values(model).returning();
    return newModel;
  }
  async getJobSheets() {
    return await db.select({
      id: jobSheets.id,
      jobId: jobSheets.jobId,
      status: jobSheets.status,
      jobType: jobSheets.jobType,
      jobClassification: jobSheets.jobClassification,
      customerComplaint: jobSheets.customerComplaint,
      createdAt: jobSheets.createdAt,
      customer: {
        id: customers.id,
        name: customers.name,
        phone: customers.phone
      },
      technician: {
        id: technicians.id,
        name: technicians.name
      },
      productType: {
        id: productTypes.id,
        displayName: productTypes.displayName
      },
      brand: {
        id: brands.id,
        displayName: brands.displayName
      }
    }).from(jobSheets).leftJoin(customers, eq(jobSheets.customerId, customers.id)).leftJoin(technicians, eq(jobSheets.technicianId, technicians.id)).leftJoin(productTypes, eq(jobSheets.productTypeId, productTypes.id)).leftJoin(brands, eq(jobSheets.brandId, brands.id)).orderBy(desc(jobSheets.createdAt));
  }
  async getJobSheet(id) {
    const [jobSheet] = await db.select({
      id: jobSheets.id,
      jobId: jobSheets.jobId,
      status: jobSheets.status,
      jobType: jobSheets.jobType,
      jobClassification: jobSheets.jobClassification,
      jobMode: jobSheets.jobMode,
      warrantyStatus: jobSheets.warrantyStatus,
      modelNumber: jobSheets.modelNumber,
      serialNumber: jobSheets.serialNumber,
      purchaseDate: jobSheets.purchaseDate,
      customerComplaint: jobSheets.customerComplaint,
      reportedIssue: jobSheets.reportedIssue,
      agentRemarks: jobSheets.agentRemarks,
      jobStartDateTime: jobSheets.jobStartDateTime,
      createdAt: jobSheets.createdAt,
      customer: customers,
      technician: technicians,
      productType: productTypes,
      brand: brands,
      model: models,
      agent: {
        id: users.id,
        name: users.name
      }
    }).from(jobSheets).leftJoin(customers, eq(jobSheets.customerId, customers.id)).leftJoin(technicians, eq(jobSheets.technicianId, technicians.id)).leftJoin(productTypes, eq(jobSheets.productTypeId, productTypes.id)).leftJoin(brands, eq(jobSheets.brandId, brands.id)).leftJoin(models, eq(jobSheets.modelId, models.id)).leftJoin(users, eq(jobSheets.agentId, users.id)).where(eq(jobSheets.id, parseInt(id)));
    return jobSheet || void 0;
  }
  async createJobSheet(jobSheet) {
    const [newJobSheet] = await db.insert(jobSheets).values(jobSheet).returning();
    return newJobSheet;
  }
  async updateJobSheet(id, jobSheet) {
    const [updatedJobSheet] = await db.update(jobSheets).set({ ...jobSheet, updatedAt: /* @__PURE__ */ new Date() }).where(eq(jobSheets.id, parseInt(id))).returning();
    return updatedJobSheet;
  }
  async generateJobId() {
    const year = (/* @__PURE__ */ new Date()).getFullYear();
    const [result] = await db.select({ count: count() }).from(jobSheets).where(sql`EXTRACT(YEAR FROM created_at) = ${year}`);
    const nextNumber = (result?.count || 0) + 1;
    return `JS-${year}-${nextNumber.toString().padStart(3, "0")}`;
  }
  async getInventoryItems() {
    return await db.select().from(inventory).orderBy(inventory.name);
  }
  async getInventoryItem(id) {
    const [item] = await db.select().from(inventory).where(eq(inventory.id, parseInt(id)));
    return item || void 0;
  }
  async createInventoryItem(item) {
    const [newItem] = await db.insert(inventory).values(item).returning();
    return newItem;
  }
  async updateInventoryItem(id, item) {
    const [updatedItem] = await db.update(inventory).set(item).where(eq(inventory.id, parseInt(id))).returning();
    return updatedItem;
  }
  async getPayments() {
    return await db.select().from(payments).orderBy(desc(payments.createdAt));
  }
  async getPaymentsByJobSheet(jobSheetId) {
    return await db.select().from(payments).where(eq(payments.jobSheetId, parseInt(jobSheetId)));
  }
  async createPayment(payment) {
    const [newPayment] = await db.insert(payments).values(payment).returning();
    return newPayment;
  }
  async getDashboardMetrics() {
    const today = /* @__PURE__ */ new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const [activeJobs] = await db.select({ count: count() }).from(jobSheets).where(eq(jobSheets.status, "in_progress"));
    const [completedToday] = await db.select({ count: count() }).from(jobSheets).where(
      and(
        eq(jobSheets.status, "completed"),
        gte(jobSheets.updatedAt, startOfDay),
        lte(jobSheets.updatedAt, endOfDay)
      )
    );
    const [pendingJobs] = await db.select({ count: count() }).from(jobSheets).where(eq(jobSheets.status, "pending"));
    const [todayRevenue] = await db.select({ total: sum(payments.internalAmount) }).from(payments).where(
      and(
        gte(payments.createdAt, startOfDay),
        lte(payments.createdAt, endOfDay)
      )
    );
    const [totalCollected] = await db.select({ total: sum(payments.internalAmount) }).from(payments).where(eq(payments.status, "paid"));
    const [totalDue] = await db.select({ total: sum(payments.balance) }).from(payments).where(eq(payments.status, "pending"));
    const [availableStock] = await db.select({ count: count() }).from(inventory).where(sql`quantity > min_quantity`);
    const [lowStock] = await db.select({ count: count() }).from(inventory).where(sql`quantity <= min_quantity AND quantity > 0`);
    const [outOfStock] = await db.select({ count: count() }).from(inventory).where(eq(inventory.quantity, 0));
    return {
      activeJobs: activeJobs?.count || 0,
      completedToday: completedToday?.count || 0,
      pendingJobs: pendingJobs?.count || 0,
      todayRevenue: todayRevenue?.total || 0,
      totalCollected: totalCollected?.total || 0,
      totalDue: totalDue?.total || 0,
      availableStock: availableStock?.count || 0,
      lowStock: lowStock?.count || 0,
      outOfStock: outOfStock?.count || 0
    };
  }
  // Invoice methods
  async getInvoices() {
    return await db.select({
      invoice: invoices,
      jobSheet: jobSheets,
      customer: customers,
      productType: productTypes,
      brand: brands
    }).from(invoices).leftJoin(jobSheets, eq(invoices.jobSheetId, jobSheets.id)).leftJoin(customers, eq(jobSheets.customerId, customers.id)).leftJoin(productTypes, eq(jobSheets.productTypeId, productTypes.id)).leftJoin(brands, eq(jobSheets.brandId, brands.id)).orderBy(desc(invoices.createdAt));
  }
  async getInvoiceById(id) {
    const [invoice] = await db.select({
      invoice: invoices,
      jobSheet: jobSheets,
      customer: customers,
      productType: productTypes,
      brand: brands,
      model: models,
      technician: technicians
    }).from(invoices).leftJoin(jobSheets, eq(invoices.jobSheetId, jobSheets.id)).leftJoin(customers, eq(jobSheets.customerId, customers.id)).leftJoin(productTypes, eq(jobSheets.productTypeId, productTypes.id)).leftJoin(brands, eq(jobSheets.brandId, brands.id)).leftJoin(models, eq(jobSheets.modelId, models.id)).leftJoin(technicians, eq(jobSheets.technicianId, technicians.id)).where(eq(invoices.id, parseInt(id)));
    if (!invoice) return null;
    const parts = await db.select().from(invoiceParts).where(eq(invoiceParts.invoiceId, parseInt(id)));
    return { ...invoice, parts };
  }
  async createInvoice(invoice) {
    const year = (/* @__PURE__ */ new Date()).getFullYear();
    const [result] = await db.select({ count: count() }).from(invoices).where(sql`EXTRACT(YEAR FROM created_at) = ${year}`);
    const nextNumber = (result?.count || 0) + 1;
    const invoiceNumber = `INV-${year}-${nextNumber.toString().padStart(4, "0")}`;
    const [newInvoice] = await db.insert(invoices).values({ ...invoice, invoiceNumber }).returning();
    return newInvoice;
  }
  async updateInvoice(id, invoice) {
    const [updatedInvoice] = await db.update(invoices).set(invoice).where(eq(invoices.id, parseInt(id))).returning();
    return updatedInvoice;
  }
  async deleteInvoice(id) {
    await db.delete(invoiceParts).where(eq(invoiceParts.invoiceId, parseInt(id)));
    await db.delete(invoices).where(eq(invoices.id, parseInt(id)));
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import { z } from "zod";
async function registerRoutes(app2) {
  app2.get("/api/dashboard/metrics", async (req, res) => {
    try {
      const metrics = await storage.getDashboardMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard metrics" });
    }
  });
  app2.get("/api/customers", async (req, res) => {
    try {
      const customers2 = await storage.getCustomers();
      res.json(customers2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customers" });
    }
  });
  app2.get("/api/customers/:id", async (req, res) => {
    try {
      const customer = await storage.getCustomer(req.params.id);
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customer" });
    }
  });
  app2.post("/api/customers", async (req, res) => {
    try {
      const customerData = insertCustomerSchema.parse(req.body);
      const customer = await storage.createCustomer(customerData);
      res.status(201).json(customer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid customer data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create customer" });
    }
  });
  app2.get("/api/technicians", async (req, res) => {
    try {
      const technicians2 = await storage.getTechnicians();
      res.json(technicians2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch technicians" });
    }
  });
  app2.post("/api/technicians", async (req, res) => {
    try {
      const technicianData = insertTechnicianSchema.parse(req.body);
      const technician = await storage.createTechnician(technicianData);
      res.status(201).json(technician);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid technician data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create technician" });
    }
  });
  app2.get("/api/product-types", async (req, res) => {
    try {
      const productTypes2 = await storage.getProductTypes();
      res.json(productTypes2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product types" });
    }
  });
  app2.get("/api/brands", async (req, res) => {
    try {
      const brands2 = await storage.getBrands();
      res.json(brands2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch brands" });
    }
  });
  app2.get("/api/brands/:productTypeId", async (req, res) => {
    try {
      const brands2 = await storage.getBrandsByProductType(req.params.productTypeId);
      res.json(brands2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch brands" });
    }
  });
  app2.get("/api/models/:brandId", async (req, res) => {
    try {
      const models2 = await storage.getModelsByBrand(req.params.brandId);
      res.json(models2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch models" });
    }
  });
  app2.get("/api/job-sheets", async (req, res) => {
    try {
      const jobSheets2 = await storage.getJobSheets();
      res.json(jobSheets2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch job sheets" });
    }
  });
  app2.get("/api/job-sheets/:id", async (req, res) => {
    try {
      const jobSheet = await storage.getJobSheet(req.params.id);
      if (!jobSheet) {
        return res.status(404).json({ error: "Job sheet not found" });
      }
      res.json(jobSheet);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch job sheet" });
    }
  });
  app2.post("/api/job-sheets", async (req, res) => {
    try {
      const jobId = await storage.generateJobId();
      const jobSheetData = insertJobSheetSchema.parse({
        ...req.body,
        jobId
      });
      const jobSheet = await storage.createJobSheet(jobSheetData);
      res.status(201).json(jobSheet);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid job sheet data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create job sheet" });
    }
  });
  app2.patch("/api/job-sheets/:id", async (req, res) => {
    try {
      const jobSheet = await storage.updateJobSheet(req.params.id, req.body);
      res.json(jobSheet);
    } catch (error) {
      res.status(500).json({ error: "Failed to update job sheet" });
    }
  });
  app2.get("/api/inventory", async (req, res) => {
    try {
      const items = await storage.getInventoryItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch inventory items" });
    }
  });
  app2.post("/api/inventory", async (req, res) => {
    try {
      const itemData = insertInventorySchema.parse(req.body);
      const item = await storage.createInventoryItem(itemData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid inventory data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create inventory item" });
    }
  });
  app2.get("/api/payments", async (req, res) => {
    try {
      const payments2 = await storage.getPayments();
      res.json(payments2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch payments" });
    }
  });
  app2.post("/api/payments", async (req, res) => {
    try {
      const paymentData = insertPaymentSchema.parse(req.body);
      const payment = await storage.createPayment(paymentData);
      res.status(201).json(payment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid payment data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create payment" });
    }
  });
  app2.get("/api/invoices", async (req, res) => {
    try {
      const invoices2 = await storage.getInvoices();
      res.json(invoices2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch invoices" });
    }
  });
  app2.get("/api/invoices/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const invoice = await storage.getInvoiceById(id);
      if (!invoice) {
        return res.status(404).json({ error: "Invoice not found" });
      }
      res.json(invoice);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch invoice" });
    }
  });
  app2.post("/api/invoices", async (req, res) => {
    try {
      const invoiceData = insertInvoiceSchema.parse(req.body);
      const invoice = await storage.createInvoice(invoiceData);
      res.status(201).json(invoice);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid invoice data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create invoice" });
    }
  });
  app2.patch("/api/invoices/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = insertInvoiceSchema.partial().parse(req.body);
      const invoice = await storage.updateInvoice(id, updateData);
      if (!invoice) {
        return res.status(404).json({ error: "Invoice not found" });
      }
      res.json(invoice);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid invoice data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update invoice" });
    }
  });
  app2.delete("/api/invoices/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteInvoice(id);
      res.json({ message: "Invoice deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete invoice" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
