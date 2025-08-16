import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Calendar, 
  Clock,
  User,
  Shield,
  BarChart3,
  FileText,
  CheckCircle,
  CreditCard,
  Edit,
  Save,
  X,
  Download,
  LogOut,
  Loader2,
  Tag,
  Briefcase,
  Users,
  Zap,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/components/firebase';
import { toast } from 'sonner';

interface SupplierData {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  countryCode: string;
  country: string;
  emirate: string;
  website?: string;
  tradeNumber?: string;
  contactPerson?: string;
  designation?: string;
  businessType?: string;
  yearsOperation?: string;
  employeeCount?: string;
  categories: string[];
  selectedSubscriptionPlan?: {
    label: string;
    value: string;
  };
  subscriptionDuration?: number;
  subscriptionExpiryDate?: any;
  paymentStatus: string;
  status: string;
  createdAt?: any;
  updatedAt?: any;
}

interface FormData {
  companyName: string;
  contactPerson: string;
  phone: string;
  website: string;
  country: string;
  emirate: string;
  businessType: string;
  yearsOfOperation: string;
  employeeCount: string;
}

const SupplierDashboard: React.FC = () => {
  const { user } = useAuth();
  const [supplier, setSupplier] = useState<SupplierData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    contactPerson: '',
    phone: '',
    website: '',
    country: '',
    emirate: '',
    businessType: '',
    yearsOfOperation: '',
    employeeCount: ''
  });

  useEffect(() => {
    const fetchSupplierData = async () => {
      if (!user?.uid) return;
      
      try {
        const supplierDoc = await getDoc(doc(db, 'suppliers', user.uid));
        if (supplierDoc.exists()) {
          setSupplier({ id: supplierDoc.id, ...supplierDoc.data() } as SupplierData);
        }
      } catch (error) {
        console.error('Error fetching supplier data:', error);
        toast.error('Failed to load supplier data');
      } finally {
        setLoading(false);
      }
    };

    fetchSupplierData();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid || !supplier) return;

    setIsSaving(true);
    try {
      const updateData = {
        ...formData,
        updatedAt: new Date()
      };

      await updateDoc(doc(db, 'suppliers', user.uid), updateData);
      
      setSupplier(prev => prev ? { ...prev, ...updateData } : null);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-white">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white">No supplier data found</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="relative z-10">
        <div className="navbar-content-spacing px-4 sm:px-6 lg:px-8 pb-8">
          {/* Header Section */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="bg-slate-800/70 border border-slate-600/50 backdrop-blur-md rounded-xl p-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">
                    Welcome back, {supplier.companyName}
                  </h1>
                  <p className="text-slate-400">
                    Manage your supplier profile and track your business growth
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-500/20 text-green-400 border-green-400/30 px-3 py-1">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approved
                  </Badge>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-400/30 px-3 py-1">
                    <Shield className="w-4 h-4 mr-1" />
                    Active
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tabular Dashboard Layout */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Company Information Table */}
            <Card className="bg-slate-800/70 border-slate-600/50 backdrop-blur-md shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white text-xl font-bold flex items-center gap-3">
                  <Building className="w-6 h-6 text-blue-400" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-slate-700/50">
                      <tr className="hover:bg-slate-700/20 transition-colors">
                        <td className="py-3 px-4 font-medium text-slate-400 w-1/3">Company Name</td>
                        <td className="py-3 px-4 text-white">{supplier.companyName}</td>
                      </tr>
                      <tr className="hover:bg-slate-700/20 transition-colors">
                        <td className="py-3 px-4 font-medium text-slate-400">Email</td>
                        <td className="py-3 px-4 text-white break-all">{supplier.email}</td>
                      </tr>
                      <tr className="hover:bg-slate-700/20 transition-colors">
                        <td className="py-3 px-4 font-medium text-slate-400">Phone</td>
                        <td className="py-3 px-4 text-white">{supplier.countryCode} {supplier.phone}</td>
                      </tr>
                      <tr className="hover:bg-slate-700/20 transition-colors">
                        <td className="py-3 px-4 font-medium text-slate-400">Location</td>
                        <td className="py-3 px-4 text-white">{supplier.emirate}, {supplier.country}</td>
                      </tr>
                      {supplier.website && (
                        <tr className="hover:bg-slate-700/20 transition-colors">
                          <td className="py-3 px-4 font-medium text-slate-400">Website</td>
                          <td className="py-3 px-4">
                            <a 
                              href={supplier.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 hover:underline transition-all duration-200"
                            >
                              {supplier.website}
                            </a>
                          </td>
                        </tr>
                      )}
                      <tr className="hover:bg-slate-700/20 transition-colors">
                        <td className="py-3 px-4 font-medium text-slate-400">Trade License Number</td>
                        <td className="py-3 px-4 text-white">{supplier.tradeNumber || 'Not provided'}</td>
                      </tr>
                      <tr className="hover:bg-slate-700/20 transition-colors">
                        <td className="py-3 px-4 font-medium text-slate-400">Years in Operation</td>
                        <td className="py-3 px-4 text-white">{supplier.yearsOperation || 'Not specified'}</td>
                      </tr>
                      <tr className="hover:bg-slate-700/20 transition-colors">
                        <td className="py-3 px-4 font-medium text-slate-400">Employee Count</td>
                        <td className="py-3 px-4 text-white">{supplier.employeeCount || 'Not specified'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Contact Person Table */}
            <Card className="bg-slate-800/70 border-slate-600/50 backdrop-blur-md shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white text-xl font-bold flex items-center gap-3">
                  <Mail className="w-6 h-6 text-green-400" />
                  Contact Person Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-slate-700/50">
                      <tr className="hover:bg-slate-700/20 transition-colors">
                        <td className="py-3 px-4 font-medium text-slate-400 w-1/3">Contact Person</td>
                        <td className="py-3 px-4 text-white">{supplier.contactPerson || 'Not provided'}</td>
                      </tr>
                      <tr className="hover:bg-slate-700/20 transition-colors">
                        <td className="py-3 px-4 font-medium text-slate-400">Designation</td>
                        <td className="py-3 px-4 text-white">{supplier.designation || 'Not provided'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Business Categories Table */}
            <Card className="bg-slate-800/70 border-slate-600/50 backdrop-blur-md shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white text-xl font-bold flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 text-purple-400" />
                  Business Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr>
                        <td className="py-3 px-4 font-medium text-slate-400 w-1/3">Categories</td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-2">
                            {supplier.categories && supplier.categories.length > 0 ? (
                              supplier.categories.map((category: string, index: number) => (
                                <Badge 
                                  key={index} 
                                  className="bg-purple-500/20 text-purple-300 border-purple-400/30 hover:bg-purple-500/30 transition-colors"
                                >
                                  {category}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-slate-400">No categories specified</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Information Table */}
            <Card className="bg-slate-800/70 border-slate-600/50 backdrop-blur-md shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white text-xl font-bold flex items-center gap-3">
                  <Shield className="w-6 h-6 text-orange-400" />
                  Subscription Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-slate-700/50">
                      <tr className="hover:bg-slate-700/20 transition-colors">
                        <td className="py-3 px-4 font-medium text-slate-400 w-1/3">Plan</td>
                        <td className="py-3 px-4 text-white">{supplier.selectedSubscriptionPlan?.label || 'Standard'}</td>
                      </tr>
                      <tr className="hover:bg-slate-700/20 transition-colors">
                        <td className="py-3 px-4 font-medium text-slate-400">Duration</td>
                        <td className="py-3 px-4 text-white">
                          {supplier.subscriptionDuration || 1} year{(supplier.subscriptionDuration && supplier.subscriptionDuration > 1) ? 's' : ''}
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-700/20 transition-colors">
                        <td className="py-3 px-4 font-medium text-slate-400">Expires On</td>
                        <td className="py-3 px-4 text-white">
                          {supplier.subscriptionExpiryDate ? 
                            new Date(supplier.subscriptionExpiryDate).toLocaleDateString() 
                            : 'N/A'
                          }
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-700/20 transition-colors">
                        <td className="py-3 px-4 font-medium text-slate-400">Status</td>
                        <td className="py-3 px-4">
                          <Badge className="bg-green-500/20 text-green-400 border-green-400/30">
                            Active
                          </Badge>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-700/20 transition-colors">
                        <td className="py-3 px-4 font-medium text-slate-400">Payment Status</td>
                        <td className="py-3 px-4">
                          <Badge className={
                            supplier.paymentStatus === 'completed' 
                              ? "bg-green-500/20 text-green-400 border-green-400/30"
                              : "bg-orange-500/20 text-orange-400 border-orange-400/30"
                          }>
                            {supplier.paymentStatus === 'completed' ? 'Paid' : 'Pending'}
                          </Badge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default SupplierDashboard;
