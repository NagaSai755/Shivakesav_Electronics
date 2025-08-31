import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCustomerSchema, insertTechnicianSchema, insertJobSheetSchema, insertInventorySchema, insertPaymentSchema, insertInvoiceSchema, insertDInvoiceSchema, insertQuotationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Dashboard metrics
  app.get("/api/dashboard/metrics", async (req, res) => {
    try {
      const metrics = await storage.getDashboardMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard metrics" });
    }
  });

  // Customer routes
  app.get("/api/customers", async (req, res) => {
    try {
      const customers = await storage.getCustomers();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customers" });
    }
  });

  app.get("/api/customers/:id", async (req, res) => {
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

  app.post("/api/customers", async (req, res) => {
    try {
      console.log('Customer creation request body:', req.body);
      const customerData = insertCustomerSchema.parse(req.body);
      console.log('Parsed customer data:', customerData);
      const customer = await storage.createCustomer(customerData);
      console.log('Customer created successfully:', customer);
      res.status(201).json(customer);
    } catch (error) {
      console.error('Customer creation error:', error);
      console.error('Error stack:', error.stack);
      if (error instanceof z.ZodError) {
        console.error('Validation errors:', error.errors);
        return res.status(400).json({ error: "Invalid customer data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create customer" });
    }
  });

  app.patch("/api/customers/:id", async (req, res) => {
    try {
      const customerData = insertCustomerSchema.parse(req.body);
      const customer = await storage.updateCustomer(req.params.id, customerData);
      res.json(customer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid customer data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update customer" });
    }
  });

  app.delete("/api/customers/:id", async (req, res) => {
    try {
      await storage.deleteCustomer(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete customer" });
    }
  });

  // Technician routes
  app.get("/api/technicians", async (req, res) => {
    try {
      const technicians = await storage.getTechnicians();
      res.json(technicians);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch technicians" });
    }
  });

  app.post("/api/technicians", async (req, res) => {
    try {
      // Convert joiningDate string to Date object before validation
      const bodyWithDate = {
        ...req.body,
        joiningDate: req.body.joiningDate ? new Date(req.body.joiningDate) : undefined,
      };
      const technicianData = insertTechnicianSchema.parse(bodyWithDate);
      const technician = await storage.createTechnician(technicianData);
      res.status(201).json(technician);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid technician data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create technician" });
    }
  });

  app.patch("/api/technicians/:id", async (req, res) => {
    try {
      const bodyWithDate = {
        ...req.body,
        joiningDate: req.body.joiningDate ? new Date(req.body.joiningDate) : undefined,
      };
      const technicianData = insertTechnicianSchema.parse(bodyWithDate);
      const technician = await storage.updateTechnician(req.params.id, technicianData);
      res.json(technician);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid technician data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update technician" });
    }
  });

  app.delete("/api/technicians/:id", async (req, res) => {
    try {
      await storage.deleteTechnician(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete technician" });
    }
  });

  // Product management routes
  app.get("/api/product-types", async (req, res) => {
    try {
      const productTypes = await storage.getProductTypes();
      res.json(productTypes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product types" });
    }
  });

  app.get("/api/brands", async (req, res) => {
    try {
      const brands = await storage.getBrands();
      res.json(brands);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch brands" });
    }
  });



  app.get("/api/models/:brandId", async (req, res) => {
    try {
      const models = await storage.getModelsByBrand(req.params.brandId);
      res.json(models);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch models" });
    }
  });

  // Job sheet routes
  app.get("/api/job-sheets", async (req, res) => {
    try {
      const jobSheets = await storage.getJobSheets();
      res.json(jobSheets);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch job sheets" });
    }
  });

  app.get("/api/job-sheets/:id", async (req, res) => {
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

  app.post("/api/job-sheets", async (req, res) => {
    try {
      const jobId = await storage.generateJobId();
      
      // Convert string IDs to integers and handle dates
      const bodyWithCorrectTypes = {
        ...req.body,
        jobId,
        productTypeId: req.body.productTypeId ? parseInt(req.body.productTypeId) : null,
        brandId: req.body.brandId ? parseInt(req.body.brandId) : null,
        modelId: req.body.modelId ? parseInt(req.body.modelId) : null,
        technicianId: req.body.technicianId ? parseInt(req.body.technicianId) : null,
        agentId: req.body.agentId ? parseInt(req.body.agentId) : null,
        purchaseDate: req.body.purchaseDate ? new Date(req.body.purchaseDate) : null,
      };
      
      const jobSheetData = insertJobSheetSchema.parse(bodyWithCorrectTypes);
      const jobSheet = await storage.createJobSheet(jobSheetData);
      res.status(201).json(jobSheet);
    } catch (error) {
      console.error('Job sheet creation error:', error);
      if (error instanceof z.ZodError) {
        console.error('Validation errors:', error.errors);
        return res.status(400).json({ error: "Invalid job sheet data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create job sheet" });
    }
  });

  app.patch("/api/job-sheets/:id", async (req, res) => {
    try {
      // Convert string IDs to integers and handle dates for update
      const bodyWithCorrectTypes = {
        ...req.body,
        productTypeId: req.body.productTypeId ? parseInt(req.body.productTypeId) : undefined,
        brandId: req.body.brandId ? parseInt(req.body.brandId) : undefined,
        modelId: req.body.modelId ? parseInt(req.body.modelId) : null,
        technicianId: req.body.technicianId ? parseInt(req.body.technicianId) : null,
        agentId: req.body.agentId ? parseInt(req.body.agentId) : undefined,
        purchaseDate: req.body.purchaseDate ? new Date(req.body.purchaseDate) : null,
      };

      // Auto-update status based on technician assignment
      const currentJobSheet = await storage.getJobSheet(req.params.id);
      if (currentJobSheet) {
        // If technician is being assigned and current status is pending, move to in_progress
        if (bodyWithCorrectTypes.technicianId && 
            !currentJobSheet.technicianId && 
            currentJobSheet.status === 'pending') {
          bodyWithCorrectTypes.status = 'in_progress';
        }
        // If technician is being removed and status is in_progress, move back to pending
        else if (bodyWithCorrectTypes.technicianId === null && 
                 currentJobSheet.technicianId && 
                 currentJobSheet.status === 'in_progress') {
          bodyWithCorrectTypes.status = 'pending';
        }
      }
      
      const jobSheet = await storage.updateJobSheet(req.params.id, bodyWithCorrectTypes);
      res.json(jobSheet);
    } catch (error) {
      console.error('Job sheet update error:', error);
      res.status(500).json({ error: "Failed to update job sheet" });
    }
  });

  app.delete("/api/job-sheets/:id", async (req, res) => {
    try {
      await storage.deleteJobSheet(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete job sheet" });
    }
  });

  // Inventory routes
  app.get("/api/inventory", async (req, res) => {
    try {
      const items = await storage.getInventoryItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch inventory items" });
    }
  });

  app.post("/api/inventory", async (req, res) => {
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

  // Payment routes
  app.get("/api/payments", async (req, res) => {
    try {
      const payments = await storage.getPayments();
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch payments" });
    }
  });

  app.post("/api/payments", async (req, res) => {
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

  // Invoice routes
  app.get("/api/invoices", async (req, res) => {
    try {
      const invoices = await storage.getInvoices();
      res.json(invoices);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch invoices" });
    }
  });

  app.get("/api/invoices/:id", async (req, res) => {
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

  app.post("/api/invoices", async (req, res) => {
    try {
      const { parts, ...invoiceDataOnly } = req.body;
      const invoiceData = insertInvoiceSchema.parse(invoiceDataOnly);
      const invoice = await storage.createInvoice(invoiceData, parts || []);
      
      // Auto-update job sheet status to completed when invoice is created
      if (invoiceData.jobSheetId) {
        await storage.updateJobSheet(invoiceData.jobSheetId.toString(), { 
          status: 'completed' 
        });
      }
      
      res.status(201).json(invoice);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid invoice data", details: error.errors });
      }
      console.error('Invoice creation error:', error);
      res.status(500).json({ error: "Failed to create invoice" });
    }
  });

  app.patch("/api/invoices/:id", async (req, res) => {
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

  app.delete("/api/invoices/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteInvoice(id);
      res.json({ message: "Invoice deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete invoice" });
    }
  });

  // D-Invoice routes
  app.get("/api/d-invoices", async (req, res) => {
    try {
      const dInvoices = await storage.getDInvoices();
      res.json(dInvoices);
    } catch (error) {
      console.error('D-Invoice fetch error:', error);
      res.status(500).json({ error: "Failed to fetch D-invoices" });
    }
  });

  app.get("/api/d-invoices/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const dInvoice = await storage.getDInvoiceById(id);
      if (!dInvoice) {
        return res.status(404).json({ error: "D-Invoice not found" });
      }
      res.json(dInvoice);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch D-invoice" });
    }
  });

  app.post("/api/d-invoices", async (req, res) => {
    try {
      const { parts, ...dInvoiceData } = req.body;
      const validatedData = insertDInvoiceSchema.parse(dInvoiceData);
      const dInvoice = await storage.createDInvoice(validatedData, parts);
      
      // Auto-update job sheet status to completed when D-invoice is created
      if (validatedData.jobSheetId) {
        await storage.updateJobSheet(validatedData.jobSheetId.toString(), { 
          status: 'completed' 
        });
      }
      
      res.status(201).json(dInvoice);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid D-invoice data", details: error.errors });
      }
      console.error('D-Invoice creation error:', error);
      res.status(500).json({ error: "Failed to create D-invoice" });
    }
  });

  app.patch("/api/d-invoices/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = insertDInvoiceSchema.partial().parse(req.body);
      const dInvoice = await storage.updateDInvoice(id, updateData);
      if (!dInvoice) {
        return res.status(404).json({ error: "D-Invoice not found" });
      }
      res.json(dInvoice);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid D-invoice data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update D-invoice" });
    }
  });

  app.delete("/api/d-invoices/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteDInvoice(id);
      res.json({ message: "D-Invoice deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete D-invoice" });
    }
  });

  // Quotation routes
  app.get("/api/quotations", async (req, res) => {
    try {
      const quotations = await storage.getQuotations();
      res.json(quotations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch quotations" });
    }
  });

  app.get("/api/quotations/:id", async (req, res) => {
    try {
      const quotation = await storage.getQuotationById(parseInt(req.params.id));
      if (!quotation) {
        return res.status(404).json({ error: "Quotation not found" });
      }
      res.json(quotation);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch quotation" });
    }
  });

  app.post("/api/quotations", async (req, res) => {
    try {
      const { parts, ...quotationData } = req.body;
      
      // Create a custom validation schema that accepts the numeric values from frontend
      const customQuotationSchema = z.object({
        customerName: z.string().min(1),
        customerPhone: z.string().min(10),
        customerAddress: z.string().min(1),
        city: z.string().optional(),
        state: z.string().optional(),
        pinCode: z.string().optional(),
        productType: z.string().optional(),
        brand: z.string().optional(),
        model: z.string().optional(),
        modelNumber: z.string().optional(),
        serialNumber: z.string().optional(),
        serviceCharge: z.number().min(0),
        totalAmount: z.number().min(0),
        paymentTerms: z.string().optional(),
        validityDays: z.number().min(1),
        status: z.string().optional(),
        remarks: z.string().optional(),
        jobSheetId: z.number().optional(),
        customerId: z.number().optional(),
      });
      
      const validatedData = customQuotationSchema.parse(quotationData);
      const quotation = await storage.createQuotation(validatedData, parts);
      res.status(201).json(quotation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid quotation data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create quotation" });
    }
  });

  app.patch("/api/quotations/:id", async (req, res) => {
    try {
      // For partial updates, only validate the provided fields
      const quotation = await storage.updateQuotation(req.params.id, req.body);
      res.json(quotation);
    } catch (error) {
      console.error("Update quotation error:", error);
      res.status(500).json({ error: "Failed to update quotation" });
    }
  });

  app.delete("/api/quotations/:id", async (req, res) => {
    try {
      await storage.deleteQuotation(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete quotation" });
    }
  });

  // Create job sheet from quotation
  app.post("/api/quotations/:id/create-job-sheet", async (req, res) => {
    try {
      const quotationId = parseInt(req.params.id);
      const quotation = await storage.getQuotationById(quotationId);
      
      if (!quotation) {
        return res.status(404).json({ error: "Quotation not found" });
      }

      if (quotation.status !== 'accepted') {
        return res.status(400).json({ error: "Only accepted quotations can be converted to job sheets" });
      }

      // Generate new job ID
      const allJobSheets = await storage.getJobSheets();
      const currentYear = new Date().getFullYear();
      const jobCount = allJobSheets.filter((js: any) => js.jobId.includes(currentYear.toString())).length;
      const jobId = `JS-${currentYear}-${String(jobCount + 1).padStart(3, '0')}`;

      // Create job sheet from quotation data
      const jobSheetData = {
        jobId,
        customerId: quotation.customerId,
        customerName: quotation.customerName,
        customerPhone: quotation.customerPhone,
        customerAddress: quotation.customerAddress || '',
        customerCity: quotation.city || '',
        customerState: quotation.state || '',
        customerPinCode: quotation.pinCode || '',
        productTypeId: null,
        brandId: null,
        modelId: null,
        productType: quotation.productType || '',
        brand: quotation.brand || '',
        model: quotation.model || '',
        modelNumber: quotation.modelNumber || '',
        serialNumber: quotation.serialNumber || '',
        purchaseDate: new Date(),
        warrantyStatus: 'out_warranty',
        jobType: 'repair',
        jobClassification: 'quotation_converted',
        customerComplaint: `Converted from Quotation: ${quotation.quotationNumber}`,
        estimatedAmount: parseFloat(quotation.totalAmount.toString()),
        status: 'pending',
        priority: 'medium',
        quotationId: quotationId,
      };

      const jobSheet = await storage.createJobSheet(jobSheetData);

      // Update quotation status to show it's been converted
      await storage.updateQuotation(quotationId.toString(), { 
        status: 'converted', 
        jobSheetId: jobSheet.id 
      });

      res.json(jobSheet);
    } catch (error) {
      console.error("Error creating job sheet from quotation:", error);
      res.status(500).json({ error: "Failed to create job sheet from quotation" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
