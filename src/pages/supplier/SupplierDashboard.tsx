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
  contactName?: string;
  position?: string;
  designation?: string;
  businessType?: string;
  yearsOperation?: string;
  yearsOfOperation?: string;
  yearEstablished?: string;
  businessRegistration?: string;
  taxId?: string;
  employeeCount?: string;
  address?: string;
  products?: string;
  experience?: string;
  certifications?: string;
  capacity?: string;
  qualityStandards?: string;
  references?: string;
  additionalInfo?: string;
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

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-start py-12">
      <div className="w-full max-w-4xl bg-card border border-border rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">Supplier Dashboard</h1>
        <table className="w-full text-sm border border-border rounded-lg overflow-hidden bg-muted">
          <tbody>
            <tr className="border-b border-border">
              <td className="py-3 px-4 font-medium text-muted-foreground w-1/3">Company Name</td>
              <td className="py-3 px-4 text-foreground">{supplier.companyName}</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4 font-medium text-muted-foreground">Business Registration Number</td>
              <td className="py-3 px-4 text-foreground">{supplier.businessRegistration || 'Not provided'}</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4 font-medium text-muted-foreground">Tax ID</td>
              <td className="py-3 px-4 text-foreground">{supplier.taxId || 'Not provided'}</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4 font-medium text-muted-foreground">Year Established</td>
              <td className="py-3 px-4 text-foreground">{supplier.yearEstablished || 'Not provided'}</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4 font-medium text-muted-foreground">Number of Employees</td>
              <td className="py-3 px-4 text-foreground">{supplier.employeeCount || 'Not provided'}</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4 font-medium text-muted-foreground">Country</td>
              <td className="py-3 px-4 text-foreground">{supplier.country || 'Not provided'}</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4 font-medium text-muted-foreground">Emirate</td>
              <td className="py-3 px-4 text-foreground">{supplier.emirate || 'Not provided'}</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4 font-medium text-muted-foreground">Years of Operation</td>
              <td className="py-3 px-4 text-foreground">{supplier.yearsOfOperation || supplier.yearsOperation || 'Not provided'}</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4 font-medium text-muted-foreground">Contact Person Name</td>
              <td className="py-3 px-4 text-foreground">{supplier.contactName || supplier.contactPerson || 'Not provided'}</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4 font-medium text-muted-foreground">Position/Title</td>
              <td className="py-3 px-4 text-foreground">{supplier.position || supplier.designation || 'Not provided'}</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4 font-medium text-muted-foreground">Email</td>
              <td className="py-3 px-4 text-foreground break-all">{supplier.email}</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4 font-medium text-muted-foreground">Phone</td>
              <td className="py-3 px-4 text-foreground">{supplier.countryCode ? supplier.countryCode + ' ' : ''}{supplier.phone}</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4 font-medium text-muted-foreground">Website</td>
              <td className="py-3 px-4 text-foreground">
                {supplier.website ? (
                  <a href={supplier.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{supplier.website}</a>
                ) : 'Not provided'}
              </td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4 font-medium text-muted-foreground">Business Address</td>
              <td className="py-3 px-4 text-foreground">{supplier.address || 'Not provided'}</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4 font-medium text-muted-foreground">Business Type</td>
              <td className="py-3 px-4 text-foreground">{supplier.businessType || 'Not provided'}</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4 font-medium text-muted-foreground">Products/Services Offered</td>
              <td className="py-3 px-4 text-foreground">{supplier.products || 'Not provided'}</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4 font-medium text-muted-foreground">Years of Experience</td>
              <td className="py-3 px-4 text-foreground">{supplier.experience || 'Not provided'}</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4 font-medium text-muted-foreground">Certifications & Awards</td>
              <td className="py-3 px-4 text-foreground">{supplier.certifications || 'Not provided'}</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4 font-medium text-muted-foreground">Production/Service Capacity</td>
              <td className="py-3 px-4 text-foreground">{supplier.capacity || 'Not provided'}</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4 font-medium text-muted-foreground">Quality Standards & Compliance</td>
              <td className="py-3 px-4 text-foreground">{supplier.qualityStandards || 'Not provided'}</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4 font-medium text-muted-foreground">References</td>
              <td className="py-3 px-4 text-foreground">{supplier.references || 'Not provided'}</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4 font-medium text-muted-foreground">Additional Information</td>
              <td className="py-3 px-4 text-foreground">{supplier.additionalInfo || 'Not provided'}</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-medium text-muted-foreground">Categories</td>
              <td className="py-3 px-4">
                <div className="flex flex-wrap gap-2">
                  {supplier.categories && supplier.categories.length > 0 ? (
                    supplier.categories.map((category: string, index: number) => (
                      <Badge key={index} className="bg-muted text-foreground border border-border px-2 py-1 rounded">
                        {category}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground">No categories specified</span>
                  )}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupplierDashboard;
