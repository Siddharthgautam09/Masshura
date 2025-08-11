// src/pages/admin/AdminDashboard.tsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { collection, getDocs, query, where } from 'firebase/firestore';
import { signOut } from 'firebase/auth'; // Import the signOut function

import { db, auth } from '../../components/firebase'; // Import your Firestore and Auth instances
import SupplierList from '../../components/admin/SupplierList';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react'; // Import a nice icon for the button

const AdminDashboard = () => {
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch total suppliers and pending approvals from Firestore
        const suppliersCollectionRef = collection(db, 'suppliers');
        const allSuppliersSnapshot = await getDocs(suppliersCollectionRef);
        setTotalSuppliers(allSuppliersSnapshot.size);
        
        const pendingQuery = query(suppliersCollectionRef, where("status", "==", "pending_approval"));
        const pendingSnapshot = await getDocs(pendingQuery);
        setPendingApprovals(pendingSnapshot.size);
      } catch (error) {
        // Dashboard stats fetching failed - user will see loading state persist
        // Could add error toast here if needed
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  // User logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      // Logout failed - could add error toast if needed
      // For now, user can try again or refresh page
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* --- MODIFIED: Header with navigation and logout buttons --- */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <Button asChild>
            <Link to="/admin/settings">Manage Categories</Link>
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Stats cards remain the same */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* ... stats cards ... */}
      </div>
      
      <h2 className="text-xl font-bold mb-4">Supplier Management</h2>
      <SupplierList />
    </div>
  );
};

export default AdminDashboard;
