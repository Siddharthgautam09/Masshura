
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
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '@/components/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import PaymentDialog from '@/components/PaymentDialog';

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
  remarks?: any[];
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
  const [user, setUser] = useState<FirebaseUser | null>(null);
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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

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

  // Block dashboard and show payment dialog if payment is not completed
  if (supplier.paymentStatus !== 'completed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <PaymentDialog isOpen={true} onClose={() => {}} supplierData={supplier} />
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
        <div className="px-4 sm:px-6 lg:px-8 pb-8" style={{ paddingTop: '8rem' }}>
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

          {/* Admin Remarks Section */}
          {Array.isArray(supplier.remarks) && supplier.remarks.length > 0 && (
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="mb-6"
            >
              <div className="bg-yellow-900/70 border border-yellow-500/40 backdrop-blur-md rounded-xl p-6 shadow-xl">
                <h2 className="text-lg font-bold text-yellow-300 mb-2 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-yellow-400" />
                  Admin Remarks
                </h2>
                <ul className="space-y-2">
                  {supplier.remarks.map((remark: any, idx: number) => (
                    <li key={idx} className="text-yellow-100 border-l-4 border-yellow-400 pl-3 py-1">
                      <span className="block text-sm">{remark.message || remark.text || String(remark)}</span>
                      {remark.timestamp && (
                        <span className="block text-xs text-yellow-400 mt-1">
                          {new Date(remark.timestamp).toLocaleString()}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}

          {/* Enhanced Dashboard Layout */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Main Content Grid - 2 columns on large screens */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
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
                            <td className="py-3 px-4 font-medium text-slate-400 w-2/5">Company Name</td>
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
                            <td className="py-3 px-4 font-medium text-slate-400">Trade License</td>
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
                            <td className="py-3 px-4 font-medium text-slate-400 w-2/5">Categories</td>
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
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Contact Person & Subscription Combined */}
                <Card className="bg-slate-800/70 border-slate-600/50 backdrop-blur-md shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-white text-xl font-bold flex items-center gap-3">
                      <User className="w-6 h-6 text-green-400" />
                      Contact & Account Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Contact Person Section */}
                      <div>
                        <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-green-400" />
                          Contact Person
                        </h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <tbody className="divide-y divide-slate-700/50">
                              <tr className="hover:bg-slate-700/20 transition-colors">
                                <td className="py-2 px-4 font-medium text-slate-400 w-2/5">Name</td>
                                <td className="py-2 px-4 text-white">{supplier.contactPerson || 'Not provided'}</td>
                              </tr>
                              <tr className="hover:bg-slate-700/20 transition-colors">
                                <td className="py-2 px-4 font-medium text-slate-400">Designation</td>
                                <td className="py-2 px-4 text-white">{supplier.designation || 'Not provided'}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Account Status Section */}
                      <div className="border-t border-slate-700/50 pt-4">
                        <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                          <Shield className="w-4 h-4 text-orange-400" />
                          Account Status
                        </h4>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                            <p className="text-green-400 font-medium text-sm">Approved</p>
                            <p className="text-slate-400 text-xs">Account Status</p>
                          </div>
                          <div className="text-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                            <Shield className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                            <p className="text-blue-400 font-medium text-sm">Active</p>
                            <p className="text-slate-400 text-xs">Subscription</p>
                          </div>
                        </div>
                      </div>
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
                            <td className="py-3 px-4 font-medium text-slate-400 w-2/5">Plan</td>
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

                {/* Quick Actions Card */}
                <Card className="bg-slate-800/70 border-slate-600/50 backdrop-blur-md shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-white text-xl font-bold flex items-center gap-3">
                      <Zap className="w-6 h-6 text-yellow-400" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full border-slate-600 text-slate-300 hover:bg-slate-700/50 transition-all duration-200"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Full Width Analytics Preview */}
            <Card className="bg-slate-800/70 border-slate-600/50 backdrop-blur-md shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white text-xl font-bold flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-cyan-400" />
                  Business Analytics Overview
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Track your profile performance and engagement metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-slate-700/30 rounded-lg p-4 text-center hover:bg-slate-700/50 transition-colors">
                    <div className="text-2xl font-bold text-blue-400 mb-1">24</div>
                    <div className="text-slate-400 text-sm">Profile Views</div>
                    <div className="text-xs text-green-400 mt-1">+12% this week</div>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-4 text-center hover:bg-slate-700/50 transition-colors">
                    <div className="text-2xl font-bold text-green-400 mb-1">8</div>
                    <div className="text-slate-400 text-sm">Inquiries</div>
                    <div className="text-xs text-green-400 mt-1">+3 this week</div>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-4 text-center hover:bg-slate-700/50 transition-colors">
                    <div className="text-2xl font-bold text-purple-400 mb-1">94%</div>
                    <div className="text-slate-400 text-sm">Profile Complete</div>
                    <div className="text-xs text-slate-400 mt-1">Add more details</div>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-4 text-center hover:bg-slate-700/50 transition-colors">
                    <div className="text-2xl font-bold text-orange-400 mb-1">
                      {supplier.subscriptionExpiryDate ? 
                        Math.ceil((new Date(supplier.subscriptionExpiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                        : 'N/A'
                      }
                    </div>
                    <div className="text-slate-400 text-sm">Days Left</div>
                    <div className="text-xs text-orange-400 mt-1">Until renewal</div>
                  </div>
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
