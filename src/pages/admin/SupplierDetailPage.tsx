// src/pages/admin/SupplierDetailPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../components/firebase';
import emailjs from '@emailjs/browser';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { 
  ArrowLeft, 
  Building, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  User, 
  Calendar,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Download,
  Star,
  Clock,
  Briefcase,
  Award,
  Target,
  Settings,
  Eye,
  CreditCard,
  DollarSign,
  CalendarDays,
  AlertCircle
} from 'lucide-react';

interface Supplier {
  id: string;
  companyName: string;
  tradeNumber: string;
  taxId: string;
  yearEstablished: string;
  employeeCount: string;
  contactPerson: string;
  position: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  businessType: string;
  products: string;
  experience: string;
  certifications: string;
  references: string;
  capacity: string;
  qualityStandards: string;
  additionalInfo: string;
  status?: 'pending' | 'approved' | 'rejected' | 'pending_review';
  refNo?: string;
  submittedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  profileUpdateRequested?: boolean;
  profileUpdateDate?: string;
  profileReapprovedAt?: string;
  notes?: string;
  // Payment-related fields
  paymentStatus?: string;
  paymentDate?: string;
  paymentAmount?: number;
  paymentMethod?: string;
  paymentId?: string;
  subscriptionExpiryDate?: string;
  subscriptionDuration?: number;
  subscriptionAmount?: number;
  registrationAmount?: number;
  uploadedDocuments?: Array<{ 
    url: string; 
    name: string; 
    asset_id: string; 
    public_id: string;
    secure_url?: string; // Optional secure URL for Cloudinary
    resource_type?: string; // Resource type from Cloudinary
    format?: string; // File format
    uploaded_at?: string; // Upload timestamp
    file_size?: number; // File size in bytes
    url_fallback?: string; // Fallback URL
  }>; // Added for file management
}

const SupplierDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchSupplier = async () => {
      if (!id) return;
      try {
        console.log('Fetching supplier with ID:', id);
        const supplierDocRef = doc(db, 'suppliers', id);
        const docSnap = await getDoc(supplierDocRef);

        if (docSnap.exists()) {
          const supplierData = { id: docSnap.id, ...docSnap.data() } as Supplier;
          console.log('Supplier data found:', supplierData);
          setSupplier(supplierData);
        } else {
          console.log('No supplier found with ID:', id);
          toast({
            title: "Error",
            description: "Supplier not found.",
            variant: "destructive",
          });
          navigate('/admin');
        }
      } catch (error) {
        console.error('Error fetching supplier:', error);
        toast({
          title: "Error",
          description: "Failed to fetch supplier details.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSupplier();
  }, [id, navigate]);

  const updateSupplierStatus = async (status: 'approved' | 'rejected') => {
    if (!supplier) return;
    
    setIsUpdating(true);
    try {
      const supplierRef = doc(db, 'suppliers', supplier.id);
      const updateData: any = {
        status,
        [`${status}At`]: new Date().toISOString(),
      };

      // If approving, also activate the supplier and clear profile update flags
      if (status === 'approved') {
        updateData.isActive = true;
        // Clear profile update flags when re-approving
        updateData.profileUpdateRequested = false;
        updateData.profileReapprovedAt = new Date().toISOString();
      }

      await updateDoc(supplierRef, updateData);
      
      setSupplier(prev => prev ? { ...prev, ...updateData } : null);
      
      // Send emails based on status and context
      if (status === 'approved') {
        // Check if this was a profile update re-approval
        const isProfileUpdate = supplier.status === 'pending_review';
        if (!isProfileUpdate) {
          // Only send emails for initial approvals, not profile update re-approvals
          await sendApprovalEmails();
        }
      } else if (status === 'rejected') {
        await sendRejectionEmail();
      }
      
      const actionText = supplier.status === 'pending_review' ? 'Profile changes approved' : `${status}`;
      toast({
        title: "Success",
        description: `${supplier.companyName} has been ${actionText} successfully.`,
      });
    } catch (error) {
      console.error('Error updating supplier status:', error);
      toast({
        title: "Error",
        description: `Failed to ${status} supplier. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const sendApprovalEmails = async () => {
    if (!supplier) return;

    try {
      // EmailJS configuration
      const YOUR_SERVICE_ID = "service_6qlid92";
      const YOUR_TEMPLATE_ID = "template_4up1wxm";    // Welcome/Instructions template only
      const YOUR_PUBLIC_KEY = "v5gxhy3P54twB8u7I";

      // Validate EmailJS configuration
      if (!YOUR_SERVICE_ID || !YOUR_TEMPLATE_ID || !YOUR_PUBLIC_KEY) {
        throw new Error('EmailJS configuration is missing');
      }

      // Validate email before proceeding
      if (!supplier.email || !supplier.email.includes('@')) {
        throw new Error('Invalid supplier email address');
      }

      // Initialize EmailJS
      emailjs.init(YOUR_PUBLIC_KEY);

      // Construct the password setup link
      const setPasswordLink = `${window.location.origin}/set-password?email=${encodeURIComponent(supplier.email)}`;

      // Template parameters for welcome email (Welcome/Instructions)
      const templateParams = {
        supplier_name: supplier.contactPerson || supplier.companyName,
        to_email: supplier.email,
        company_name: supplier.companyName,
        ref_no: supplier.refNo || `SUP-${supplier.id.slice(-6)}`,
        acceptance_date: new Date().toLocaleDateString(),
        portal_link: `${window.location.origin}/supplier-portal`,
        set_password_link: setPasswordLink,
        support_email: "support@masshura.com",
        from_name: "Masshura Team",
        message: "Welcome to Masshura! Your supplier application has been approved.",
        image_url: 'https://res.cloudinary.com/domqsb9le/image/upload/v1755354236/qb3gw7akfhcldpn4wtrz.png'
      };

      // Template parameters for second email (Welcome/Instructions)
      const templateParams2 = {
        supplier_name: supplier.contactPerson || supplier.companyName,
        to_email: supplier.email,
        company_name: supplier.companyName,
        ref_no: supplier.refNo || `SUP-${supplier.id.slice(-6)}`,
        acceptance_date: new Date().toLocaleDateString(),
        portal_link: `${window.location.origin}/supplier-portal`,
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
        description: "Approval welcome email has been sent to the supplier." 
      });

    } catch (emailError) {
      console.error("Approval email sending failed:", emailError);
      
      toast({
        title: "Email Failed",
        description: `Could not send welcome email. Error: ${emailError.text || emailError.message || 'Unknown error'}`,
        variant: "destructive"
      });
    }
  };

  const sendRejectionEmail = async () => {
    if (!supplier) return;

    try {
      const REJECTION_SERVICE_ID = "service_gcr919g";
      const REJECTION_TEMPLATE_ID = "template_zhrmd5l";
      const REJECTION_PUBLIC_KEY = "_r7BfwEM87Padmulp";

      // Validate EmailJS configuration
      if (!REJECTION_SERVICE_ID || !REJECTION_TEMPLATE_ID || !REJECTION_PUBLIC_KEY) {
        console.warn('Rejection EmailJS configuration is missing, skipping email');
        return;
      }

      // Validate email before proceeding
      if (!supplier.email || !supplier.email.includes('@')) {
        throw new Error('Invalid supplier email address');
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
        description: "Rejection notification has been sent to the supplier." 
      });

    } catch (emailError) {
      console.error("Rejection email sending failed:", emailError);
      toast({
        title: "Email Failed",
        description: `Supplier rejected but email failed: ${emailError.text || emailError.message || 'Unknown error'}`,
        variant: "destructive"
      });
    }
  };

  const deleteSupplier = async () => {
    if (!supplier) return;
    
    const confirmed = window.confirm(
      `Are you sure you want to delete ${supplier.companyName}?\n\nThis action cannot be undone and will permanently remove all supplier data.`
    );
    
    if (!confirmed) return;

    setIsUpdating(true);
    try {
      await deleteDoc(doc(db, 'suppliers', supplier.id));
      toast({
        title: "Success",
        description: `${supplier.companyName} deleted successfully.`,
      });
      navigate('/admin');
    } catch (error) {
      console.error('Error deleting supplier:', error);
      toast({
        title: "Error",
        description: "Failed to delete supplier. Please try again.",
        variant: "destructive",
      });
      setIsUpdating(false);
    }
  };

  const exportToPDF = () => {
    toast({
      title: "Export Feature",
      description: "PDF export functionality will be implemented soon.",
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'pending_review': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'pending_review': return <Edit className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building },
    { id: 'contact', label: 'Contact Info', icon: User },
    { id: 'business', label: 'Business Details', icon: Briefcase },
    { id: 'payment', label: 'Payment & Subscription', icon: CreditCard },
    { id: 'additional', label: 'Additional Info', icon: FileText },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="pt-20 pb-8">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full mb-4"
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-white font-medium"
              >
                Loading company details...
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-slate-400 text-sm mt-2"
              >
                Please wait while we fetch the information
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="pt-20 pb-8">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-12">
              <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Supplier Not Found</h2>
              <p className="text-slate-400 mb-6">The supplier you're looking for doesn't exist or has been removed.</p>
              <Button 
                onClick={() => navigate('/admin')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Add top padding to account for navbar */}
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8"
          >
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => navigate('/admin')}
                variant="outline" 
                className="bg-slate-800/50 border-slate-600 text-white hover:bg-slate-700/50"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white">{supplier.companyName || 'Unnamed Company'}</h1>
                <p className="text-slate-400">Supplier Details & Management</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge className={`px-3 py-1 ${getStatusColor(supplier.status)}`}>
                {getStatusIcon(supplier.status)}
                <span className="ml-2 capitalize">{supplier.status || 'pending'}</span>
              </Badge>
              {supplier.refNo && (
                <Badge className="bg-slate-700/50 text-slate-300 border-slate-600">
                  #{supplier.refNo}
                </Badge>
              )}
            </div>
          </motion.div>

        {/* Profile Update Notification */}
        {supplier.status === 'pending_review' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center">
                <Edit className="w-5 h-5 text-orange-400 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-orange-400 font-semibold">Profile Update Pending Review</h3>
                  <p className="text-slate-300 text-sm mt-1">
                    This supplier has updated their profile and is waiting for admin approval.
                    {supplier.profileUpdateDate && (
                      <span className="text-orange-400"> Updated on {new Date(supplier.profileUpdateDate).toLocaleDateString()}</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-3 mb-8"
        >
          {supplier.status !== 'approved' && (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => updateSupplierStatus('approved')}
                disabled={isUpdating}
                className="bg-green-600 hover:bg-green-700 text-white shadow-lg"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                {isUpdating ? 'Approving...' : (supplier.status === 'pending_review' ? 'Approve Profile Changes' : 'Approve')}
              </Button>
            </motion.div>
          )}
          
          {supplier.status !== 'rejected' && (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => updateSupplierStatus('rejected')}
                disabled={isUpdating}
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10 shadow-lg"
              >
                <XCircle className="mr-2 h-4 w-4" />
                {isUpdating ? 'Rejecting...' : 'Reject'}
              </Button>
            </motion.div>
          )}
          
          
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={deleteSupplier}
              disabled={isUpdating}
              variant="outline"
              className="border-red-500/50 text-red-400 hover:bg-red-500/10 shadow-lg"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {isUpdating ? 'Deleting...' : 'Delete'}
            </Button>
          </motion.div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2 p-1 bg-slate-800/50 rounded-lg border border-slate-700/50">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 flex-1 sm:flex-none ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Company Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="lg:col-span-2"
                >
                  <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Building className="w-5 h-5 text-blue-400" />
                        Company Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div whileHover={{ scale: 1.02 }} className="p-3 bg-slate-700/20 rounded-lg">
                          <label className="text-sm font-medium text-slate-400">Company Name</label>
                          <p className="text-white font-medium">{supplier.companyName}</p>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.02 }} className="p-3 bg-slate-700/20 rounded-lg">
                          <label className="text-sm font-medium text-slate-400">Business Type</label>
                          <p className="text-white">{supplier.businessType || 'N/A'}</p>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.02 }} className="p-3 bg-slate-700/20 rounded-lg">
                          <label className="text-sm font-medium text-slate-400">Employee Count</label>
                          <p className="text-white">{supplier.employeeCount || 'N/A'}</p>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.02 }} className="p-3 bg-slate-700/20 rounded-lg">
                          <label className="text-sm font-medium text-slate-400">Business Registration</label>
                          <p className="text-white">{supplier.tradeNumber || 'N/A'}</p>
                        </motion.div>
                      </div>
                      
                      {supplier.products && (
                        <motion.div whileHover={{ scale: 1.01 }} className="p-4 bg-slate-700/20 rounded-lg">
                          <label className="text-sm font-medium text-slate-400">Products & Services</label>
                          <p className="text-white mt-1">{supplier.products}</p>
                        </motion.div>
                      )}
                      
                      {supplier.experience && (
                        <motion.div whileHover={{ scale: 1.01 }} className="p-4 bg-slate-700/20 rounded-lg">
                          <label className="text-sm font-medium text-slate-400">Experience</label>
                          <p className="text-white mt-1">{supplier.experience}</p>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Status & Timeline */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-400" />
                        Status & Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        {supplier.submittedAt && (
                          <motion.div 
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/40 transition-colors"
                          >
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <div>
                              <p className="text-white text-sm font-medium">Submitted</p>
                              <p className="text-slate-400 text-xs">
                                {new Date(supplier.submittedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </motion.div>
                        )}
                        
                        {supplier.approvedAt && (
                          <motion.div 
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/40 transition-colors"
                          >
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <div>
                              <p className="text-white text-sm font-medium">Approved</p>
                              <p className="text-slate-400 text-xs">
                                {new Date(supplier.approvedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </motion.div>
                        )}
                        
                        {supplier.rejectedAt && (
                          <motion.div 
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/40 transition-colors"
                          >
                            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                            <div>
                              <p className="text-white text-sm font-medium">Rejected</p>
                              <p className="text-slate-400 text-xs">
                                {new Date(supplier.rejectedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </motion.div>
                        )}

                        {supplier.paymentDate && (
                          <motion.div 
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/40 transition-colors"
                          >
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <div>
                              <p className="text-white text-sm font-medium">Payment Completed</p>
                              <p className="text-slate-400 text-xs">
                                {new Date(supplier.paymentDate).toLocaleDateString()} - ₹{supplier.paymentAmount || 'N/A'}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {/* Quick Payment & Subscription Summary */}
                      {(supplier.paymentStatus || supplier.subscriptionExpiryDate) && (
                        <div className="pt-4 border-t border-slate-600/30">
                          <div className="grid grid-cols-1 gap-3">
                            {supplier.paymentStatus && (
                              <div className="flex items-center justify-between p-3 bg-slate-700/20 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <CreditCard className="w-4 h-4 text-green-400" />
                                  <span className="text-slate-300 text-sm">Payment Status</span>
                                </div>
                                <Badge 
                                  variant={supplier.paymentStatus === 'completed' ? 'default' : 'secondary'}
                                  className={`${
                                    supplier.paymentStatus === 'completed' 
                                      ? 'bg-green-600/20 text-green-400 border-green-600/30' 
                                      : 'bg-orange-600/20 text-orange-400 border-orange-600/30'
                                  }`}
                                >
                                  {supplier.paymentStatus === 'completed' ? 'Completed' : supplier.paymentStatus || 'Pending'}
                                </Badge>
                              </div>
                            )}

                            {supplier.subscriptionExpiryDate && (
                              <div className="flex items-center justify-between p-3 bg-slate-700/20 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <CalendarDays className="w-4 h-4 text-purple-400" />
                                  <span className="text-slate-300 text-sm">Subscription</span>
                                </div>
                                <div className="text-right">
                                  {(() => {
                                    const expiryDate = new Date(supplier.subscriptionExpiryDate);
                                    const now = new Date();
                                    const daysRemaining = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                                    const isExpired = daysRemaining <= 0;
                                    const isExpiringSoon = daysRemaining <= 30 && daysRemaining > 0;

                                    return (
                                      <Badge 
                                        variant="secondary"
                                        className={`${
                                          isExpired 
                                            ? 'bg-red-600/20 text-red-400 border-red-600/30' 
                                            : isExpiringSoon
                                            ? 'bg-orange-600/20 text-orange-400 border-orange-600/30'
                                            : 'bg-green-600/20 text-green-400 border-green-600/30'
                                        }`}
                                      >
                                        {isExpired 
                                          ? 'Expired'
                                          : isExpiringSoon
                                          ? `${daysRemaining}d left`
                                          : `${daysRemaining}d left`
                                        }
                                      </Badge>
                                    );
                                  })()}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {supplier.notes && (
                        <div className="pt-4 border-t border-slate-700/50">
                          <label className="text-sm font-medium text-slate-400">Admin Notes</label>
                          <div className="p-3 bg-slate-700/20 rounded-lg mt-2">
                            <p className="text-white text-sm">{supplier.notes}</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            )}

            {activeTab === 'contact' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-400" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <motion.div whileHover={{ scale: 1.02 }} className="p-3 bg-slate-700/20 rounded-lg">
                          <label className="text-sm font-medium text-slate-400">Contact Person</label>
                          <p className="text-white font-medium">{supplier.contactPerson|| 'N/A'}</p>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-3 p-3 bg-slate-700/20 rounded-lg">
                          <Mail className="w-4 h-4 text-blue-400" />
                          <div className="flex-1">
                            <label className="text-sm font-medium text-slate-400">Email</label>
                            {supplier.email ? (
                              <a 
                                href={`mailto:${supplier.email}`}
                                className="text-blue-400 hover:text-blue-300 transition-colors block"
                              >
                                {supplier.email}
                              </a>
                            ) : (
                              <p className="text-white">N/A</p>
                            )}
                          </div>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-3 p-3 bg-slate-700/20 rounded-lg">
                          <Phone className="w-4 h-4 text-blue-400" />
                          <div className="flex-1">
                            <label className="text-sm font-medium text-slate-400">Phone</label>
                            {supplier.phone ? (
                              <a 
                                href={`tel:${supplier.phone}`}
                                className="text-blue-400 hover:text-blue-300 transition-colors block"
                              >
                                {supplier.phone}
                              </a>
                            ) : (
                              <p className="text-white">N/A</p>
                            )}
                          </div>
                        </motion.div>
                      </div>
                      
                      <div className="space-y-4">
                        {supplier.website && (
                          <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-3 p-3 bg-slate-700/20 rounded-lg">
                            <Globe className="w-4 h-4 text-blue-400" />
                            <div className="flex-1">
                              <label className="text-sm font-medium text-slate-400">Website</label>
                              <a 
                                href={supplier.website.startsWith('http') ? supplier.website : `https://${supplier.website}`}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 transition-colors block"
                              >
                                {supplier.website}
                              </a>
                            </div>
                          </motion.div>
                        )}
                        
                        {supplier.address && (
                          <motion.div whileHover={{ scale: 1.02 }} className="flex items-start gap-3 p-3 bg-slate-700/20 rounded-lg">
                            <MapPin className="w-4 h-4 text-blue-400 mt-1" />
                            <div className="flex-1">
                              <label className="text-sm font-medium text-slate-400">Address</label>
                              <p className="text-white">{supplier.address}</p>
                            </div>
                          </motion.div>
                        )}
                        
                        {!supplier.website && !supplier.address && (
                          <motion.div className="p-6 bg-slate-700/10 rounded-lg border border-slate-600/30 text-center">
                            <p className="text-slate-400">No additional contact information available</p>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === 'business' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-blue-400" />
                      Business Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {supplier.businessType && (
                      <div>
                        <label className="text-sm font-medium text-slate-400">Business Type</label>
                        <p className="text-white">{supplier.businessType}</p>
                      </div>
                    )}
                    
                    {supplier.capacity && (
                      <div>
                        <label className="text-sm font-medium text-slate-400">Production Capacity</label>
                        <p className="text-white">{supplier.capacity}</p>
                      </div>
                    )}
                    
                    {supplier.qualityStandards && (
                      <div>
                        <label className="text-sm font-medium text-slate-400">Quality Standards</label>
                        <p className="text-white">{supplier.qualityStandards}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Award className="w-5 h-5 text-blue-400" />
                      Certifications & References
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {supplier.certifications && (
                      <div>
                        <label className="text-sm font-medium text-slate-400">Certifications</label>
                        <p className="text-white">{supplier.certifications}</p>
                      </div>
                    )}
                    
                    {supplier.references && (
                      <div>
                        <label className="text-sm font-medium text-slate-400">References</label>
                        <p className="text-white">{supplier.references}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="space-y-6">
                {/* Payment Information */}
                <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-green-400" />
                      Payment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-slate-400">Payment Status</label>
                        <div className="mt-2">
                          <Badge 
                            variant={supplier.paymentStatus === 'completed' ? 'default' : 'secondary'}
                            className={`${
                              supplier.paymentStatus === 'completed' 
                                ? 'bg-green-600/20 text-green-400 border-green-600/30' 
                                : 'bg-orange-600/20 text-orange-400 border-orange-600/30'
                            }`}
                          >
                            {supplier.paymentStatus === 'completed' ? 'Completed' : supplier.paymentStatus || 'Pending'}
                          </Badge>
                        </div>
                      </div>

                      {supplier.paymentDate && (
                        <div>
                          <label className="text-sm font-medium text-slate-400">Payment Date</label>
                          <p className="text-white flex items-center gap-2 mt-2">
                            <Calendar className="w-4 h-4 text-blue-400" />
                            {new Date(supplier.paymentDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      )}

                      {supplier.paymentAmount && (
                        <div>
                          <label className="text-sm font-medium text-slate-400">Total Payment Amount</label>
                          <p className="text-white flex items-center gap-2 mt-2">
                            <DollarSign className="w-4 h-4 text-green-400" />
                            ₹{supplier.paymentAmount}
                          </p>
                        </div>
                      )}

                      {supplier.registrationAmount && (
                        <div>
                          <label className="text-sm font-medium text-slate-400">Registration Fee</label>
                          <p className="text-white flex items-center gap-2 mt-2">
                            <DollarSign className="w-4 h-4 text-blue-400" />
                            ₹{supplier.registrationAmount}
                          </p>
                        </div>
                      )}

                      {supplier.paymentMethod && (
                        <div>
                          <label className="text-sm font-medium text-slate-400">Payment Method</label>
                          <p className="text-white flex items-center gap-2 mt-2">
                            <CreditCard className="w-4 h-4 text-blue-400" />
                            {supplier.paymentMethod.charAt(0).toUpperCase() + supplier.paymentMethod.slice(1)}
                          </p>
                        </div>
                      )}

                      {supplier.paymentId && (
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-slate-400">Payment ID</label>
                          <p className="text-white font-mono text-sm mt-2 bg-slate-700/30 p-2 rounded">{supplier.paymentId}</p>
                        </div>
                      )}

                      {/* Payment Breakdown */}
                      {(supplier.registrationAmount || supplier.subscriptionAmount) && (
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-slate-400">Payment Breakdown</label>
                          <div className="mt-2 bg-slate-700/30 rounded-lg p-4 space-y-2">
                            {supplier.registrationAmount && (
                              <div className="flex justify-between items-center">
                                <span className="text-slate-300">Registration Fee:</span>
                                <span className="text-white font-medium">₹{supplier.registrationAmount}</span>
                              </div>
                            )}
                            {supplier.subscriptionAmount && (
                              <div className="flex justify-between items-center">
                                <span className="text-slate-300">
                                  Subscription ({supplier.subscriptionDuration || 1} year{(supplier.subscriptionDuration || 1) > 1 ? 's' : ''}):
                                </span>
                                <span className="text-white font-medium">₹{supplier.subscriptionAmount}</span>
                              </div>
                            )}
                            {supplier.paymentAmount && (
                              <>
                                <hr className="border-slate-600" />
                                <div className="flex justify-between items-center font-semibold">
                                  <span className="text-white">Total Amount:</span>
                                  <span className="text-green-400">₹{supplier.paymentAmount}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Subscription Information */}
                <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <CalendarDays className="w-5 h-5 text-purple-400" />
                      Subscription Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {supplier.subscriptionExpiryDate && (
                        <div>
                          <label className="text-sm font-medium text-slate-400">Subscription Expires</label>
                          <div className="mt-2">
                            {(() => {
                              const expiryDate = new Date(supplier.subscriptionExpiryDate);
                              const now = new Date();
                              const daysRemaining = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                              const isExpired = daysRemaining <= 0;
                              const isExpiringSoon = daysRemaining <= 30 && daysRemaining > 0;

                              return (
                                <div className="space-y-2">
                                  <p className="text-white flex items-center gap-2">
                                    <CalendarDays className="w-4 h-4 text-purple-400" />
                                    {expiryDate.toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })}
                                  </p>
                                  <Badge 
                                    variant="secondary"
                                    className={`${
                                      isExpired 
                                        ? 'bg-red-600/20 text-red-400 border-red-600/30' 
                                        : isExpiringSoon
                                        ? 'bg-orange-600/20 text-orange-400 border-orange-600/30'
                                        : 'bg-green-600/20 text-green-400 border-green-600/30'
                                    }`}
                                  >
                                    {isExpired 
                                      ? `Expired ${Math.abs(daysRemaining)} days ago`
                                      : isExpiringSoon
                                      ? `Expires in ${daysRemaining} days`
                                      : `${daysRemaining} days remaining`
                                    }
                                  </Badge>
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      )}

                      {supplier.subscriptionDuration && (
                        <div>
                          <label className="text-sm font-medium text-slate-400">Subscription Duration</label>
                          <p className="text-white flex items-center gap-2 mt-2">
                            <Clock className="w-4 h-4 text-blue-400" />
                            {supplier.subscriptionDuration} {supplier.subscriptionDuration === 1 ? 'Year' : 'Years'}
                          </p>
                        </div>
                      )}

                      {supplier.subscriptionAmount && (
                        <div>
                          <label className="text-sm font-medium text-slate-400">Subscription Amount</label>
                          <p className="text-white flex items-center gap-2 mt-2">
                            <DollarSign className="w-4 h-4 text-green-400" />
                            ₹{supplier.subscriptionAmount}
                          </p>
                        </div>
                      )}

                      {supplier.submittedAt && (
                        <div>
                          <label className="text-sm font-medium text-slate-400">Registration Date</label>
                          <p className="text-white flex items-center gap-2 mt-2">
                            <Calendar className="w-4 h-4 text-blue-400" />
                            {new Date(supplier.submittedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Renewal Warning */}
                    {supplier.subscriptionExpiryDate && (() => {
                      const expiryDate = new Date(supplier.subscriptionExpiryDate);
                      const now = new Date();
                      const daysRemaining = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                      const isExpiringSoon = daysRemaining <= 30 && daysRemaining > 0;
                      const isExpired = daysRemaining <= 0;

                      if (isExpired || isExpiringSoon) {
                        return (
                          <div className={`p-4 rounded-lg border ${
                            isExpired 
                              ? 'bg-red-600/10 border-red-600/30' 
                              : 'bg-orange-600/10 border-orange-600/30'
                          }`}>
                            <div className="flex items-start gap-3">
                              <AlertCircle className={`w-5 h-5 mt-0.5 ${
                                isExpired ? 'text-red-400' : 'text-orange-400'
                              }`} />
                              <div>
                                <h4 className={`font-medium ${
                                  isExpired ? 'text-red-300' : 'text-orange-300'
                                }`}>
                                  {isExpired ? 'Subscription Expired' : 'Subscription Expiring Soon'}
                                </h4>
                                <p className="text-slate-300 text-sm mt-1">
                                  {isExpired 
                                    ? `This supplier's subscription expired ${Math.abs(daysRemaining)} days ago. They may need to renew to continue accessing the platform.`
                                    : `This supplier's subscription will expire in ${daysRemaining} days. Consider reaching out about renewal options.`
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'additional' && (
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    Additional Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {supplier.additionalInfo && (
                    <div>
                      <label className="text-sm font-medium text-slate-400">Additional Information</label>
                      <div className="mt-2 p-4 bg-slate-700/30 rounded-lg">
                        <p className="text-white whitespace-pre-wrap">{supplier.additionalInfo}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-slate-400">Record ID</label>
                      <p className="text-white font-mono text-sm">{supplier.id}</p>
                    </div>
                    
                    {supplier.refNo && (
                      <div>
                        <label className="text-sm font-medium text-slate-400">Reference Number</label>
                        <p className="text-white font-mono text-sm">{supplier.refNo}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Uploaded Documents Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="xl:col-span-2"
          >
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-400" />
                  Uploaded Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                {supplier.uploadedDocuments && supplier.uploadedDocuments.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-slate-400 text-sm mb-4">
                      Found {supplier.uploadedDocuments.length} uploaded document(s)
                    </p>
                    {supplier.uploadedDocuments.map((doc, index) => {
                      console.log('Rendering document:', doc); // Debug log
                      return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/30 hover:border-slate-500/50 transition-all duration-200"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg flex items-center justify-center border border-green-500/20">
                            <FileText className="w-5 h-5 text-green-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">{doc.name || 'Unknown file'}</p>
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                              <span>Document uploaded by supplier</span>
                              {doc.url ? (
                                doc.url.includes('cloudinary.com') ? (
                                  <span className="text-green-400">• Cloudinary hosted</span>
                                ) : (
                                  <span className="text-blue-400">• External link</span>
                                )
                              ) : (
                                <span className="text-red-400">• URL missing</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={async () => {
                              console.log('Opening document:', doc.url);
                              if (doc.url) {
                                try {
                                  // For Cloudinary URLs, try to construct a more reliable URL
                                  let urlToOpen = doc.url;
                                  
                                  // If it's a Cloudinary URL, try multiple URL variants
                                  if (doc.url.includes('cloudinary.com')) {
                                    // Try secure URL first
                                    if (doc.secure_url) {
                                      urlToOpen = doc.secure_url;
                                    }
                                    
                                    console.log('Using Cloudinary URL:', urlToOpen);
                                    
                                    // For Cloudinary, try opening directly without pre-flight check
                                    // as CORS might block HEAD requests but allow GET requests
                                    window.open(urlToOpen, '_blank', 'noopener,noreferrer');
                                    
                                  } else {
                                    // For non-Cloudinary URLs, do a quick check
                                    try {
                                      const response = await fetch(doc.url, { 
                                        method: 'HEAD',
                                        mode: 'no-cors' // This bypasses CORS for the check
                                      });
                                      window.open(doc.url, '_blank', 'noopener,noreferrer');
                                    } catch (error) {
                                      console.log('Pre-flight check failed, trying direct access:', error);
                                      window.open(doc.url, '_blank', 'noopener,noreferrer');
                                    }
                                  }
                                  
                                } catch (error) {
                                  console.error('Error accessing document:', error);
                                  // Always try opening as a fallback
                                  window.open(doc.url, '_blank', 'noopener,noreferrer');
                                }
                              } else {
                                console.error('Document URL is missing');
                                alert('Document URL is not available');
                              }
                            }}
                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                          >
                            <Eye className="w-4 h-4" />
                            <span className="hidden sm:inline ml-2">View</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={async () => {
                              console.log('Downloading document:', doc.url, doc.name);
                              if (doc.url) {
                                try {
                                  // For Cloudinary URLs, skip the pre-flight check and try direct download
                                  let downloadUrl = doc.url;
                                  
                                  if (doc.url.includes('cloudinary.com')) {
                                    // Use secure URL if available for Cloudinary
                                    if (doc.secure_url) {
                                      downloadUrl = doc.secure_url;
                                    }
                                    
                                    console.log('Using Cloudinary download URL:', downloadUrl);
                                  }
                                  
                                  // Create a temporary anchor element to trigger download
                                  const link = document.createElement('a');
                                  link.href = downloadUrl;
                                  link.download = doc.name || 'document';
                                  link.target = '_blank';
                                  link.rel = 'noopener noreferrer';
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                  
                                } catch (error) {
                                  console.error('Error downloading document:', error);
                                  // Try opening in new tab as fallback
                                  window.open(doc.url, '_blank', 'noopener,noreferrer');
                                }
                              } else {
                                console.error('Document URL is missing');
                                alert('Document URL is not available');
                              }
                            }}
                            className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                          >
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline ml-2">Download</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // Copy URL to clipboard for manual inspection
                              if (doc.url) {
                                navigator.clipboard.writeText(doc.url).then(() => {
                                  alert('Document URL copied to clipboard');
                                }).catch(() => {
                                  prompt('Copy this URL manually:', doc.url);
                                });
                              }
                            }}
                            className="text-slate-400 hover:text-slate-300 hover:bg-slate-500/10"
                            title="Copy URL to clipboard"
                          >
                            <Globe className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-slate-700/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-slate-500" />
                    </div>
                    <p className="text-slate-400 font-medium">No documents uploaded</p>
                    <p className="text-slate-500 text-sm mt-1">This supplier hasn't uploaded any documents yet.</p>
                    <div className="mt-4 p-4 bg-slate-800/30 rounded-lg border border-slate-600/30">
                      <p className="text-slate-400 text-xs">
                        <strong>Troubleshooting:</strong> If documents should be here but aren't showing:
                      </p>
                      <ul className="text-slate-500 text-xs mt-2 space-y-1 text-left">
                        <li>• Check if uploadedDocuments field exists in Firestore</li>
                        <li>• Verify Cloudinary upload was successful</li>
                        <li>• Ensure document URLs are valid and accessible</li>
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SupplierDetailPage;
