// src/pages/supplier/SupplierDashboard.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import axios from 'axios'; // For making the upload request
import { auth, db } from '../../components/firebase';
import { useToast } from "@/hooks/use-toast";
import { motion } from 'framer-motion';
import { 
  Building, 
  Mail, 
  Phone,
  Globe, 
  MapPin, 
  Calendar, 
  Settings, 
  LogOut, 
  Edit, 
  Save, 
  X, 
  Shield,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  UploadCloud,
  File,
  Trash2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Defines the structure for a supplier object for type safety
interface SupplierData {
  id: string;
  companyName?: string;
  country?: string;
  emirate?: string;
  email?: string;
  status?: string;
  paymentStatus?: string;
  selectedSubscriptionPlan?: {
    id: string;
    label: string;
    price: number;
    duration: number;
  };
  subscriptionDuration?: number;
  subscriptionExpiryDate?: string;
  phone?: string;
  website?: string;
  contactPerson?: string;
  businessType?: string;
  yearsOfOperation?: string;
  employeeCount?: string;
  accountCreatedAt?: string;
  submittedAt?: string;
  createdAt?: string;
  lastUpdated?: string;
  uploadedDocuments?: any[]; // To hold the list of uploaded files
  [key: string]: any;
}

const SupplierDashboard = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [supplier, setSupplier] = useState<SupplierData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  // State for file uploads
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Add this function to calculate expiry date
  const calculateExpiryDate = (createdAt: string, duration: number) => {
    const startDate = new Date(createdAt);
    const expiryDate = new Date(startDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + duration);
    return expiryDate;
  };

  // Function to send payment success email
  const sendPaymentSuccessEmail = async (amount: number) => {
    if (!supplier) return;
    
    try {
      const templateParams = {
        supplier_name: supplier.companyName,
        to_email: supplier.email,
        payment_amount: `₹${amount}`,
        company_name: supplier.companyName,
        payment_date: new Date().toLocaleDateString('en-IN'),
        subscription_plan: supplier.selectedSubscriptionPlan?.label || 'Standard',
        subscription_duration: `${supplier.subscriptionDuration || 1} year${(supplier.subscriptionDuration && supplier.subscriptionDuration > 1) ? 's' : ''}`,
        expiry_date: new Date(Date.now() + (supplier.subscriptionDuration || 1) * 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
        dashboard_link: `${window.location.origin}/supplier-dashboard`,
      };

      // Note: Requires emailjs-com package installation and proper configuration
      // Uncomment the lines below after installing: npm install emailjs-com
      // await emailjs.send(
      //   'your_service_id', // Replace with your actual service ID
      //   'template_abc123d', // Replace with the Template ID you just copied
      //   templateParams,
      //   'your_public_key' // Replace with your actual public key
      // );
      
      console.log('Payment success email would be sent with params:', templateParams);
      
      toast({
        title: "Email Notification",
        description: "Payment confirmation email functionality is ready to be configured.",
      });
      
    } catch (error) {
      console.error('Failed to send payment success email:', error);
      toast({
        title: "Email Error",
        description: "Failed to send payment confirmation email.",
        variant: "destructive",
      });
    }
  };

  // Enhanced form data state
  const [formData, setFormData] = useState({
    companyName: '',
    country: '',
    emirate: '',
    phone: '',
    website: '',
    contactPerson: '',
    businessType: '',
    yearsOfOperation: '',
    employeeCount: ''
  });

  // Get status badge styling
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'approved':
        return { variant: 'default' as const, icon: CheckCircle, color: 'text-green-400' };
      case 'pending':
        return { variant: 'secondary' as const, icon: Clock, color: 'text-yellow-400' };
      case 'pending_review':
        return { variant: 'secondary' as const, icon: Clock, color: 'text-orange-400' };
      case 'rejected':
        return { variant: 'destructive' as const, icon: AlertCircle, color: 'text-red-400' };
      default:
        return { variant: 'outline' as const, icon: Clock, color: 'text-slate-400' };
    }
  };

  useEffect(() => {
    // TEMPORARY: For development testing - remove this in production
    const isDevelopment = import.meta.env.DEV;
    
    if (isDevelopment && window.location.search.includes('test=true')) {
      // Create mock supplier data for testing
      const mockSupplier: SupplierData = {
        id: 'test-supplier-id',
        companyName: 'Test Company Ltd',
        country: 'United Arab Emirates',
        emirate: 'Dubai',
        email: 'test@company.com',
        status: 'approved',
        phone: '+971-50-123-4567',
        website: 'https://testcompany.com',
        contactPerson: 'John Doe',
        businessType: 'Technology',
        yearsOfOperation: '5',
        employeeCount: '50',
        accountCreatedAt: new Date().toISOString(),
        submittedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      
      setSupplier(mockSupplier);
      setFormData({
        companyName: mockSupplier.companyName || '',
        country: mockSupplier.country || '',
        emirate: mockSupplier.emirate || '',
        phone: mockSupplier.phone || '',
        website: mockSupplier.website || '',
        contactPerson: mockSupplier.contactPerson || '',
        businessType: mockSupplier.businessType || '',
        yearsOfOperation: mockSupplier.yearsOfOperation || '',
        employeeCount: mockSupplier.employeeCount || ''
      });
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        try {
          const supplierDocRef = doc(db, 'suppliers', user.uid);
          const docSnap = await getDoc(supplierDocRef);

          if (docSnap.exists()) {
            const supplierData: SupplierData = { id: docSnap.id, ...docSnap.data() };
            
            // Check if payment is completed
            if (supplierData.paymentStatus !== 'completed') {
              navigate(`/payment-required?email=${encodeURIComponent(supplierData.email || '')}`);
              return;
            }
            
            setSupplier(supplierData);
            
            // Initialize form data with all available fields
            setFormData({
              companyName: supplierData.companyName || '',
              country: supplierData.country || '',
              emirate: supplierData.emirate || '',
              phone: supplierData.phone || '',
              website: supplierData.website || '',
              contactPerson: supplierData.contactPerson || '',
              businessType: supplierData.businessType || '',
              yearsOfOperation: supplierData.yearsOfOperation || '',
              employeeCount: supplierData.employeeCount || ''
            });
          } else {
            // Supplier document not found - redirect to login
            toast({
              title: "Account Not Found",
              description: "No supplier account found. Please contact support.",
              variant: "destructive",
            });
            signOut(auth);
          }
        } catch (error) {
          console.error('Error fetching supplier data:', error);
          toast({
            title: "Error",
            description: "Failed to load your profile data.",
            variant: "destructive",
          });
        }
      } else {
        navigate('/supplier-login');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [navigate, toast]);

  // Handler for form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handler for saving profile changes to Firestore
  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplier) return;
    
    setIsSaving(true);
    
    try {
      const supplierDocRef = doc(db, 'suppliers', supplier.id);
      
      // Only include fields that have values (not empty strings)
      const filteredFormData = Object.entries(formData).reduce((acc, [key, value]) => {
        if (value && value.trim() !== '') {
          acc[key] = value.trim();
        }
        return acc;
      }, {} as Record<string, any>);
      
      // Check if at least one field is filled
      if (Object.keys(filteredFormData).length === 0) {
        toast({
          title: "No Changes Made",
          description: "Please fill at least one field to update your profile.",
          variant: "destructive",
        });
        setIsSaving(false);
        return;
      }
      
      const updateData = {
        ...filteredFormData,
        status: 'pending_review', // Set status to pending review when profile is updated
        lastUpdated: new Date().toISOString(),
        profileUpdateRequested: true,
        profileUpdateDate: new Date().toISOString()
      };
      
      await updateDoc(supplierDocRef, updateData);

      // Update local state
      setSupplier({ ...supplier, ...updateData });
      setIsEditing(false);

      toast({
        title: "Profile Update Submitted!",
        description: "Your profile changes have been submitted for admin approval. Only the fields you filled will be updated.",
      });

    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: "Could not save your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Logout Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  // File upload handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !user) return;
    setIsUploading(true);

    // Cloudinary configuration - Updated for better access control
    const CLOUDINARY_CLOUD_NAME = "domqsb9le";
    const CLOUDINARY_UPLOAD_PRESET = "masshura_supplier_docs";

    const uploadFormData = new FormData();
    uploadFormData.append('file', selectedFile);
    uploadFormData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    
    // Add additional parameters to ensure proper access
    uploadFormData.append('resource_type', 'auto');
    
    // The folder is already set in the upload preset as 'supplier_files'
    // We can add a subfolder for user organization
    uploadFormData.append('folder', `supplier_files/${user.uid}`);

    try {
      console.log('Uploading to Cloudinary with config:', {
        cloud_name: CLOUDINARY_CLOUD_NAME,
        upload_preset: CLOUDINARY_UPLOAD_PRESET,
        file_size: selectedFile.size,
        file_type: selectedFile.type
      });

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
        uploadFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Cloudinary upload response:', response.data);

      const fileData = {
        url: response.data.secure_url,
        name: selectedFile.name,
        asset_id: response.data.asset_id,
        public_id: response.data.public_id,
        resource_type: response.data.resource_type,
        format: response.data.format,
        uploaded_at: new Date().toISOString(),
        file_size: response.data.bytes,
        // Store both secure and non-secure URLs for fallback
        secure_url: response.data.secure_url,
        url_fallback: response.data.url
      };

      const supplierDocRef = doc(db, 'suppliers', user.uid);
      await updateDoc(supplierDocRef, { uploadedDocuments: arrayUnion(fileData) });
      
      setSupplier(prev => ({ ...prev!, uploadedDocuments: [...(prev?.uploadedDocuments || []), fileData] }));
      setSelectedFile(null);
      toast({ 
        title: "Success", 
        description: `File "${selectedFile.name}" uploaded successfully to Cloudinary.` 
      });

    } catch (error) {
      console.error("Error uploading file:", error);
      
      // Enhanced error handling
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const errorData = error.response?.data;
        
        console.error('Cloudinary error details:', errorData);
        
        if (status === 401) {
          toast({ 
            title: "Upload Failed - Authentication Error", 
            description: "Upload preset configuration issue. Please contact support.", 
            variant: "destructive" 
          });
        } else if (status === 400) {
          toast({ 
            title: "Upload Failed - Invalid File", 
            description: "File format not supported or file is corrupted.", 
            variant: "destructive" 
          });
        } else {
          toast({ 
            title: "Upload Failed", 
            description: `Error ${status}: ${errorData?.error?.message || 'Unknown error'}`, 
            variant: "destructive" 
          });
        }
      } else {
        toast({ 
          title: "Upload Failed", 
          description: "Network error. Please check your connection and try again.", 
          variant: "destructive" 
        });
      }
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleDeleteFile = async (fileToDelete: any) => {
    if (!user || !window.confirm("Are you sure? This will remove the file reference.")) return;
    
    const supplierDocRef = doc(db, 'suppliers', user.uid);
    await updateDoc(supplierDocRef, { uploadedDocuments: arrayRemove(fileToDelete) });
    
    setSupplier(prev => ({ ...prev!, uploadedDocuments: prev!.uploadedDocuments!.filter(f => f.asset_id !== fileToDelete.asset_id) }));
    toast({ title: "File Removed", description: "The file reference has been deleted." });
  };

  if (isLoading) {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading your dashboard...</p>
        </div>
      </motion.div>
    );
  }

  if (!supplier) {
    return null; // The useEffect hook handles redirection
  }

  const statusBadge = getStatusBadge(supplier.status);
  const StatusIcon = statusBadge.icon;

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Add proper spacing from navbar */}
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header Section */}
          <motion.div 
            className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="space-y-3">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent">
                Supplier Dashboard
              </h1>
              <p className="text-lg text-slate-300 font-medium">Welcome back, {supplier.companyName}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <Badge 
                variant={statusBadge.variant} 
                className="text-sm px-4 py-2 flex items-center gap-2 justify-center sm:justify-start bg-slate-800/60 border-slate-600 backdrop-blur-sm"
              >
                <StatusIcon className="w-4 h-4" />
                {supplier.status === 'approved' ? 'Approved' : 
                 supplier.status === 'pending' ? 'Pending Review' :
                 supplier.status === 'pending_review' ? 'Profile Under Review' : 
                 supplier.status === 'rejected' ? 'Rejected' : 'Under Review'}
              </Badge>
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                className="border-slate-500 text-slate-200 hover:bg-slate-700/50 hover:text-white hover:border-slate-400 transition-all duration-200 bg-slate-800/30 backdrop-blur-sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </motion.div>

          {/* Profile Update Notification */}
          {supplier.status === 'pending_review' && (
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-orange-400 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-orange-400 font-semibold">Profile Under Review</h3>
                    <p className="text-slate-300 text-sm mt-1">
                      Your profile changes have been submitted for admin approval. You will be notified once the review is complete.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Profile Overview Card */}
            <motion.div 
              className="xl:col-span-1"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-slate-800/70 border-slate-600/50 backdrop-blur-md shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
                <CardHeader className="text-center pb-6">
                  <div className="w-28 h-28 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                    <Building className="w-14 h-14 text-white" />
                  </div>
                  <CardTitle className="text-white text-2xl font-bold">{supplier.companyName}</CardTitle>
                  <CardDescription className="text-slate-300 text-base mt-2">{supplier.businessType}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5 px-6 pb-6">
                  <div className="flex items-center text-slate-200 hover:text-white transition-colors duration-200 p-3 rounded-lg hover:bg-slate-700/30">
                    <Mail className="w-5 h-5 mr-4 text-blue-400 flex-shrink-0" />
                    <span className="text-sm font-medium break-all">{supplier.email}</span>
                  </div>
                  <div className="flex items-center text-slate-200 hover:text-white transition-colors duration-200 p-3 rounded-lg hover:bg-slate-700/30">
                    <Phone className="w-5 h-5 mr-4 text-green-400 flex-shrink-0" />
                    <span className="text-sm font-medium">{supplier.phone}</span>
                  </div>
                  <div className="flex items-center text-slate-200 hover:text-white transition-colors duration-200 p-3 rounded-lg hover:bg-slate-700/30">
                    <MapPin className="w-5 h-5 mr-4 text-purple-400 flex-shrink-0" />
                    <span className="text-sm font-medium">{supplier.country}, {supplier.emirate}</span>
                  </div>
                  {supplier.website && (
                    <div className="flex items-center text-slate-200 hover:text-white transition-colors duration-200 p-3 rounded-lg hover:bg-slate-700/30">
                      <Globe className="w-5 h-5 mr-4 text-indigo-400 flex-shrink-0" />
                      <a 
                        href={supplier.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-blue-400 hover:text-blue-300 hover:underline transition-all duration-200"
                      >
                        {supplier.website}
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Subscription Status Card */}
              <motion.div 
                className="mt-8"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.35 }}
              >
                <Card className="bg-slate-800/70 border-slate-600/50 backdrop-blur-md shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-white text-xl font-bold flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <Shield className="w-4 h-4 text-white" />
                      </div>
                      Subscription Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">Plan:</span>
                      <span className="text-white font-medium">
                        {supplier.selectedSubscriptionPlan?.label || 'Standard'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">Duration:</span>
                      <span className="text-white">
                        {supplier.subscriptionDuration || 1} year{(supplier.subscriptionDuration && supplier.subscriptionDuration > 1) ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">Expires On:</span>
                      <span className="text-white font-medium">
                        {supplier.subscriptionExpiryDate ? 
                          new Date(supplier.subscriptionExpiryDate).toLocaleDateString() 
                          : 'N/A'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">Status:</span>
                      <Badge className="bg-green-500/20 text-green-400 border-green-400/30">
                        Active
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Profile Details Card */}
            <motion.div 
              className="xl:col-span-2"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-slate-800/70 border-slate-600/50 backdrop-blur-md shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
                  <div className="space-y-2">
                    <CardTitle className="text-white text-2xl font-bold">Profile Information</CardTitle>
                    <CardDescription className="text-slate-300 text-base">
                      Update your business details and contact information
                    </CardDescription>
                  </div>
                  {!isEditing && (
                    <Button
                      onClick={() => {
                        setIsEditing(true);
                        // Initialize with empty fields so users can choose what to update
                        setFormData({
                          companyName: '',
                          country: '',
                          emirate: '',
                          phone: '',
                          website: '',
                          contactPerson: '',
                          businessType: '',
                          yearsOfOperation: '',
                          employeeCount: ''
                        });
                      }}
                      disabled={supplier.status === 'pending_review'}
                      className={`border-0 shadow-lg transition-all duration-200 px-6 py-2 ${
                        supplier.status === 'pending_review'
                          ? 'bg-slate-600 cursor-not-allowed opacity-50 text-slate-300'
                          : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:shadow-blue-500/25'
                      }`}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      {supplier.status === 'pending_review' ? 'Profile Under Review' : 'Edit Profile'}
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  {isEditing ? (
                    <form onSubmit={handleSaveChanges} className="space-y-8">
                      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-blue-200 mb-1">Flexible Profile Editing</h4>
                            <p className="text-xs text-blue-300/80">
                              You only need to fill the fields you want to update. Leave fields empty if you don't want to change them. 
                              Only the fields with values will be updated in your profile.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="companyName" className="text-slate-200 font-semibold text-sm">Company Name</Label>
                          <Input
                            id="companyName"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleInputChange}
                            placeholder="Enter company name (optional)"
                            className="bg-slate-700/70 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 h-11 transition-all duration-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contactPerson" className="text-slate-200 font-semibold text-sm">Contact Person</Label>
                          <Input
                            id="contactPerson"
                            name="contactPerson"
                            value={formData.contactPerson}
                            onChange={handleInputChange}
                            placeholder="Enter contact person name (optional)"
                            className="bg-slate-700/70 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 h-11 transition-all duration-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-slate-200 font-semibold text-sm">Phone Number</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Enter phone number (optional)"
                            className="bg-slate-700/70 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 h-11 transition-all duration-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="website" className="text-slate-200 font-semibold text-sm">Website</Label>
                          <Input
                            id="website"
                            name="website"
                            value={formData.website}
                            onChange={handleInputChange}
                            placeholder="Enter website URL (optional)"
                            className="bg-slate-700/70 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 h-11 transition-all duration-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country" className="text-slate-200 font-semibold text-sm">Country</Label>
                          <Input
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            placeholder="Enter country (optional)"
                            className="bg-slate-700/70 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 h-11 transition-all duration-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="emirate" className="text-slate-200 font-semibold text-sm">Emirate</Label>
                          <Input
                            id="emirate"
                            name="emirate"
                            value={formData.emirate}
                            onChange={handleInputChange}
                            placeholder="Enter emirate (optional)"
                            className="bg-slate-700/70 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 h-11 transition-all duration-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="businessType" className="text-slate-200 font-semibold text-sm">Business Type</Label>
                          <Input
                            id="businessType"
                            name="businessType"
                            value={formData.businessType}
                            onChange={handleInputChange}
                            placeholder="Enter business type (optional)"
                            className="bg-slate-700/70 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 h-11 transition-all duration-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="yearsOfOperation" className="text-slate-200 font-semibold text-sm">Years of Operation</Label>
                          <Input
                            id="yearsOfOperation"
                            name="yearsOfOperation"
                            value={formData.yearsOfOperation}
                            onChange={handleInputChange}
                            placeholder="Enter years of operation (optional)"
                            className="bg-slate-700/70 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 h-11 transition-all duration-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="employeeCount" className="text-slate-200 font-semibold text-sm">Employee Count</Label>
                          <Input
                            id="employeeCount"
                            name="employeeCount"
                            value={formData.employeeCount}
                            onChange={handleInputChange}
                            placeholder="Enter employee count (optional)"
                            className="bg-slate-700/70 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 h-11 transition-all duration-200"
                          />
                        </div>
                      </div>
                    
                      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-600/30">
                        <Button
                          type="submit"
                          disabled={isSaving}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 shadow-lg hover:shadow-blue-500/25 transition-all duration-200 px-8 py-3 h-auto"
                        >
                          {isSaving ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-3"></div>
                              <span className="font-medium">Saving...</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-3" />
                              <span className="font-medium">Save Changes</span>
                            </>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false);
                            setFormData({
                              companyName: supplier.companyName || '',
                              country: supplier.country || '',
                              emirate: supplier.emirate || '',
                              phone: supplier.phone || '',
                              website: supplier.website || '',
                              contactPerson: supplier.contactPerson || '',
                              businessType: supplier.businessType || '',
                              yearsOfOperation: supplier.yearsOfOperation || '',
                              employeeCount: supplier.employeeCount || ''
                            });
                          }}
                          className="border-slate-500 text-slate-200 hover:bg-slate-700/50 hover:text-white hover:border-slate-400 transition-all duration-200 bg-slate-800/30 backdrop-blur-sm px-8 py-3 h-auto"
                        >
                          <X className="w-4 h-4 mr-3" />
                          <span className="font-medium">Cancel</span>
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/30">
                          <h4 className="text-sm font-semibold text-slate-300 mb-2">Company Name</h4>
                          <p className="text-white font-medium text-base">{supplier.companyName}</p>
                        </div>
                        <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/30">
                          <h4 className="text-sm font-semibold text-slate-300 mb-2">Contact Person</h4>
                          <p className="text-white font-medium text-base">{supplier.contactPerson}</p>
                        </div>
                        <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/30">
                          <h4 className="text-sm font-semibold text-slate-300 mb-2">Business Type</h4>
                          <p className="text-white font-medium text-base">{supplier.businessType}</p>
                        </div>
                        <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/30">
                          <h4 className="text-sm font-semibold text-slate-300 mb-2">Years of Operation</h4>
                          <p className="text-white font-medium text-base">{supplier.yearsOfOperation || 'Not specified'}</p>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/30">
                          <h4 className="text-sm font-semibold text-slate-300 mb-2">Registration Date</h4>
                          <p className="text-white font-medium text-base">
                            {supplier.createdAt ? new Date(supplier.createdAt).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/30">
                          <h4 className="text-sm font-semibold text-slate-300 mb-2">Last Updated</h4>
                          <p className="text-white font-medium text-base">
                            {supplier.lastUpdated ? new Date(supplier.lastUpdated).toLocaleDateString() : 'Never'}
                          </p>
                        </div>
                        <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/30">
                          <h4 className="text-sm font-semibold text-slate-300 mb-2">Employee Count</h4>
                          <p className="text-white font-medium text-base">{supplier.employeeCount || 'Not specified'}</p>
                        </div>
                        <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/30">
                          <h4 className="text-sm font-semibold text-slate-300 mb-2">Profile Status</h4>
                          <Badge variant={statusBadge.variant} className="text-sm px-3 py-1 bg-slate-600/50 border-slate-500">
                            <StatusIcon className="w-4 h-4 mr-2" />
                            {supplier.status === 'approved' ? 'Approved' : 
                             supplier.status === 'pending' ? 'Pending Review' : 
                             supplier.status === 'rejected' ? 'Rejected' : 'Under Review'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* File Management Card */}
            <motion.div 
              className="xl:col-span-3"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-slate-800/70 border-slate-600/50 backdrop-blur-md shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
                <CardHeader className="pb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <UploadCloud className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-2xl font-bold">Document Management</CardTitle>
                      <CardDescription className="text-slate-300 text-base mt-1">
                        Upload and manage your business documents securely
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Upload Section */}
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-white">Upload New Document</h3>
                    </div>
                    <div className="border-2 border-dashed border-slate-600/50 rounded-xl p-8 bg-slate-900/30 hover:border-blue-500/50 hover:bg-slate-900/50 transition-all duration-300">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center">
                          <File className="w-8 h-8 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium text-lg">Choose files to upload</p>
                          <p className="text-slate-400 text-sm mt-1">Supports PDF, DOC, DOCX, PNG, JPG and more</p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md">
                          <div className="relative w-full">
                            <Input 
                              type="file" 
                              onChange={handleFileChange}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt,.csv,.xls,.xlsx"
                            />
                            <div className="flex items-center justify-center w-full h-12 px-6 bg-slate-700/50 border-2 border-slate-500/50 rounded-lg text-white hover:bg-slate-600/50 hover:border-slate-400/50 transition-all duration-200 cursor-pointer">
                              <File className="w-5 h-5 mr-3 text-slate-400" />
                              <span className="font-medium">
                                {selectedFile ? selectedFile.name : "Choose Document"}
                              </span>
                            </div>
                          </div>
                          <Button 
                            onClick={handleFileUpload} 
                            disabled={!selectedFile || isUploading} 
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 shadow-lg hover:shadow-blue-500/25 transition-all duration-200 px-8 py-3 h-12 font-medium w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isUploading ? (
                              <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                <span>Uploading...</span>
                              </>
                            ) : (
                              <>
                                <UploadCloud className="w-5 h-5 mr-3" />
                                <span>Upload</span>
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Uploaded Files Section */}
                  <div className="relative">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <h3 className="text-lg font-semibold text-white">Your Documents</h3>
                        {supplier?.uploadedDocuments && supplier.uploadedDocuments.length > 0 && (
                          <Badge variant="secondary" className="bg-slate-700/50 text-slate-300 border-slate-600">
                            {supplier.uploadedDocuments.length} file{supplier.uploadedDocuments.length !== 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {supplier?.uploadedDocuments && supplier.uploadedDocuments.length > 0 ? (
                      <div className="grid gap-4">
                        {supplier.uploadedDocuments.map((file, index) => (
                          <motion.div
                            key={file.asset_id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group flex items-center justify-between p-5 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl border border-slate-600/30 hover:border-slate-500/50 transition-all duration-200"
                          >
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center border border-blue-500/20">
                                <File className="w-6 h-6 text-blue-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-white font-medium text-base truncate group-hover:text-blue-300 transition-colors">
                                  {file.name}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <p className="text-slate-400 text-sm">
                                    {file.uploaded_at ? new Date(file.uploaded_at).toLocaleDateString() : 'Uploaded'}
                                  </p>
                                  {file.file_size && (
                                    <>
                                      <span className="text-slate-600">•</span>
                                      <p className="text-slate-400 text-sm">
                                        {(file.file_size / 1024 / 1024).toFixed(2)} MB
                                      </p>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const urlToOpen = file.secure_url || file.url;
                                  if (urlToOpen) {
                                    // Check if it's a PDF file
                                    const isPDF = file.format === 'pdf' || file.name?.toLowerCase().endsWith('.pdf') || urlToOpen.includes('.pdf');
                                    
                                    if (isPDF) {
                                      // For PDFs, force download instead of trying to view
                                      // Cloudinary PDFs often have CORS issues when opened directly
                                      const link = document.createElement('a');
                                      link.href = urlToOpen;
                                      link.download = file.name || 'document.pdf';
                                      link.target = '_blank';
                                      document.body.appendChild(link);
                                      link.click();
                                      document.body.removeChild(link);
                                      
                                      toast({
                                        title: "PDF Download Started",
                                        description: "PDF file is being downloaded for viewing.",
                                      });
                                    } else {
                                      // For other file types (images, documents), open directly
                                      window.open(urlToOpen, '_blank', 'noopener,noreferrer');
                                    }
                                  } else {
                                    toast({
                                      title: "No URL Available",
                                      description: "This file doesn't have a valid URL to view.",
                                      variant: "destructive"
                                    });
                                  }
                                }}
                                className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-all duration-200"
                              >
                                <Globe className="w-4 h-4" />
                                <span className="hidden sm:inline ml-2">View</span>
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={async () => {
                                  try {
                                    const urlToDownload = file.secure_url || file.url_fallback || file.url;
                                    
                                    // Create download link
                                    const link = document.createElement('a');
                                    link.href = urlToDownload;
                                    link.download = file.name || 'download';
                                    link.target = '_blank';
                                    
                                    // Test if URL is accessible before attempting download
                                    const response = await fetch(urlToDownload, { method: 'HEAD' });
                                    
                                    if (response.ok) {
                                      document.body.appendChild(link);
                                      link.click();
                                      document.body.removeChild(link);
                                      
                                      toast({
                                        title: "Download Started",
                                        description: `Downloading ${file.name}`
                                      });
                                    } else {
                                      throw new Error(`HTTP ${response.status}`);
                                    }
                                  } catch (error) {
                                    console.error('Download error:', error);
                                    toast({
                                      title: "Download Failed",
                                      description: "File cannot be downloaded. It may have been moved or deleted from Cloudinary.",
                                      variant: "destructive"
                                    });
                                  }
                                }}
                                className="text-green-400 hover:text-green-300 hover:bg-green-500/10 transition-all duration-200"
                              >
                                <UploadCloud className="w-4 h-4 rotate-180" />
                                <span className="hidden sm:inline ml-2">Download</span>
                              </Button>
                              
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteFile(file)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span className="hidden sm:inline ml-2">Delete</span>
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 bg-slate-700/30 rounded-full flex items-center justify-center mx-auto mb-4">
                          <File className="w-10 h-10 text-slate-500" />
                        </div>
                        <h4 className="text-slate-300 font-medium text-lg mb-2">No documents uploaded yet</h4>
                        <p className="text-slate-400 text-base max-w-md mx-auto">
                          Start by uploading your business documents. Supported formats include PDF, Word documents, images, and more.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SupplierDashboard;
