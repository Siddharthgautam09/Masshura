// src/pages/supplier/SupplierDashboard.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../components/firebase';
import { useToast } from "@/components/ui/use-toast";
import { motion } from 'framer-motion';
import { 
  User, 
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
  BarChart3
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
  [key: string]: any;
}

const SupplierDashboard = () => {
  const { toast } = useToast();
  const [supplier, setSupplier] = useState<SupplierData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

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
        try {
          const supplierDocRef = doc(db, 'suppliers', user.uid);
          const docSnap = await getDoc(supplierDocRef);

          if (docSnap.exists()) {
            const supplierData: SupplierData = { id: docSnap.id, ...docSnap.data() };
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
      const updateData = {
        ...formData,
        lastUpdated: new Date().toISOString()
      };
      
      await updateDoc(supplierDocRef, updateData);

      // Update local state
      setSupplier({ ...supplier, ...updateData });
      setIsEditing(false);

      toast({
        title: "Profile Updated!",
        description: "Your profile has been successfully updated.",
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
                      onClick={() => setIsEditing(true)}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 shadow-lg hover:shadow-blue-500/25 transition-all duration-200 px-6 py-2"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  {isEditing ? (
                    <form onSubmit={handleSaveChanges} className="space-y-8">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="companyName" className="text-slate-200 font-semibold text-sm">Company Name</Label>
                          <Input
                            id="companyName"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleInputChange}
                            className="bg-slate-700/70 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 h-11 transition-all duration-200"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contactPerson" className="text-slate-200 font-semibold text-sm">Contact Person</Label>
                          <Input
                            id="contactPerson"
                            name="contactPerson"
                            value={formData.contactPerson}
                            onChange={handleInputChange}
                            className="bg-slate-700/70 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 h-11 transition-all duration-200"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-slate-200 font-semibold text-sm">Phone Number</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="bg-slate-700/70 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 h-11 transition-all duration-200"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="website" className="text-slate-200 font-semibold text-sm">Website</Label>
                          <Input
                            id="website"
                            name="website"
                            value={formData.website}
                            onChange={handleInputChange}
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
                            className="bg-slate-700/70 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 h-11 transition-all duration-200"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="emirate" className="text-slate-200 font-semibold text-sm">Emirate</Label>
                          <Input
                            id="emirate"
                            name="emirate"
                            value={formData.emirate}
                            onChange={handleInputChange}
                            className="bg-slate-700/70 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 h-11 transition-all duration-200"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="businessType" className="text-slate-200 font-semibold text-sm">Business Type</Label>
                          <Input
                            id="businessType"
                            name="businessType"
                            value={formData.businessType}
                            onChange={handleInputChange}
                            className="bg-slate-700/70 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 h-11 transition-all duration-200"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="yearsOfOperation" className="text-slate-200 font-semibold text-sm">Years of Operation</Label>
                          <Input
                            id="yearsOfOperation"
                            name="yearsOfOperation"
                            value={formData.yearsOfOperation}
                            onChange={handleInputChange}
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
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SupplierDashboard;
