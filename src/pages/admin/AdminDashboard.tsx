// src/pages/admin/AdminDashboard.tsx

import React, { useState, useEffect } from 'react';
import SupplierList from '../../components/admin/SupplierList';
import { db } from '../../components/firebase'; // Import your Firestore instance
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  // State to hold the dynamic values from Firestore
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch stats from Firestore when the component loads
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const suppliersCollectionRef = collection(db, 'suppliers');
        
        // 1. Get the total count of all suppliers
        const allSuppliersSnapshot = await getDocs(suppliersCollectionRef);
        setTotalSuppliers(allSuppliersSnapshot.size);
        
        // 2. Get the count of suppliers needing approval
        // Note: Change 'pending_approval' if you use a different status name
        const pendingQuery = query(suppliersCollectionRef, where("status", "==", "pending_approval"));
        const pendingSnapshot = await getDocs(pendingQuery);
        setPendingApprovals(pendingSnapshot.size);
        
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []); // The empty array [] ensures this runs only once

  return (
    <div className="container mx-auto p-4">
      {/* --- MODIFIED: Header with navigation button --- */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button asChild>
          <Link to="/admin/settings">Manage Categories</Link>
        </Button>
      </div>

      {/* --- MODIFIED: Stats cards now show live data --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600">Total Supplier Registrations</h3>
          <p className="text-3xl font-bold">{isLoading ? '...' : totalSuppliers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600">Pending Approvals</h3>
          <p className="text-3xl font-bold">{isLoading ? '...' : pendingApprovals}</p>
        </div>
      </div>
      
      <h2 className="text-xl font-bold mb-4">Supplier Management</h2>
      <SupplierList />
    </div>
  );
};

export default AdminDashboard;
