// src/pages/admin/AdminDashboard.tsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../components/firebase.ts';
import SupplierList from '../../components/admin/SupplierList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LogOut, 
  Users, 
  Clock, 
  Settings, 
  TrendingUp, 
  Building2,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Activity
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [approvedSuppliers, setApprovedSuppliers] = useState(0);
  const [rejectedSuppliers, setRejectedSuppliers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const suppliersCollectionRef = collection(db, 'suppliers');
        
        // Fetch all suppliers
        const allSuppliersSnapshot = await getDocs(suppliersCollectionRef);
        setTotalSuppliers(allSuppliersSnapshot.size);
        
        // Fetch pending approvals
        const pendingQuery = query(suppliersCollectionRef, where("status", "==", "pending_approval"));
        const pendingSnapshot = await getDocs(pendingQuery);
        setPendingApprovals(pendingSnapshot.size);

        // Fetch approved suppliers
        const approvedQuery = query(suppliersCollectionRef, where("status", "==", "approved"));
        const approvedSnapshot = await getDocs(approvedQuery);
        setApprovedSuppliers(approvedSnapshot.size);

        // Fetch rejected suppliers
        const rejectedQuery = query(suppliersCollectionRef, where("status", "==", "rejected"));
        const rejectedSnapshot = await getDocs(rejectedQuery);
        setRejectedSuppliers(rejectedSnapshot.size);

      } catch (error) {
        // Error handling - stats will remain 0
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      // Logout error - user can try again
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, description }) => (
    <Card className="bg-slate-800/60 border-slate-600/50 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 overflow-hidden">
      <div className={`h-2 bg-gradient-to-r ${color}`}></div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-slate-200">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${color.includes('blue') ? 'bg-blue-500/20 border border-blue-400/30' : 
                                          color.includes('orange') ? 'bg-orange-500/20 border border-orange-400/30' : 
                                          color.includes('green') ? 'bg-green-500/20 border border-green-400/30' : 
                                          'bg-red-500/20 border border-red-400/30'}`}>
          <Icon className={`h-4 w-4 ${color.includes('blue') ? 'text-blue-400' : 
                                      color.includes('orange') ? 'text-orange-400' : 
                                      color.includes('green') ? 'text-green-400' : 'text-red-400'}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="text-3xl font-bold text-white mb-1">
            {isLoading ? (
              <div className="animate-pulse bg-slate-600 h-8 w-16 rounded"></div>
            ) : (
              value
            )}
          </div>
          <p className="text-xs text-slate-400">{description}</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Pattern */}
      <div 
        className="fixed inset-0 opacity-5 pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      <div className="relative z-10 pt-20">
        {/* Admin Header */}
        <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-600/50 shadow-lg">
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-400/30">
                    <Building2 className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                    <p className="text-sm text-slate-300">Manage suppliers and system operations</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  asChild 
                  variant="outline" 
                  className="bg-slate-700/50 border-slate-500 text-slate-200 hover:bg-slate-600/70 hover:text-white"
                >
                  <Link to="/admin/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Manage Categories
                  </Link>
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleLogout}
                  className="bg-red-600/90 hover:bg-red-600 text-white border-red-500"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          {/* Dashboard Stats */}
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-400/30 mr-3">
                <BarChart3 className="h-5 w-5 text-blue-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Dashboard Overview</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Suppliers"
                value={totalSuppliers}
                icon={Users}
                color="from-blue-500 to-blue-600"
                description="Registered suppliers"
              />
              <StatCard
                title="Pending Approvals"
                value={pendingApprovals}
                icon={Clock}
                color="from-orange-500 to-orange-600"
                description="Awaiting review"
              />
              <StatCard
                title="Approved Suppliers"
                value={approvedSuppliers}
                icon={CheckCircle}
                color="from-green-500 to-green-600"
                description="Active suppliers"
              />
              <StatCard
                title="Rejected Applications"
                value={rejectedSuppliers}
                icon={AlertCircle}
                color="from-red-500 to-red-600"
                description="Declined applications"
              />
            </div>
          </div>

          {/* Supplier Management Section */}
          <Card className="bg-slate-800/60 border-slate-600/50 backdrop-blur-sm shadow-lg">
            <CardHeader className="border-b border-slate-600/30 bg-slate-700/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-400/30">
                    <Activity className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-white">Supplier Management</CardTitle>
                    <CardDescription className="text-slate-300">
                      Review and manage supplier applications
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <SupplierList />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
