// src/pages/admin/AdminDashboard.tsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../components/firebase.ts';
import SupplierList from '../../components/admin/SupplierList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Activity,
  Filter,
  X
} from 'lucide-react';

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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [approvedSuppliers, setApprovedSuppliers] = useState(0);
  const [rejectedSuppliers, setRejectedSuppliers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [allSuppliers, setAllSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const suppliersCollectionRef = collection(db, 'suppliers');
        
        // Fetch all suppliers
        const allSuppliersSnapshot = await getDocs(suppliersCollectionRef);
        const suppliersData: Supplier[] = allSuppliersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Supplier));
        
        console.log('Fetched suppliers:', suppliersData); // Debug log
        
        setAllSuppliers(suppliersData);
        setFilteredSuppliers(suppliersData);
        setTotalSuppliers(allSuppliersSnapshot.size);
        
        // Calculate stats from the data
        const pending = suppliersData.filter(supplier => supplier.status === 'pending_approval').length;
        const approved = suppliersData.filter(supplier => supplier.status === 'approved').length;
        const rejected = suppliersData.filter(supplier => supplier.status === 'rejected').length;
        
        setPendingApprovals(pending);
        setApprovedSuppliers(approved);
        setRejectedSuppliers(rejected);

        // Extract unique categories from both 'category' and 'categories' fields
        const allCategoryValues = suppliersData.flatMap(supplier => {
          let cats: string[] = [];
          if (typeof supplier.category === 'string' && supplier.category.trim() !== '') {
            cats.push(supplier.category.trim());
          }
          if (Array.isArray(supplier.categories)) {
            cats = cats.concat(supplier.categories.map(c => c.trim()).filter(Boolean));
          }
          return cats;
        });
        const uniqueCategories = Array.from(new Set(allCategoryValues)).sort();
        console.log('Unique categories:', uniqueCategories); // Debug log
        setCategories(uniqueCategories);

      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  // Filter suppliers based on selected filters
  useEffect(() => {
    console.log('Applying filters:', { statusFilter, categoryFilter }); // Debug log
    
    let filtered = [...allSuppliers];

    // Apply status filter (robust)
    if (statusFilter !== 'all') {
      const filterStatus = statusFilter.trim().toLowerCase();
      filtered = filtered.filter(supplier => {
        const supplierStatus = (supplier.status || '').toString().trim().toLowerCase();
        return supplierStatus === filterStatus;
      });
    }

    // Apply category filter (supports string or array)
    if (categoryFilter !== 'all') {
      const filterCategory = categoryFilter.trim();
      filtered = filtered.filter(supplier => {
        if (typeof supplier.category === 'string' && supplier.category.trim() === filterCategory) {
          return true;
        }
        if (Array.isArray(supplier.categories) && supplier.categories.map(c => c.trim()).includes(filterCategory)) {
          return true;
        }
        return false;
      });
    }

    console.log('Filtered suppliers:', filtered.length, 'out of', allSuppliers.length); // Debug log
    setFilteredSuppliers(filtered);
  }, [statusFilter, categoryFilter, allSuppliers]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setCategoryFilter('all');
  };

  const hasActiveFilters = statusFilter !== 'all' || categoryFilter !== 'all';

  // Helper function to get display text for status
  const getStatusDisplayText = (status: string) => {
    switch (status) {
      case 'pending_approval':
        return 'Pending Approval';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, description }: {
    title: string;
    value: number;
    icon: React.ElementType;
    color: string;
    description: string;
  }) => (
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
                    <p className="text-sm text-slate-300">Manage companies and system operations</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  asChild 
                  variant="outline" 
                  className="bg-slate-700/50 border-slate-500 text-slate-200 hover:bg-slate-600/70 hover:text-white"
                >
                  <Link to="/admin/payments">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Payment Dashboard
                  </Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  className="bg-slate-700/50 border-slate-500 text-slate-200 hover:bg-slate-600/70 hover:text-white"
                >
                  <Link to="/admin/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Admin Settings
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
                title="Total Companies"
                value={totalSuppliers}
                icon={Users}
                color="from-blue-500 to-blue-600"
                description="Registered companies"
              />
              <StatCard
                title="Pending Approvals"
                value={pendingApprovals}
                icon={Clock}
                color="from-orange-500 to-orange-600"
                description="Awaiting review"
              />
              <StatCard
                title="Approved Companies"
                value={approvedSuppliers}
                icon={CheckCircle}
                color="from-green-500 to-green-600"
                description="Active companies"
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

          {/* Quick Actions Section */}
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-400/30 mr-3">
                <TrendingUp className="h-5 w-5 text-purple-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-slate-800/60 border-slate-600/50 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 cursor-pointer">
                <Link to="/admin/payments">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-500/20 rounded-lg border border-green-400/30">
                        <TrendingUp className="h-5 w-5 text-green-400" />
                      </div>
                      <CardTitle className="text-white text-lg">Payment Dashboard</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-300">
                      Monitor payment history, subscription status, and revenue analytics
                    </CardDescription>
                  </CardContent>
                </Link>
              </Card>

              <Card className="bg-slate-800/60 border-slate-600/50 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 cursor-pointer">
                <Link to="/admin/settings">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-400/30">
                        <Settings className="h-5 w-5 text-blue-400" />
                      </div>
                      <CardTitle className="text-white text-lg">Admin Settings</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-300">
                      Configure system settings, user management, and platform preferences
                    </CardDescription>
                  </CardContent>
                </Link>
              </Card>

              <Card className="bg-slate-800/60 border-slate-600/50 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 cursor-pointer">
                <Link to="/admin/subscription-settings">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-400/30">
                        <Settings className="h-5 w-5 text-purple-400" />
                      </div>
                      <CardTitle className="text-white text-lg">Subscription Plans</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-300">
                      Manage subscription pricing, renewal rates, and plan configurations
                    </CardDescription>
                  </CardContent>
                </Link>
              </Card>
            </div>
          </div>

          {/* Company Management Section */}
          <Card className="bg-slate-800/60 border-slate-600/50 backdrop-blur-sm shadow-lg">
            <CardHeader className="border-b border-slate-600/30 bg-slate-700/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-400/30">
                    <Activity className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-white">Company Management</CardTitle>
                    <CardDescription className="text-slate-300">
                      Review and manage company applications ({filteredSuppliers.length} of {totalSuppliers} companies)
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* Filters Section */}
              <div className="mb-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-slate-700/50 rounded-lg border border-slate-600/30">
                    <Filter className="h-4 w-4 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white">Filters</h3>
                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                      className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/70 hover:text-white"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Clear Filters
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Status Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Filter by Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-slate-200">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending_approval">Pending Approval</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Category Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Filter by Category</label>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-slate-200">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Active Filters Display */}
                {hasActiveFilters && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {statusFilter !== 'all' && (
                      <div className="flex items-center bg-blue-500/20 border border-blue-400/30 rounded-full px-3 py-1 text-sm text-blue-300">
                        <span className="mr-2">Status: {getStatusDisplayText(statusFilter)}</span>
                        <button
                          onClick={() => setStatusFilter('all')}
                          className="hover:text-blue-200"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                    {categoryFilter !== 'all' && (
                      <div className="flex items-center bg-purple-500/20 border border-purple-400/30 rounded-full px-3 py-1 text-sm text-purple-300">
                        <span className="mr-2">Category: {categoryFilter}</span>
                        <button
                          onClick={() => setCategoryFilter('all')}
                          className="hover:text-purple-200"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Debug Information - Remove in production */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mb-4 p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
                  <p className="text-xs text-slate-400">
                    Debug: Showing {filteredSuppliers.length} of {allSuppliers.length} suppliers
                    {statusFilter !== 'all' && ` | Status: ${statusFilter}`}
                    {categoryFilter !== 'all' && ` | Category: ${categoryFilter}`}
                  </p>
                </div>
              )}

              {/* Supplier List with filtered data */}
              <SupplierList 
                suppliers={allSuppliers}
                isLoading={isLoading}
                statusFilter={statusFilter}
                categoryFilter={categoryFilter}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;