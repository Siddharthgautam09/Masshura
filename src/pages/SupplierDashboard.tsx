import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '@/components/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SupplierData {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  location: string;
  products: string;
  services: string;
  experience: string;
  certificates: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
}

const SupplierDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [supplierData, setSupplierData] = useState<SupplierData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSupplierData = async () => {
      if (!auth.currentUser) {
        navigate('/login');
        return;
      }

      try {
        const supplierDoc = await getDoc(doc(db, 'suppliers', auth.currentUser.uid));
        if (supplierDoc.exists()) {
          setSupplierData(supplierDoc.data() as SupplierData);
        }
      } catch (error) {
        console.error('Error fetching supplier data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSupplierData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!supplierData) {
    return <div>No supplier data found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className=" mt-1 text-3xl font-bold text-white">Supplier Dashboard</h1>
            <p className="text-slate-300 mt-2">Welcome back, {supplierData.companyName}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30">
              <span className="!text-white text-sm font-medium" style={{color: '#ffffff'}}>Under Review</span>
            </div>
            <Button onClick={handleLogout} variant="outline" className="border-slate-600 text-slate-300 hover:text-white">
              Logout
            </Button>
          </div>
        </div>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Supplier Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-slate-300">
            <div>
              <strong className="text-white">Company Name:</strong> {supplierData.companyName}
            </div>
            <div>
              <strong className="text-white">Contact Name:</strong> {supplierData.contactName}
            </div>
            <div>
              <strong className="text-white">Email:</strong> {supplierData.email}
            </div>
            <div>
              <strong className="text-white">Phone:</strong> {supplierData.phone}
            </div>
            <div>
              <strong className="text-white">Location:</strong> {supplierData.location}
            </div>
            <div>
              <strong className="text-white">Status:</strong> <span className="text-white">{supplierData.status}</span>
            </div>
            <div className="col-span-2">
              <strong className="text-white">Products:</strong> {supplierData.products}
            </div>
            <div className="col-span-2">
              <strong className="text-white">Services:</strong> {supplierData.services}
            </div>
            <div>
              <strong className="text-white">Experience:</strong> {supplierData.experience}
            </div>
            <div>
              <strong className="text-white">Certificates:</strong> {supplierData.certificates}
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default SupplierDashboard;
