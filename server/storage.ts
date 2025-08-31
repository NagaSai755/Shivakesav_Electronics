import { 
  users, customers, technicians, productTypes, brands, models, 
  jobSheets, inventory, payments, invoices, invoiceParts, dInvoices, dInvoiceParts,
  quotations, quotationParts,
  type User, type InsertUser, type Customer, type InsertCustomer,
  type Technician, type InsertTechnician, type ProductType, type InsertProductType,
  type Brand, type InsertBrand, type Model, type InsertModel,
  type JobSheet, type InsertJobSheet, type InventoryItem, type InsertInventoryItem,
  type Payment, type InsertPayment, type Invoice, type InsertInvoice,
  type InvoicePart, type InsertInvoicePart, type DInvoice, type InsertDInvoice,
  type DInvoicePart, type InsertDInvoicePart, type Quotation, type InsertQuotation,
  type QuotationPart, type InsertQuotationPart
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, count, sum, and, gte, lte, sql } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Customers
  getCustomers(): Promise<Customer[]>;
  getCustomer(id: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: string, customer: Partial<InsertCustomer>): Promise<Customer>;
  deleteCustomer(id: string): Promise<void>;

  // Technicians
  getTechnicians(): Promise<Technician[]>;
  getTechnician(id: string): Promise<Technician | undefined>;
  createTechnician(technician: InsertTechnician): Promise<Technician>;
  updateTechnician(id: string, technician: Partial<InsertTechnician>): Promise<Technician>;
  deleteTechnician(id: string): Promise<void>;

  // Product management
  getProductTypes(): Promise<ProductType[]>;
  getBrands(): Promise<Brand[]>;
  getModelsByBrand(brandId: string): Promise<Model[]>;
  createProductType(productType: InsertProductType): Promise<ProductType>;
  createBrand(brand: InsertBrand): Promise<Brand>;
  createModel(model: InsertModel): Promise<Model>;

  // Job sheets
  getJobSheets(): Promise<any[]>;
  getJobSheet(id: string): Promise<any>;
  createJobSheet(jobSheet: InsertJobSheet): Promise<JobSheet>;
  updateJobSheet(id: string, jobSheet: Partial<InsertJobSheet>): Promise<JobSheet>;
  deleteJobSheet(id: string): Promise<void>;
  generateJobId(): Promise<string>;

  // Inventory
  getInventoryItems(): Promise<InventoryItem[]>;
  getInventoryItem(id: string): Promise<InventoryItem | undefined>;
  createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem>;
  updateInventoryItem(id: string, item: Partial<InsertInventoryItem>): Promise<InventoryItem>;

  // Payments
  getPayments(): Promise<Payment[]>;
  getPaymentsByJobSheet(jobSheetId: string): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;

  // Invoices
  getInvoices(): Promise<any[]>;
  getInvoiceById(id: string): Promise<any>;
  createInvoice(invoice: InsertInvoice, parts?: any[]): Promise<Invoice>;
  updateInvoice(id: string, invoice: Partial<InsertInvoice>): Promise<Invoice>;
  deleteInvoice(id: string): Promise<void>;

  // D-Invoices
  getDInvoices(): Promise<any[]>;
  getDInvoiceById(id: string): Promise<any>;
  createDInvoice(dInvoice: InsertDInvoice, parts?: any[]): Promise<DInvoice>;
  updateDInvoice(id: string, dInvoice: Partial<InsertDInvoice>): Promise<DInvoice>;
  deleteDInvoice(id: string): Promise<void>;
  generateDInvoiceNumber(): Promise<string>;

  // Quotations
  getQuotations(): Promise<any[]>;
  getQuotationById(id: string): Promise<any>;
  createQuotation(quotation: InsertQuotation, parts?: any[]): Promise<Quotation>;
  updateQuotation(id: string, quotation: Partial<InsertQuotation>): Promise<Quotation>;
  deleteQuotation(id: string): Promise<void>;
  generateQuotationNumber(): Promise<string>;

  // Dashboard metrics
  getDashboardMetrics(): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, parseInt(id)));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getCustomers(): Promise<Customer[]> {
    return await db.select().from(customers).orderBy(desc(customers.createdAt));
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, parseInt(id)));
    return customer || undefined;
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const [newCustomer] = await db.insert(customers).values(customer).returning();
    return newCustomer;
  }

  async updateCustomer(id: string, customer: Partial<InsertCustomer>): Promise<Customer> {
    const [updatedCustomer] = await db
      .update(customers)
      .set(customer)
      .where(eq(customers.id, parseInt(id)))
      .returning();
    return updatedCustomer;
  }

  async deleteCustomer(id: string): Promise<void> {
    await db.delete(customers).where(eq(customers.id, parseInt(id)));
  }

  async getTechnicians(): Promise<Technician[]> {
    return await db.select().from(technicians).orderBy(desc(technicians.createdAt));
  }

  async getTechnician(id: string): Promise<Technician | undefined> {
    const [technician] = await db.select().from(technicians).where(eq(technicians.id, parseInt(id)));
    return technician || undefined;
  }

  async createTechnician(technician: InsertTechnician): Promise<Technician> {
    const [newTechnician] = await db.insert(technicians).values(technician).returning();
    return newTechnician;
  }

  async updateTechnician(id: string, technician: Partial<InsertTechnician>): Promise<Technician> {
    const [updatedTechnician] = await db
      .update(technicians)
      .set(technician)
      .where(eq(technicians.id, parseInt(id)))
      .returning();
    return updatedTechnician;
  }

  async deleteTechnician(id: string): Promise<void> {
    await db.delete(technicians).where(eq(technicians.id, parseInt(id)));
  }

  async getProductTypes(): Promise<ProductType[]> {
    return await db.select().from(productTypes);
  }

  async getBrands(): Promise<Brand[]> {
    return await db.select().from(brands).orderBy(brands.displayName);
  }



  async getModelsByBrand(brandId: string): Promise<Model[]> {
    return await db.select().from(models).where(eq(models.brandId, parseInt(brandId)));
  }

  async createProductType(productType: InsertProductType): Promise<ProductType> {
    const [newProductType] = await db.insert(productTypes).values(productType).returning();
    return newProductType;
  }

  async createBrand(brand: InsertBrand): Promise<Brand> {
    const [newBrand] = await db.insert(brands).values(brand).returning();
    return newBrand;
  }

  async createModel(model: InsertModel): Promise<Model> {
    const [newModel] = await db.insert(models).values(model).returning();
    return newModel;
  }

  async getJobSheets(): Promise<any[]> {
    return await db
      .select({
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
        accessoriesReceived: jobSheets.accessoriesReceived,
        jobStartDateTime: jobSheets.jobStartDateTime,
        createdAt: jobSheets.createdAt,
        customer: {
          id: customers.id,
          name: customers.name,
          phone: customers.phone,
          alternatePhone: customers.alternatePhone,
          address: customers.address,
          city: customers.city,
          state: customers.state,
          pinCode: customers.pinCode,
        },
        technician: {
          id: technicians.id,
          name: technicians.name,
        },
        productType: {
          id: productTypes.id,
          displayName: productTypes.displayName,
        },
        brand: {
          id: brands.id,
          displayName: brands.displayName,
        },
        model: {
          id: models.id,
          displayName: models.displayName,
        },
      })
      .from(jobSheets)
      .leftJoin(customers, eq(jobSheets.customerId, customers.id))
      .leftJoin(technicians, eq(jobSheets.technicianId, technicians.id))
      .leftJoin(productTypes, eq(jobSheets.productTypeId, productTypes.id))
      .leftJoin(brands, eq(jobSheets.brandId, brands.id))
      .leftJoin(models, eq(jobSheets.modelId, models.id))
      .orderBy(desc(jobSheets.createdAt));
  }

  async getJobSheet(id: string): Promise<any> {
    const [jobSheet] = await db
      .select({
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
          name: users.name,
        },
      })
      .from(jobSheets)
      .leftJoin(customers, eq(jobSheets.customerId, customers.id))
      .leftJoin(technicians, eq(jobSheets.technicianId, technicians.id))
      .leftJoin(productTypes, eq(jobSheets.productTypeId, productTypes.id))
      .leftJoin(brands, eq(jobSheets.brandId, brands.id))
      .leftJoin(models, eq(jobSheets.modelId, models.id))
      .leftJoin(users, eq(jobSheets.agentId, users.id))
      .where(eq(jobSheets.id, parseInt(id)));
    
    return jobSheet || undefined;
  }

  async createJobSheet(jobSheet: InsertJobSheet): Promise<JobSheet> {
    const [newJobSheet] = await db.insert(jobSheets).values(jobSheet).returning();
    return newJobSheet;
  }

  async updateJobSheet(id: string, jobSheet: Partial<InsertJobSheet>): Promise<JobSheet> {
    const [updatedJobSheet] = await db
      .update(jobSheets)
      .set({ ...jobSheet, updatedAt: new Date() })
      .where(eq(jobSheets.id, parseInt(id)))
      .returning();
    return updatedJobSheet;
  }

  async deleteJobSheet(id: string): Promise<void> {
    await db.delete(jobSheets).where(eq(jobSheets.id, parseInt(id)));
  }

  async generateJobId(): Promise<string> {
    const year = new Date().getFullYear();
    let nextNumber = 1;
    let jobId: string;
    let exists = true;
    
    // Keep trying until we find a unique job ID
    while (exists) {
      jobId = `JS-${year}-${nextNumber.toString().padStart(3, '0')}`;
      
      const [existingJob] = await db
        .select({ id: jobSheets.id })
        .from(jobSheets)
        .where(eq(jobSheets.jobId, jobId));
      
      if (!existingJob) {
        exists = false;
      } else {
        nextNumber++;
      }
    }
    
    return jobId!;
  }

  async getInventoryItems(): Promise<InventoryItem[]> {
    return await db.select().from(inventory).orderBy(inventory.name);
  }

  async getInventoryItem(id: string): Promise<InventoryItem | undefined> {
    const [item] = await db.select().from(inventory).where(eq(inventory.id, parseInt(id)));
    return item || undefined;
  }

  async createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem> {
    const [newItem] = await db.insert(inventory).values(item).returning();
    return newItem;
  }

  async updateInventoryItem(id: string, item: Partial<InsertInventoryItem>): Promise<InventoryItem> {
    const [updatedItem] = await db
      .update(inventory)
      .set(item)
      .where(eq(inventory.id, parseInt(id)))
      .returning();
    return updatedItem;
  }

  async getPayments(): Promise<Payment[]> {
    return await db.select().from(payments).orderBy(desc(payments.createdAt));
  }

  async getPaymentsByJobSheet(jobSheetId: string): Promise<Payment[]> {
    return await db.select().from(payments).where(eq(payments.jobSheetId, parseInt(jobSheetId)));
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [newPayment] = await db.insert(payments).values(payment).returning();
    return newPayment;
  }

  async getDashboardMetrics(): Promise<any> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    // Get job counts
    const [activeJobs] = await db
      .select({ count: count() })
      .from(jobSheets)
      .where(eq(jobSheets.status, 'in_progress'));

    const [completedToday] = await db
      .select({ count: count() })
      .from(jobSheets)
      .where(
        and(
          eq(jobSheets.status, 'completed'),
          gte(jobSheets.updatedAt, startOfDay),
          lte(jobSheets.updatedAt, endOfDay)
        )
      );

    const [pendingJobs] = await db
      .select({ count: count() })
      .from(jobSheets)
      .where(eq(jobSheets.status, 'pending'));

    // Get payment metrics
    const [todayRevenue] = await db
      .select({ total: sum(payments.internalAmount) })
      .from(payments)
      .where(
        and(
          gte(payments.createdAt, startOfDay),
          lte(payments.createdAt, endOfDay)
        )
      );

    const [totalCollected] = await db
      .select({ total: sum(payments.internalAmount) })
      .from(payments)
      .where(eq(payments.status, 'paid'));

    const [totalDue] = await db
      .select({ total: sum(payments.balance) })
      .from(payments)
      .where(eq(payments.status, 'pending'));

    // Get stock metrics
    const [availableStock] = await db
      .select({ count: count() })
      .from(inventory)
      .where(sql`quantity > min_quantity`);

    const [lowStock] = await db
      .select({ count: count() })
      .from(inventory)
      .where(sql`quantity <= min_quantity AND quantity > 0`);

    const [outOfStock] = await db
      .select({ count: count() })
      .from(inventory)
      .where(eq(inventory.quantity, 0));

    return {
      activeJobs: activeJobs?.count || 0,
      completedToday: completedToday?.count || 0,
      pendingJobs: pendingJobs?.count || 0,
      todayRevenue: todayRevenue?.total || 0,
      totalCollected: totalCollected?.total || 0,
      totalDue: totalDue?.total || 0,
      availableStock: availableStock?.count || 0,
      lowStock: lowStock?.count || 0,
      outOfStock: outOfStock?.count || 0,
    };
  }

  // Invoice methods
  async getInvoices(): Promise<any[]> {
    const invoicesList = await db
      .select({
        invoice: invoices,
        jobSheet: jobSheets,
        customer: customers,
        productType: productTypes,
        brand: brands,
        model: models,
        technician: technicians,
      })
      .from(invoices)
      .leftJoin(jobSheets, eq(invoices.jobSheetId, jobSheets.id))
      .leftJoin(customers, eq(jobSheets.customerId, customers.id))
      .leftJoin(productTypes, eq(jobSheets.productTypeId, productTypes.id))
      .leftJoin(brands, eq(jobSheets.brandId, brands.id))
      .leftJoin(models, eq(jobSheets.modelId, models.id))
      .leftJoin(technicians, eq(jobSheets.technicianId, technicians.id))
      .orderBy(desc(invoices.createdAt));

    // Fetch parts for each invoice
    const invoicesWithParts = await Promise.all(
      invoicesList.map(async (invoice) => {
        const parts = await db
          .select()
          .from(invoiceParts)
          .where(eq(invoiceParts.invoiceId, invoice.invoice.id));
        
        return { ...invoice, parts };
      })
    );

    return invoicesWithParts;
  }

  async getInvoiceById(id: string): Promise<any> {
    const [invoice] = await db
      .select({
        invoice: invoices,
        jobSheet: jobSheets,
        customer: customers,
        productType: productTypes,
        brand: brands,
        model: models,
        technician: technicians,
      })
      .from(invoices)
      .leftJoin(jobSheets, eq(invoices.jobSheetId, jobSheets.id))
      .leftJoin(customers, eq(jobSheets.customerId, customers.id))
      .leftJoin(productTypes, eq(jobSheets.productTypeId, productTypes.id))
      .leftJoin(brands, eq(jobSheets.brandId, brands.id))
      .leftJoin(models, eq(jobSheets.modelId, models.id))
      .leftJoin(technicians, eq(jobSheets.technicianId, technicians.id))
      .where(eq(invoices.id, parseInt(id)));

    if (!invoice) return null;

    const parts = await db
      .select()
      .from(invoiceParts)
      .where(eq(invoiceParts.invoiceId, parseInt(id)));

    return { ...invoice, parts };
  }

  async createInvoice(invoice: InsertInvoice, parts: any[] = []): Promise<Invoice> {
    // Generate invoice number
    const year = new Date().getFullYear();
    const [result] = await db
      .select({ count: count() })
      .from(invoices)
      .where(sql`EXTRACT(YEAR FROM created_at) = ${year}`);
    
    const nextNumber = (result?.count || 0) + 1;
    const invoiceNumber = `INV-${year}-${nextNumber.toString().padStart(4, '0')}`;

    const [newInvoice] = await db
      .insert(invoices)
      .values({ ...invoice, invoiceNumber })
      .returning();
    
    // Insert invoice parts if provided
    if (parts && parts.length > 0) {
      const partsData = parts.map((part: any) => ({
        invoiceId: newInvoice.id,
        partName: part.name,
        quantity: part.quantity,
        unitPrice: part.rate.toString(),
        amount: part.amount.toString(),
      }));

      await db.insert(invoiceParts).values(partsData);
    }
    
    return newInvoice;
  }

  async updateInvoice(id: string, invoice: Partial<InsertInvoice>): Promise<Invoice> {
    const [updatedInvoice] = await db
      .update(invoices)
      .set(invoice)
      .where(eq(invoices.id, parseInt(id)))
      .returning();
    
    return updatedInvoice;
  }

  async deleteInvoice(id: string): Promise<void> {
    // Delete invoice parts first
    await db.delete(invoiceParts).where(eq(invoiceParts.invoiceId, parseInt(id)));
    
    // Delete invoice
    await db.delete(invoices).where(eq(invoices.id, parseInt(id)));
  }

  // D-Invoice methods
  async getDInvoices(): Promise<any[]> {
    const dInvoicesList = await db
      .select({
        invoice: dInvoices,
        jobSheet: jobSheets,
        customer: customers,
        productType: productTypes,
        brand: brands,
        model: models,
        technician: technicians,
      })
      .from(dInvoices)
      .leftJoin(jobSheets, eq(dInvoices.jobSheetId, jobSheets.id))
      .leftJoin(customers, eq(jobSheets.customerId, customers.id))
      .leftJoin(productTypes, eq(jobSheets.productTypeId, productTypes.id))
      .leftJoin(brands, eq(jobSheets.brandId, brands.id))
      .leftJoin(models, eq(jobSheets.modelId, models.id))
      .leftJoin(technicians, eq(jobSheets.technicianId, technicians.id))
      .orderBy(desc(dInvoices.createdAt));

    // Fetch parts for each D-invoice
    const dInvoicesWithParts = await Promise.all(
      dInvoicesList.map(async (dInvoiceItem) => {
        const parts = await db
          .select()
          .from(dInvoiceParts)
          .where(eq(dInvoiceParts.invoiceId, dInvoiceItem.invoice.id));
        
        return {
          ...dInvoiceItem,
          parts,
        };
      })
    );

    return dInvoicesWithParts;
  }

  async getDInvoiceById(id: string): Promise<any> {
    const [dInvoiceItem] = await db
      .select({
        invoice: dInvoices,
        jobSheet: jobSheets,
        customer: customers,
        productType: productTypes,
        brand: brands,
        model: models,
        technician: technicians,
      })
      .from(dInvoices)
      .leftJoin(jobSheets, eq(dInvoices.jobSheetId, jobSheets.id))
      .leftJoin(customers, eq(jobSheets.customerId, customers.id))
      .leftJoin(productTypes, eq(jobSheets.productTypeId, productTypes.id))
      .leftJoin(brands, eq(jobSheets.brandId, brands.id))
      .leftJoin(models, eq(jobSheets.modelId, models.id))
      .leftJoin(technicians, eq(jobSheets.technicianId, technicians.id))
      .where(eq(dInvoices.id, parseInt(id)));

    if (!dInvoiceItem) return null;

    const parts = await db
      .select()
      .from(dInvoiceParts)
      .where(eq(dInvoiceParts.invoiceId, dInvoiceItem.invoice.id));

    return {
      ...dInvoiceItem,
      parts,
    };
  }

  async createDInvoice(dInvoiceData: InsertDInvoice, parts?: any[]): Promise<DInvoice> {
    const dInvoiceNumber = await this.generateDInvoiceNumber();
    
    const [newDInvoice] = await db.insert(dInvoices).values({
      ...dInvoiceData,
      invoiceNumber: dInvoiceNumber,
    }).returning();

    // Add parts if provided
    if (parts && parts.length > 0) {
      const partsData = parts.map(part => ({
        invoiceId: newDInvoice.id,
        partName: part.partName || part.name,
        quantity: part.quantity,
        unitPrice: (part.unitPrice || part.rate || 0).toString(),
        amount: (part.amount || 0).toString(),
      }));

      await db.insert(dInvoiceParts).values(partsData);
    }
    
    return newDInvoice;
  }

  async updateDInvoice(id: string, dInvoiceData: Partial<InsertDInvoice>): Promise<DInvoice> {
    const [updatedDInvoice] = await db
      .update(dInvoices)
      .set(dInvoiceData)
      .where(eq(dInvoices.id, parseInt(id)))
      .returning();
    
    return updatedDInvoice;
  }

  async deleteDInvoice(id: string): Promise<void> {
    // Delete D-invoice parts first
    await db.delete(dInvoiceParts).where(eq(dInvoiceParts.invoiceId, parseInt(id)));
    
    // Delete D-invoice
    await db.delete(dInvoices).where(eq(dInvoices.id, parseInt(id)));
  }

  async generateDInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    let nextNumber = 1;
    let dInvoiceNumber: string;
    let exists = true;
    
    // Keep trying until we find a unique D-invoice number
    while (exists) {
      dInvoiceNumber = `DINV-${year}-${nextNumber.toString().padStart(4, '0')}`;
      
      const [existingDInvoice] = await db
        .select({ id: dInvoices.id })
        .from(dInvoices)
        .where(eq(dInvoices.invoiceNumber, dInvoiceNumber));
      
      if (!existingDInvoice) {
        exists = false;
      } else {
        nextNumber++;
      }
    }
    
    return dInvoiceNumber!;
  }

  // Quotations implementation
  async getQuotations(): Promise<any[]> {
    const quotationsWithDetails = await db
      .select({
        quotation: quotations,
        parts: sql`COALESCE(json_agg(${quotationParts}) FILTER (WHERE ${quotationParts.id} IS NOT NULL), '[]'::json)`.as('parts')
      })
      .from(quotations)
      .leftJoin(quotationParts, eq(quotations.id, quotationParts.quotationId))
      .groupBy(quotations.id)
      .orderBy(desc(quotations.createdAt));

    return quotationsWithDetails.map(row => ({
      ...row.quotation,
      parts: Array.isArray(row.parts) ? row.parts : JSON.parse(row.parts as string)
    }));
  }



  async createQuotation(quotation: InsertQuotation, parts: any[] = []): Promise<Quotation> {
    const quotationNumber = await this.generateQuotationNumber();
    
    // Convert numeric fields to strings for database insertion
    const quotationData = {
      ...quotation,
      quotationNumber,
      serviceCharge: quotation.serviceCharge?.toString() || "0",
      totalAmount: quotation.totalAmount.toString(),
    };
    
    const [newQuotation] = await db
      .insert(quotations)
      .values(quotationData)
      .returning();

    if (parts && parts.length > 0) {
      await db
        .insert(quotationParts)
        .values(parts.map(part => ({
          quotationId: newQuotation.id,
          name: part.name,
          quantity: part.quantity,
          unitPrice: part.unitPrice.toString(),
          amount: part.amount.toString()
        })));
    }

    return newQuotation;
  }

  async updateQuotation(id: string, quotation: any): Promise<Quotation> {
    // Only convert numeric fields if they exist
    const updateData: any = {
      ...quotation,
      updatedAt: new Date(),
    };
    
    // Only convert numeric fields if they are provided
    if (quotation.serviceCharge !== undefined) {
      updateData.serviceCharge = quotation.serviceCharge.toString();
    }
    if (quotation.totalAmount !== undefined) {
      updateData.totalAmount = quotation.totalAmount.toString();
    }
    
    const [updatedQuotation] = await db
      .update(quotations)
      .set(updateData)
      .where(eq(quotations.id, parseInt(id)))
      .returning();

    return updatedQuotation;
  }

  async deleteQuotation(id: number): Promise<void> {
    await db.delete(quotationParts).where(eq(quotationParts.quotationId, id));
    await db.delete(quotations).where(eq(quotations.id, id));
  }

  async getQuotationById(id: number): Promise<Quotation | null> {
    const [quotation] = await db
      .select()
      .from(quotations)
      .where(eq(quotations.id, id))
      .limit(1);
    
    if (!quotation) return null;

    // Get related parts
    const parts = await db
      .select()
      .from(quotationParts)
      .where(eq(quotationParts.quotationId, id));

    return {
      ...quotation,
      parts: parts || []
    } as any;
  }

  async generateQuotationNumber(): Promise<string> {
    const year = new Date().getFullYear();
    let nextNumber = 1;
    let quotationNumber: string;
    let exists = true;
    
    // Keep trying until we find a unique quotation number
    while (exists) {
      quotationNumber = `QUO-${year}-${nextNumber.toString().padStart(4, '0')}`;
      
      const [existingQuotation] = await db
        .select({ id: quotations.id })
        .from(quotations)
        .where(eq(quotations.quotationNumber, quotationNumber));
      
      if (!existingQuotation) {
        exists = false;
      } else {
        nextNumber++;
      }
    }
    
    return quotationNumber!;
  }
}

export const storage = new DatabaseStorage();
