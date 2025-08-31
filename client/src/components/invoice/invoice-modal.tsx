import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Check, ChevronsUpDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";

const invoiceSchema = z.object({
  jobSheetId: z.string().min(1, "Job sheet is required"),
  manualJobSheetIds: z.string().optional(),
  invoiceType: z.enum(["gst", "non_gst"]),
  serviceCharge: z.string().min(1, "Service charge is required"),
  discount: z.string().default("0"),
  gstRate: z.string().default("18"),
  paymentMethod: z.enum(["cash", "online"]),
  modelNumber: z.string().optional(),
  serialNumber: z.string().optional(),
  brand: z.string().optional(),
  gstin: z.string().optional(),
  workDone: z.string().optional(),
  remarks: z.string().optional(),
});

const partSchema = z.object({
  name: z.string().min(1, "Part name is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  rate: z.number().min(0, "Rate must be positive"),
});

interface InvoiceModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function InvoiceModal({ onClose, onSuccess }: InvoiceModalProps) {
  const [parts, setParts] = useState<Array<{ name: string; quantity: number; rate: number; amount: number }>>([]);
  const [jobSheetOpen, setJobSheetOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof invoiceSchema>>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      jobSheetId: "",
      invoiceType: "gst",
      serviceCharge: "",
      discount: "0",
      gstRate: "18",
      paymentMethod: "cash",
      modelNumber: "",
      serialNumber: "",
      brand: "",
      gstin: "",
      workDone: "",
      remarks: "",
    },
  });

  const { data: jobSheets = [] } = useQuery({
    queryKey: ["/api/job-sheets"],
  }) as { data: any[] };

  // Watch for job sheet selection to auto-populate fields
  const selectedJobSheetId = form.watch("jobSheetId");
  const selectedJobSheet = jobSheets.find((js: any) => js.id.toString() === selectedJobSheetId);

  // Auto-populate fields when job sheet is selected
  useEffect(() => {
    if (selectedJobSheet) {
      form.setValue("modelNumber", selectedJobSheet.modelNumber || "");
      form.setValue("serialNumber", selectedJobSheet.serialNumber || "");
      form.setValue("brand", selectedJobSheet.brand?.displayName || "");
    }
  }, [selectedJobSheet, form]);

  const createInvoiceMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/invoices", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Invoice created successfully",
      });
      onSuccess();
    },
    onError: (error: any) => {
      console.error('Invoice mutation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create invoice",
        variant: "destructive",
      });
    },
  });

  const addPart = () => {
    setParts([...parts, { name: "", quantity: 1, rate: 0, amount: 0 }]);
  };

  const updatePart = (index: number, field: string, value: string | number) => {
    const updatedParts = [...parts];
    (updatedParts[index] as any)[field] = value;
    
    if (field === "quantity" || field === "rate") {
      updatedParts[index].amount = updatedParts[index].quantity * updatedParts[index].rate;
    }
    
    setParts(updatedParts);
  };

  const removePart = (index: number) => {
    setParts(parts.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    const serviceCharge = parseFloat(form.watch("serviceCharge") || "0");
    const discount = parseFloat(form.watch("discount") || "0");
    const partsTotal = parts.reduce((sum, part) => sum + part.amount, 0);
    const gstInclusiveTotal = serviceCharge + partsTotal - discount;
    
    const invoiceType = form.watch("invoiceType");
    const gstRate = parseFloat(form.watch("gstRate") || "18");
    
    let gstAmount = 0;
    let cgstAmount = 0;
    let sgstAmount = 0;
    let igstAmount = 0;
    let taxableAmount = gstInclusiveTotal;
    
    if (invoiceType === "gst") {
      // Since rates are GST-inclusive, calculate taxable amount
      // Taxable Amount = GST Inclusive Amount / (1 + GST Rate/100)
      taxableAmount = gstInclusiveTotal / (1 + gstRate / 100);
      gstAmount = gstInclusiveTotal - taxableAmount;
      
      // Check if customer is from Andhra Pradesh
      const customerState = selectedJobSheet?.customer?.state?.toLowerCase();
      const isAndhraPradesh = customerState === 'andhra pradesh' || customerState === 'ap';
      
      if (isAndhraPradesh) {
        // For Andhra Pradesh: CGST + SGST (split GST amount equally)
        cgstAmount = gstAmount / 2;
        sgstAmount = gstAmount / 2;
      } else {
        // For other states: IGST
        igstAmount = gstAmount;
      }
    }
    
    const totalAmount = gstInclusiveTotal; // Total remains same as entered rates are GST-inclusive

    return { 
      subtotal: taxableAmount, // This is now the taxable amount (excluding GST)
      gstAmount, 
      cgstAmount, 
      sgstAmount, 
      igstAmount, 
      totalAmount 
    };
  };

  const onSubmit = (data: z.infer<typeof invoiceSchema>) => {
    const { subtotal, gstAmount, cgstAmount, sgstAmount, igstAmount, totalAmount } = calculateTotals();

    const invoiceData = {
      ...data,
      jobSheetId: data.jobSheetId ? (isNaN(parseInt(data.jobSheetId)) ? data.jobSheetId : parseInt(data.jobSheetId)) : data.jobSheetId,
      serviceCharge: data.serviceCharge,
      discount: data.discount,
      subtotal: subtotal.toString(),
      gstAmount: gstAmount.toString(),
      totalAmount: totalAmount.toString(),
      parts: parts.filter(part => part.name && part.quantity > 0),
    };

    createInvoiceMutation.mutate(invoiceData);
  };

  const { subtotal, gstAmount, cgstAmount, sgstAmount, igstAmount, totalAmount } = calculateTotals();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="jobSheetId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Job Sheet *</FormLabel>
                <Popover open={jobSheetOpen} onOpenChange={setJobSheetOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={jobSheetOpen}
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? jobSheets.find(
                              (jobSheet: any) => jobSheet.id.toString() === field.value
                            )
                            ? `${jobSheets.find((js: any) => js.id.toString() === field.value)?.jobId} - ${jobSheets.find((js: any) => js.id.toString() === field.value)?.customer?.name}`
                            : field.value
                          : "Select or type job sheet..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput 
                        placeholder="Search or type job sheet..." 
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                      />
                      <CommandList>
                        <CommandEmpty>No job sheet found. Keep typing to enter manually.</CommandEmpty>
                        <CommandGroup>
                          {jobSheets.filter((js: any) => js.status === 'pending').map((jobSheet: any) => (
                            <CommandItem
                              key={jobSheet.id}
                              value={jobSheet.id.toString()}
                              onSelect={(currentValue) => {
                                field.onChange(currentValue);
                                setJobSheetOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value === jobSheet.id.toString()
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {jobSheet.jobId} - {jobSheet.customer?.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="invoiceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invoice Type *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="gst">GST Invoice</SelectItem>
                    <SelectItem value="non_gst">Non-GST Invoice</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Service Details Section */}
        <Card>
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="online">Online (UPI/Card)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="modelNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter model number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter serial number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter brand name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gstin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GSTIN</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter GSTIN number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="serviceCharge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Charge (₹) *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount (₹)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch("invoiceType") === "gst" && (
            <FormField
              control={form.control}
              name="gstRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GST Rate (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="18.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Parts & Materials</CardTitle>
              <Button type="button" variant="outline" onClick={addPart}>
                <Plus className="h-4 w-4 mr-2" />
                Add Part
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {parts.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No parts added</p>
            ) : (
              <div className="space-y-3">
                {parts.map((part, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Input
                        placeholder="Part name"
                        value={part.name}
                        onChange={(e) => updatePart(index, "name", e.target.value)}
                      />
                    </div>
                    <div className="w-20">
                      <Input
                        type="number"
                        placeholder="Qty"
                        value={part.quantity}
                        onChange={(e) => updatePart(index, "quantity", parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="w-24">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Rate"
                        value={part.rate}
                        onChange={(e) => updatePart(index, "rate", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="w-24">
                      <Input
                        value={`₹${part.amount.toFixed(2)}`}
                        disabled
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removePart(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="workDone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Work Done</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the work performed..."
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="remarks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Remarks</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Additional remarks..."
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Invoice Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              {form.watch("invoiceType") === "gst" && (
                <>
                  {selectedJobSheet?.customer?.state?.toLowerCase() === 'andhra pradesh' || selectedJobSheet?.customer?.state?.toLowerCase() === 'ap' ? (
                    <>
                      <div className="flex justify-between">
                        <span>CGST ({(parseFloat(form.watch("gstRate") || "18") / 2).toFixed(1)}%):</span>
                        <span>₹{cgstAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>SGST ({(parseFloat(form.watch("gstRate") || "18") / 2).toFixed(1)}%):</span>
                        <span>₹{sgstAmount.toFixed(2)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between">
                      <span>IGST ({form.watch("gstRate")}%):</span>
                      <span>₹{igstAmount.toFixed(2)}</span>
                    </div>
                  )}
                </>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total Amount:</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2 pt-4">
          <Button
            type="submit"
            disabled={createInvoiceMutation.isPending}
          >
            {createInvoiceMutation.isPending ? "Creating..." : "Create Invoice"}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}