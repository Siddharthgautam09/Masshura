// src/components/admin/SupplierList.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'; 
import { db } from '../firebase.ts';
import emailjs from '@emailjs/browser';
import { Link } from 'react-router-dom';
import { Search, Filter, Eye, CheckCircle, XCircle, RefreshCw, FileText, Download, ExternalLink, Shield, ShieldOff, Power, PowerOff, MessageSquare, Send, Mail } from 'lucide-react';

// Import UI components from shadcn/ui
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const ITEMS_PER_PAGE = 10;

interface Supplier {
  id: string;
  status: string;
  category?: string;
  categories?: string[];
  companyName: string;
  email: string;
  isActive?: boolean;
  remarks?: any[];
  [key: string]: any;
}

interface SupplierListProps {
  suppliers?: Supplier[];
  isLoading?: boolean;
  statusFilter?: string;
  categoryFilter?: string;
}

const SupplierList: React.FC<SupplierListProps> = ({ 
  suppliers: propSuppliers = [], 
  isLoading: propIsLoading = false,
  statusFilter = 'all',
  categoryFilter = 'all',
}) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(propSuppliers);
  const [isLoading, setIsLoading] = useState(propIsLoading);
  const [categories, setCategories] = useState<string[]>([]);
  const { toast } = useToast();

  // State for search and pagination only
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Remarks functionality
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [remark, setRemark] = useState('');
  const [isRemarkDialogOpen, setIsRemarkDialogOpen] = useState(false);

  // Send login link functionality
  const [isLoginLinkDialogOpen, setIsLoginLinkDialogOpen] = useState(false);
  const [loginLinkSupplier, setLoginLinkSupplier] = useState<Supplier | null>(null);

  // Update suppliers when props change
  useEffect(() => {
    setSuppliers(propSuppliers);
    setIsLoading(propIsLoading);
    
    // Extract categories from suppliers
    const allCategories = new Set<string>();
    propSuppliers.forEach(supplier => {
      // Handle both single category and categories array
      if (supplier.category && typeof supplier.category === 'string') {
        allCategories.add(supplier.category.trim());
      }
      if (supplier.categories && Array.isArray(supplier.categories)) {
        supplier.categories.forEach(cat => {
          if (typeof cat === 'string' && cat.trim()) {
            allCategories.add(cat.trim());
          }
        });
      }
    });
    setCategories(Array.from(allCategories).sort());
  }, [propSuppliers, propIsLoading]);

  // Fallback: fetch suppliers if no props provided (for standalone usage)
  useEffect(() => {
    if (propSuppliers.length === 0 && !propIsLoading) {
      fetchSuppliers();
    }
  }, [propSuppliers.length, propIsLoading]);

  const fetchSuppliers = async () => {
    try {
      setIsLoading(true);
      const querySnapshot = await getDocs(collection(db, 'suppliers'));
      const supplierList = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Supplier));
      setSuppliers(supplierList);
      
      // Extract unique categories from all suppliers
      const allCategories = new Set<string>();
      supplierList.forEach(supplier => {
        // Handle both single category and categories array
        if (supplier.category && typeof supplier.category === 'string') {
          allCategories.add(supplier.category.trim());
        }
        if (supplier.categories && Array.isArray(supplier.categories)) {
          supplier.categories.forEach(cat => {
            if (typeof cat === 'string' && cat.trim()) {
              allCategories.add(cat.trim());
            }
          });
        }
      });
      setCategories(Array.from(allCategories).sort());
      
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      toast({ title: "Error", description: "Could not fetch company data.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to refresh supplier data (only if not using props)
  const refreshSuppliers = async () => {
    if (propSuppliers.length > 0) {
      toast({ title: "Info", description: "Data is managed by parent component.", variant: "default" });
      return;
    }
    await fetchSuppliers();
    toast({ title: "Success", description: "Company data refreshed." });
  };

  // Memoized logic to filter suppliers based on search, status, and category
  const filteredSuppliers = useMemo(() => {
    return suppliers
      .filter(supplier => {
        const companyName = supplier.companyName?.toLowerCase() || '';
        const email = supplier.email?.toLowerCase() || '';
        const term = searchTerm.toLowerCase();
        return companyName.includes(term) || email.includes(term);
      })
      .filter(supplier => {
        if (statusFilter === 'all') return true;
        const supplierStatus = supplier.status?.trim().toLowerCase();
        const filterStatus = statusFilter.trim().toLowerCase();
        return supplierStatus === filterStatus;
      })
      .filter(supplier => {
        if (categoryFilter === 'all') return true;
        
        // Check both single category and categories array
        const hasCategory = 
          (supplier.category?.trim() === categoryFilter.trim()) ||
          (supplier.categories && Array.isArray(supplier.categories) && 
           supplier.categories.some(cat => cat?.trim() === categoryFilter.trim()));
        
        return hasCategory;
      });
  }, [suppliers, searchTerm, statusFilter, categoryFilter]);

  // Memoized logic to paginate the filtered list
  const paginatedSuppliers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSuppliers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredSuppliers, currentPage]);

  const totalPages = Math.ceil(filteredSuppliers.length / ITEMS_PER_PAGE);

  const updateSupplierStatusInState = (supplierId: string, newStatus: string, additionalData: any = {}) => {
    setSuppliers(currentSuppliers =>
      currentSuppliers.map(s => (s.id === supplierId ? { ...s, status: newStatus, ...additionalData } : s))
    );
  };

  const handleApprove = async (supplierId: string, supplierEmail: string, supplierName: string) => {
    try {
      console.log('Starting approval process for:', { supplierId, supplierEmail, supplierName });
      
      // Validate email before proceeding
      if (!supplierEmail || !supplierEmail.includes('@')) {
        throw new Error('Invalid company email address');
      }
      
      // Step 1: Update the supplier's status and activate them in Firestore
      await updateDoc(doc(db, 'suppliers', supplierId), { 
        status: 'approved',
        isActive: true,
        approvedAt: new Date().toISOString()
      });
      console.log('Firestore update successful');
      
      // Update the state locally to reflect the change instantly
      updateSupplierStatusInState(supplierId, 'approved', { isActive: true, approvedAt: new Date().toISOString() });
      toast({ title: "Success", description: "Company has been approved and activated." });

      // Step 2: Send approval welcome email using EmailJS
      const YOUR_SERVICE_ID = "service_6qlid92";
      const YOUR_TEMPLATE_ID = "template_4up1wxm";    // Welcome/Instructions template only
      const YOUR_PUBLIC_KEY = "v5gxhy3P54twB8u7I";

      // Validate EmailJS configuration
      if (!YOUR_SERVICE_ID || !YOUR_TEMPLATE_ID || !YOUR_PUBLIC_KEY) {
        throw new Error('EmailJS configuration is missing');
      }

      // Initialize EmailJS with your public key first
      emailjs.init(YOUR_PUBLIC_KEY);

      // Construct the password setup link
      const setPasswordLink = `${window.location.origin}/set-password?email=${encodeURIComponent(supplierEmail)}`;

      // Template parameters for welcome email (Welcome/Instructions)
      const templateParams = {
        supplier_name: supplierName,
        to_email: supplierEmail,
        company_name: supplierName, // You may want to get actual company name from supplier data
        ref_no: `SUP-${supplierId.slice(-6)}`,
        acceptance_date: new Date().toLocaleDateString(),
        portal_link: `${window.location.origin}/supplier-portal`,
        set_password_link: setPasswordLink,
        support_email: "support@masshura.com",
        from_name: "Masshura Team",
        message: "Welcome to Masshura! Your supplier application has been approved."
      };

      console.log('Sending approval welcome email with params:', templateParams);

      // Send welcome email
      const emailResult = await emailjs.send(YOUR_SERVICE_ID, YOUR_TEMPLATE_ID, templateParams);
      console.log('Approval welcome email sent successfully:', emailResult);

      toast({ 
        title: "Welcome Email Sent", 
        description: "Approval welcome email has been sent to the company." 
      });

    } catch (error) {
      console.error("Approval process failed:", error);
      
      toast({
        title: "Email Failed",
        description: `Company approved but could not send welcome email. Error: ${error.text || error.message || 'Unknown error'}`,
        variant: "destructive"
      });
    }
  };

  const handleReject = async (supplierId: string) => {
    try {
      // Find the supplier data to get email and name
      const supplier = suppliers.find(s => s.id === supplierId);
      if (!supplier) {
        throw new Error('Company not found');
      }

      console.log('Starting rejection process for:', { 
        supplierId, 
        supplierEmail: supplier.email, 
        supplierName: supplier.contactPerson || supplier.companyName 
      });

      // Step 1: Update the supplier's status in Firestore
      await updateDoc(doc(db, 'suppliers', supplierId), { 
        status: 'rejected',
        rejectedAt: new Date().toISOString()
      });
      console.log('Firestore update successful');
      
      updateSupplierStatusInState(supplierId, 'rejected', { rejectedAt: new Date().toISOString() });
      toast({ title: "Success", description: "Company has been rejected." });

      // Step 2: Send rejection email (if supplier has valid email)
      if (supplier.email && supplier.email.includes('@')) {
        await sendRejectionEmail(supplier);
      } else {
        console.warn('No valid email found for company, skipping rejection email');
      }

    } catch (error) {
      console.error("Rejection process failed:", error);
      toast({
        title: "Error",
        description: `Failed to reject company: ${error.message || 'Unknown error'}`,
        variant: "destructive"
      });
    }
  };

  const sendRejectionEmail = async (supplier: Supplier) => {
    try {
      // TODO: Replace with your actual rejection EmailJS configuration
      const REJECTION_SERVICE_ID = "service_gcr919g";
      const REJECTION_TEMPLATE_ID = "template_zhrmd5l";
      const REJECTION_PUBLIC_KEY = "_r7BfwEM87Padmulp";

      // Validate EmailJS configuration
      if (!REJECTION_SERVICE_ID || !REJECTION_TEMPLATE_ID || !REJECTION_PUBLIC_KEY) {
        console.warn('Rejection EmailJS configuration is missing, skipping email');
        return;
      }

      // Initialize EmailJS
      emailjs.init(REJECTION_PUBLIC_KEY);

      // Template parameters for rejection email
      const templateParams = {
        supplier_name: supplier.contactPerson || supplier.companyName,
        company_name: supplier.companyName,
        to_email: supplier.email,
        rejection_date: new Date().toLocaleDateString(),
        ref_no: supplier.refNo || `SUP-${supplier.id.slice(-6)}`,
        support_email: "support@masshura.com",
        from_name: "Masshura Team",
        message: "We appreciate your interest in partnering with Masshura. After careful review, we are unable to proceed with your application at this time."
      };

      console.log('Sending rejection email with params:', templateParams);

      // Send rejection email
      const emailResult = await emailjs.send(REJECTION_SERVICE_ID, REJECTION_TEMPLATE_ID, templateParams);
      console.log('Rejection email sent successfully:', emailResult);

      toast({ 
        title: "Rejection Email Sent", 
        description: "Rejection notification has been sent to the company." 
      });

    } catch (emailError) {
      console.error("Rejection email sending failed:", emailError);
      toast({
        title: "Email Failed",
        description: `Company rejected but email failed: ${emailError.text || emailError.message || 'Unknown error'}`,
        variant: "destructive"
      });
    }
  };

  
  // New function to handle Accept status (different from approve)
  const handleAccept = async (supplierId: string) => {
    try {
      // Find the supplier data to get email and name
      const supplier = suppliers.find(s => s.id === supplierId);
      if (!supplier) {
        throw new Error('Supplier not found');
      }

      console.log('Starting acceptance process for:', { 
        supplierId, 
        supplierEmail: supplier.email, 
        supplierName: supplier.contactPerson || supplier.companyName 
      });

      // Validate email before proceeding
      if (!supplier.email || !supplier.email.includes('@')) {
        throw new Error('Invalid supplier email address');
      }

      // Step 1: Update the supplier's status in Firestore
      await updateDoc(doc(db, 'suppliers', supplierId), { 
        status: 'accepted',
        acceptedAt: new Date().toISOString()
      });
      console.log('Firestore update successful');
      
      updateSupplierStatusInState(supplierId, 'accepted', { acceptedAt: new Date().toISOString() });
      toast({ title: "Success", description: "Supplier has been accepted. They can now proceed to payment." });

      // Step 2: Send acceptance email using EmailJS (Account Setup Only)
      const YOUR_SERVICE_ID = "service_6qlid92";
      const YOUR_TEMPLATE_ID_1 = "template_h01qmqi";      // First template (Account Setup)
      const YOUR_PUBLIC_KEY = "v5gxhy3P54twB8u7I";

      // Validate EmailJS configuration
      if (!YOUR_SERVICE_ID || !YOUR_TEMPLATE_ID_1 || !YOUR_PUBLIC_KEY) {
        throw new Error('EmailJS configuration is missing');
      }

      // Initialize EmailJS with your public key first
      emailjs.init(YOUR_PUBLIC_KEY);

      // Construct the password link
      const setPasswordLink = `${window.location.origin}/set-password?email=${encodeURIComponent(supplier.email)}`;

      // Template parameters for acceptance email (Account Setup Only)
      const templateParams = {
        supplier_name: supplier.contactPerson || supplier.companyName,
        to_email: supplier.email,
        set_password_link: setPasswordLink,
        company_name: supplier.companyName,
        from_name: "Masshura Team"
      };

      console.log('Sending acceptance email with params:', templateParams);
      
      // Send acceptance email (Account Setup Only)
      const emailResult = await emailjs.send(YOUR_SERVICE_ID, YOUR_TEMPLATE_ID_1, templateParams);
      console.log('Acceptance email sent successfully:', emailResult);

      toast({ 
        title: "Email Sent", 
        description: "Acceptance email has been sent to the supplier." 
      });

    } catch (error) {
      console.error("Email send failed:", error);
      toast({
        title: "Email Failed",
        description: `Supplier accepted but email failed: ${error.text || error.message || 'Unknown error'}`,
        variant: "destructive"
      });
    }
  };

  // New function to handle Block status
  const handleBlock = async (supplierId: string) => {
    await updateDoc(doc(db, 'suppliers', supplierId), { 
      status: 'blocked',
      blockedAt: new Date().toISOString()
    });
    updateSupplierStatusInState(supplierId, 'blocked', { blockedAt: new Date().toISOString() });
    toast({ title: "Success", description: "Supplier has been blocked.", variant: "destructive" });
  };

  // Function to toggle active status
  const handleToggleActive = async (supplierId: string, currentActive: boolean) => {
    // Find the supplier to check their status
    const supplier = suppliers.find(s => s.id === supplierId);
    
    // Only allow toggling active status for approved suppliers
    if (supplier?.status !== 'approved') {
      toast({
        title: "Cannot Toggle Status",
        description: "Only approved companies can be activated/deactivated.",
        variant: "destructive"
      });
      return;
    }

    const newActiveStatus = !currentActive;
    await updateDoc(doc(db, 'suppliers', supplierId), { 
      isActive: newActiveStatus,
      lastActiveToggle: new Date().toISOString()
    });
    
    setSuppliers(currentSuppliers =>
      currentSuppliers.map(s => (s.id === supplierId ? { ...s, isActive: newActiveStatus } : s))
    );
    
    toast({ 
      title: "Success", 
      description: `Supplier ${newActiveStatus ? 'activated' : 'deactivated'} successfully.` 
    });
  };

  // Function to calculate expiry date (example: 1 year from acceptance)
  const calculateExpiryDate = (supplier: Supplier) => {
    if (supplier.acceptedAt && supplier.status === 'accepted') {
      const acceptedDate = new Date(supplier.acceptedAt);
      const expiryDate = new Date(acceptedDate);
      expiryDate.setFullYear(expiryDate.getFullYear() + 1); // 1 year validity
      return expiryDate.toLocaleDateString();
    }
    return 'N/A';
  };

  // New function to handle adding remarks
  const handleAddRemark = async () => {
    if (!selectedSupplier || !remark.trim()) {
      toast({ title: "Error", description: "Please enter a remark.", variant: "destructive" });
      return;
    }

    try {
      const currentRemarks = selectedSupplier.remarks || [];
      const newRemark = {
        text: remark.trim(),
        addedBy: 'Admin', // You can get actual admin name from auth context
        addedAt: new Date().toISOString(),
        id: Date.now() // Simple ID generation
      };
      
      const updatedRemarks = [...currentRemarks, newRemark];
      
      await updateDoc(doc(db, 'suppliers', selectedSupplier.id), { 
        remarks: updatedRemarks,
        lastRemarkAt: new Date().toISOString()
      });
      
      // Update local state
      setSuppliers(currentSuppliers =>
        currentSuppliers.map(s => 
          s.id === selectedSupplier.id 
            ? { ...s, remarks: updatedRemarks } 
            : s
        )
      );
      
      setRemark('');
      setIsRemarkDialogOpen(false);
      setSelectedSupplier(null);
      
      toast({ title: "Success", description: "Remark added successfully." });
    } catch (error) {
      console.error('Error adding remark:', error);
      toast({ title: "Error", description: "Failed to add remark.", variant: "destructive" });
    }
  };

  // New function to send login link
  const sendLoginLink = async () => {
    if (!loginLinkSupplier) return;

    try {
      const YOUR_SERVICE_ID = "service_6qlid92";
      const YOUR_TEMPLATE_ID = "template_h01qmqi"; // Using account setup template for login link
      const YOUR_PUBLIC_KEY = "v5gxhy3P54twB8u7I";

      // Validate EmailJS configuration
      if (!YOUR_SERVICE_ID || !YOUR_TEMPLATE_ID || !YOUR_PUBLIC_KEY) {
        throw new Error('EmailJS configuration is missing');
      }

      // Initialize EmailJS
      emailjs.init(YOUR_PUBLIC_KEY);

      // Construct the login/password setup link
      const loginLink = `${window.location.origin}/set-password?email=${encodeURIComponent(loginLinkSupplier.email)}`;

      // Template parameters for login link email
      const templateParams = {
        supplier_name: loginLinkSupplier.contactPerson || loginLinkSupplier.companyName,
        to_email: loginLinkSupplier.email,
        set_password_link: loginLink,
        company_name: loginLinkSupplier.companyName,
        from_name: "Masshura Admin Team",
        message: "Please use the link below to access your supplier portal and set up your password."
      };

      console.log('Sending login link email with params:', templateParams);

      // Send login link email
      const emailResult = await emailjs.send(YOUR_SERVICE_ID, YOUR_TEMPLATE_ID, templateParams);
      console.log('Login link email sent successfully:', emailResult);

      setIsLoginLinkDialogOpen(false);
      setLoginLinkSupplier(null);

      toast({ 
        title: "Login Link Sent", 
        description: "Login link has been sent to the supplier's email." 
      });

    } catch (error) {
      console.error("Login link email sending failed:", error);
      toast({
        title: "Email Failed",
        description: `Failed to send login link: ${error.message || 'Unknown error'}`,
        variant: "destructive"
      });
    }
  };

  // Helper function to get category display
  const getCategoryDisplay = (supplier: Supplier) => {
    // Handle both single category and categories array
    const categories = [];
    
    if (supplier.category && typeof supplier.category === 'string') {
      categories.push(supplier.category);
    }
    
    if (supplier.categories && Array.isArray(supplier.categories)) {
      categories.push(...supplier.categories);
    }
    
    // Remove duplicates and filter empty values
    const uniqueCategories = [...new Set(categories.filter(cat => cat && cat.trim()))];
    
    return uniqueCategories.length > 0 ? uniqueCategories : ['No categories'];
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        <span className="ml-3 text-slate-300">Loading companies...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Show filter results when using props */}
      {propSuppliers.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-400">
            Showing {filteredSuppliers.length} of {suppliers.length} companies
          </div>
        </div>
      )}

      {/* Companies Table */}
      <div className="bg-slate-800/60 rounded-lg border border-slate-600/50 shadow-sm overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto min-w-full">
          <Table className="min-w-[1200px]">
            <TableHeader>
              <TableRow className="bg-slate-700/50 border-slate-600/50">
                <TableHead className="font-semibold text-slate-200 w-12 whitespace-nowrap">Sl</TableHead>
                <TableHead className="font-semibold text-slate-200 w-20 whitespace-nowrap">Ref No</TableHead>
                <TableHead className="font-semibold text-slate-200 min-w-44 whitespace-nowrap">Company Name</TableHead>
                <TableHead className="font-semibold text-slate-200 w-28 whitespace-nowrap">Country</TableHead>
                <TableHead className="font-semibold text-slate-200 w-24 text-center whitespace-nowrap">Country Code</TableHead>
                <TableHead className="font-semibold text-slate-200 min-w-52 whitespace-nowrap">Email</TableHead>
                <TableHead className="font-semibold text-slate-200 min-w-40 whitespace-nowrap">Category</TableHead>
                <TableHead className="font-semibold text-slate-200 w-24 text-center whitespace-nowrap">Files</TableHead>
                <TableHead className="font-semibold text-slate-200 w-24 text-center whitespace-nowrap">Expiry Date</TableHead>
                <TableHead className="font-semibold text-slate-200 w-20 text-center whitespace-nowrap">Status</TableHead>
                <TableHead className="font-semibold text-slate-200 w-20 text-center whitespace-nowrap">Active</TableHead>
                <TableHead className="font-semibold text-slate-200 w-20 text-center whitespace-nowrap">Block</TableHead>
                <TableHead className="font-semibold text-slate-200 w-24 text-center whitespace-nowrap">Remarks</TableHead>
                <TableHead className="font-semibold text-slate-200 w-32 text-center whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>
          <TableBody>
            {paginatedSuppliers.map((supplier, index) => (
              <TableRow key={supplier.id} className="hover:bg-slate-700/30 transition-colors border-slate-600/30">
                <TableCell className="font-medium text-slate-200 whitespace-nowrap">
                  {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                </TableCell>
                <TableCell className="font-medium text-slate-200 whitespace-nowrap">
                  {supplier.refNo || `REF-${String(index + 1).padStart(3, '0')}`}
                </TableCell>
                <TableCell className="font-medium text-slate-200 whitespace-nowrap">{supplier.companyName}</TableCell>
                <TableCell className="text-slate-300 whitespace-nowrap">{supplier.country}</TableCell>
                <TableCell className="text-slate-300 whitespace-nowrap">
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-400/30 font-mono text-xs whitespace-nowrap">
                    {supplier.countryCode || 'N/A'}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-300 whitespace-nowrap max-w-52 truncate" title={supplier.email}>{supplier.email}</TableCell>
                <TableCell className="text-slate-300 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1 max-w-40">
                    {getCategoryDisplay(supplier).map((category, catIndex) => (
                      <Badge key={catIndex} variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-400/30 text-xs">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="flex gap-1">
                    {supplier.tradeLicense && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs border-blue-500/50 text-blue-400 hover:bg-blue-500/20 p-1 h-auto whitespace-nowrap"
                        onClick={() => {
                          if (supplier.tradeLicense.data) {
                            // Create blob URL for base64 data
                            const byteCharacters = atob(supplier.tradeLicense.data.split(',')[1]);
                            const byteNumbers = new Array(byteCharacters.length);
                            for (let i = 0; i < byteCharacters.length; i++) {
                              byteNumbers[i] = byteCharacters.charCodeAt(i);
                            }
                            const byteArray = new Uint8Array(byteNumbers);
                            const blob = new Blob([byteArray], { type: supplier.tradeLicense.fileType });
                            const url = URL.createObjectURL(blob);
                            window.open(url, '_blank');
                          } else if (supplier.tradeLicense.url) {
                            window.open(supplier.tradeLicense.url, '_blank');
                          }
                        }}
                        title={`View Trade License (${supplier.tradeLicense.fileName})`}
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        TL
                      </Button>
                    )}
                    {supplier.catalog && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs border-green-500/50 text-green-400 hover:bg-green-500/20 p-1 h-auto whitespace-nowrap"
                        onClick={() => {
                          if (supplier.catalog.data) {
                            // Create blob URL for base64 data
                            const byteCharacters = atob(supplier.catalog.data.split(',')[1]);
                            const byteNumbers = new Array(byteCharacters.length);
                            for (let i = 0; i < byteCharacters.length; i++) {
                              byteNumbers[i] = byteCharacters.charCodeAt(i);
                            }
                            const byteArray = new Uint8Array(byteNumbers);
                            const blob = new Blob([byteArray], { type: supplier.catalog.fileType });
                            const url = URL.createObjectURL(blob);
                            window.open(url, '_blank');
                          } else if (supplier.catalog.url) {
                            window.open(supplier.catalog.url, '_blank');
                          }
                        }}
                        title={`View Catalog (${supplier.catalog.fileName})`}
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Cat
                      </Button>
                    )}
                    {!supplier.tradeLicense && !supplier.catalog && (
                      <span className="text-slate-500 text-xs">-</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-slate-300 whitespace-nowrap text-xs">
                  {calculateExpiryDate(supplier)}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Badge 
                    variant={
                      supplier.status === 'accepted' ? 'default' : 
                      supplier.status === 'pending' ? 'secondary' : 
                      supplier.status === 'blocked' ? 'destructive' :
                      supplier.status === 'rejected' ? 'destructive' :
                      supplier.status === 'approved' ? 'default' : 
                      'secondary'
                    }
                    className={`text-xs whitespace-nowrap ${
                      supplier.status === 'accepted' ? 'bg-green-500/20 text-green-400 border-green-400/30' :
                      supplier.status === 'pending' ? 'bg-orange-500/20 text-orange-400 border-orange-400/30' :
                      supplier.status === 'blocked' ? 'bg-red-500/20 text-red-400 border-red-400/30' :
                      supplier.status === 'rejected' ? 'bg-red-500/20 text-red-400 border-red-400/30' :
                      supplier.status === 'approved' ? 'bg-blue-500/20 text-blue-400 border-blue-400/30' :
                      'bg-slate-500/20 text-slate-400 border-slate-400/30'
                    }`}
                  >
                    {supplier.status?.toUpperCase() || 'PENDING'}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <Button
                        size="sm"
                        variant={supplier.isActive !== false ? "default" : "secondary"}
                        onClick={() => handleToggleActive(supplier.id, supplier.isActive !== false)}
                        className={`transition-all duration-200 text-xs px-2 py-1 h-auto whitespace-nowrap ${
                          supplier.isActive !== false 
                            ? 'bg-green-600/90 hover:bg-green-600 text-white border-green-500 shadow-green-500/20' 
                            : 'bg-slate-600/90 hover:bg-slate-600 text-slate-300 border-slate-500 shadow-slate-500/20'
                        } shadow-lg hover:shadow-xl`}
                      >
                        {supplier.isActive !== false ? (
                          <>
                            <Power className="h-3 w-3 mr-1" />
                            On
                          </>
                        ) : (
                          <>
                            <PowerOff className="h-3 w-3 mr-1" />
                            Off
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="flex items-center justify-center">
                    {(supplier.status === 'accepted' || supplier.status === 'approved') && (
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleBlock(supplier.id)}
                        className="bg-red-600/90 hover:bg-red-600 text-white border-red-500 shadow-red-500/20 shadow-lg hover:shadow-xl transition-all duration-200 text-xs px-2 py-1 h-auto whitespace-nowrap"
                      >
                        <Shield className="h-3 w-3 mr-1" />
                        Block
                      </Button>
                    )}
                    {supplier.status === 'blocked' && (
                      <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-400/30 text-xs whitespace-nowrap">
                        <ShieldOff className="h-3 w-3 mr-1" />
                        Blocked
                      </Badge>
                    )}
                    {supplier.status === 'pending' && (
                      <span className="text-slate-500 text-xs italic whitespace-nowrap">Pending</span>
                    )}
                    {supplier.status === 'rejected' && (
                      <span className="text-slate-500 text-xs italic whitespace-nowrap">N/A</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-xs">
                      {supplier.remarks?.length || 0} remarks
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedSupplier(supplier);
                        setIsRemarkDialogOpen(true);
                      }}
                      className="h-7 w-7 p-0 border-slate-500 text-slate-300 hover:bg-slate-700/50"
                      title="Add/View Remarks"
                    >
                      <MessageSquare className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="flex items-center justify-center gap-1">
                    {supplier.status === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => handleAccept(supplier.id)}
                          className="bg-green-600/90 hover:bg-green-600 text-white border-green-500 shadow-green-500/20 shadow-lg hover:shadow-xl transition-all duration-200 text-xs px-2 py-1 h-auto whitespace-nowrap"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Accept
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleApprove(supplier.id, supplier.email, supplier.contactPerson || supplier.companyName)}
                          className="bg-blue-600/90 hover:bg-blue-600 text-white border-blue-500 shadow-blue-500/20 shadow-lg hover:shadow-xl transition-all duration-200 text-xs px-2 py-1 h-auto whitespace-nowrap"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleReject(supplier.id)}
                          className="bg-red-600/90 hover:bg-red-600 border-red-500 shadow-red-500/20 shadow-lg hover:shadow-xl transition-all duration-200 text-xs px-2 py-1 h-auto whitespace-nowrap"
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setLoginLinkSupplier(supplier);
                        setIsLoginLinkDialogOpen(true);
                      }}
                      className="border-slate-500 text-slate-300 hover:bg-slate-700/50 hover:text-slate-200 transition-all duration-200 text-xs px-2 py-1 h-auto whitespace-nowrap"
                      title="Send Login Link"
                      disabled={supplier.status !== 'approved'}
                    >
                      <Mail className="h-3 w-3 mr-1" />
                      Login
                    </Button>
                    <Button asChild variant="outline" size="sm" 
                      className="border-slate-500 text-slate-300 hover:bg-slate-700/50 hover:text-slate-200 transition-all duration-200 text-xs px-2 py-1 h-auto whitespace-nowrap"
                    >
                      <Link to={`/admin/supplier/${supplier.id}`}>
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>

        {/* Empty State */}
        {paginatedSuppliers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-slate-200 mb-2">No companies found</h3>
            <p className="text-slate-400">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-slate-400">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="border-slate-500 text-slate-300 hover:bg-slate-700/50"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="border-slate-500 text-slate-300 hover:bg-slate-700/50"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Remarks Dialog */}
      <Dialog open={isRemarkDialogOpen} onOpenChange={setIsRemarkDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-600 text-slate-100">
          <DialogHeader>
            <DialogTitle className="text-slate-100">
              Add Remark for {selectedSupplier?.companyName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Display existing remarks */}
            {selectedSupplier?.remarks && selectedSupplier.remarks.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-slate-300">Previous Remarks:</h4>
                <div className="max-h-32 overflow-y-auto space-y-2">
                  {selectedSupplier.remarks.map((remarkItem, index) => (
                    <div key={remarkItem.id || index} className="bg-slate-700/50 p-2 rounded text-xs">
                      <p className="text-slate-200">{remarkItem.text}</p>
                      <p className="text-slate-400 mt-1">
                        By {remarkItem.addedBy} on {new Date(remarkItem.addedAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Add new remark */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Add New Remark:</label>
              <Textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Enter your remark here..."
                className="bg-slate-700 border-slate-600 text-slate-100"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsRemarkDialogOpen(false);
                setRemark('');
                setSelectedSupplier(null);
              }}
              className="border-slate-600 text-slate-300"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddRemark}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!remark.trim()}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Add Remark
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Login Link Dialog */}
      <Dialog open={isLoginLinkDialogOpen} onOpenChange={setIsLoginLinkDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-600 text-slate-100">
          <DialogHeader>
            <DialogTitle className="text-slate-100">
              Send Login Link
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-slate-300">
              Send a login link to <strong>{loginLinkSupplier?.companyName}</strong> at{' '}
              <strong>{loginLinkSupplier?.email}</strong>?
            </p>
            <p className="text-sm text-slate-400">
              This will send an email with a link to set up their password and access the supplier portal.
            </p>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsLoginLinkDialogOpen(false);
                setLoginLinkSupplier(null);
              }}
              className="border-slate-600 text-slate-300"
            >
              Cancel
            </Button>
            <Button 
              onClick={sendLoginLink}
              className="bg-green-600 hover:bg-green-700"
            >
              <Send className="h-4 w-4 mr-2" />
              Send Login Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupplierList;