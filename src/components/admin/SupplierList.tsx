// src/components/admin/SupplierList.tsx

import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'; 
import { db } from '../firebase.ts'; 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge"; // Import Badge component

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSuppliers = async () => {
      const querySnapshot = await getDocs(collection(db, 'suppliers'));
      const supplierList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSuppliers(supplierList);
      setIsLoading(false);
    };
    fetchSuppliers();
  }, []);

  const updateSupplierStatus = (supplierId, newStatus) => {
    setSuppliers(currentSuppliers =>
      currentSuppliers.map(s => (s.id === supplierId ? { ...s, status: newStatus } : s))
    );
  };

  const handleStatusToggle = async (supplierId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const supplierDocRef = doc(db, 'suppliers', supplierId);
    await updateDoc(supplierDocRef, { status: newStatus });
    updateSupplierStatus(supplierId, newStatus);
  };
  
  // --- NEW: Function to handle approving a supplier ---
  const handleApprove = async (supplierId) => {
    const supplierDocRef = doc(db, 'suppliers', supplierId);
    // Setting status to 'approved' will trigger our Cloud Function later
    await updateDoc(supplierDocRef, { status: 'approved' });
    updateSupplierStatus(supplierId, 'approved');
  };

  // --- NEW: Function to handle rejecting a supplier ---
  const handleReject = async (supplierId) => {
    const supplierDocRef = doc(db, 'suppliers', supplierId);
    await updateDoc(supplierDocRef, { status: 'rejected' });
    updateSupplierStatus(supplierId, 'rejected');
  };

  if (isLoading) return <div>Loading suppliers...</div>;

  return (
    <Table>
      <TableHeader>
        {/* ... TableHeader content is unchanged ... */}
      </TableHeader>
      <TableBody>
        {suppliers.map((supplier) => (
          <TableRow key={supplier.id}>
            <TableCell>{supplier.refNo}</TableCell>
            <TableCell>{supplier.companyName}</TableCell>
            <TableCell>{supplier.country}</TableCell>
            <TableCell>{supplier.email}</TableCell>
            <TableCell>
              {/* --- MODIFIED: Show status as a badge --- */}
              <Badge variant={
                supplier.status === 'active' ? 'default' :
                supplier.status === 'approved' ? 'default' :
                supplier.status === 'pending_approval' ? 'secondary' : 'destructive'
              }>
                {supplier.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </TableCell>
            <TableCell className="flex gap-2">
              {/* --- MODIFIED: Conditionally render buttons based on status --- */}
              {supplier.status === 'pending_approval' && (
                <>
                  <Button size="sm" onClick={() => handleApprove(supplier.id)}>Approve</Button>
                  <Button variant="destructive" size="sm" onClick={() => handleReject(supplier.id)}>Reject</Button>
                </>
              )}
              {(supplier.status === 'active' || supplier.status === 'inactive') && (
                <Switch
                  checked={supplier.status === 'active'}
                  onCheckedChange={() => handleStatusToggle(supplier.id, supplier.status)}
                />
              )}
               {(supplier.status === 'approved' || supplier.status === 'rejected') && (
                 <Button variant="outline" size="sm" disabled>Completed</Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SupplierList;
