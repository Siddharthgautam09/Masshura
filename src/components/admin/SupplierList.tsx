// src/components/admin/SupplierList.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'; 
import { db } from '../firebase'; 
import { Link } from 'react-router-dom';

// Import UI components
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ITEMS_PER_PAGE = 10; // Define how many suppliers to show per page

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // States for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // --- STEP 1: Add state for pagination ---
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // ... fetching logic remains the same ...
    const fetchSuppliers = async () => {
      const querySnapshot = await getDocs(collection(db, 'suppliers'));
      const supplierList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSuppliers(supplierList);
      setIsLoading(false);
    };
    fetchSuppliers();
  }, []);

  // Filter logic remains the same
  const filteredSuppliers = useMemo(() => {
    return suppliers
      .filter(supplier => 
        supplier.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(supplier => {
        if (statusFilter === 'all') return true;
        return supplier.status === statusFilter;
      });
  }, [suppliers, searchTerm, statusFilter]);

  // --- STEP 2: Create a paginated list from the filtered list ---
  const paginatedSuppliers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredSuppliers.slice(startIndex, endIndex);
  }, [filteredSuppliers, currentPage]);

  const totalPages = Math.ceil(filteredSuppliers.length / ITEMS_PER_PAGE);

  // ... (handler functions are unchanged) ...
  const updateSupplierStatus = (supplierId, newStatus) => { setSuppliers(currentSuppliers => currentSuppliers.map(s => (s.id === supplierId ? { ...s, status: newStatus } : s))); };
  const handleStatusToggle = async (supplierId, currentStatus) => { const newStatus = currentStatus === 'active' ? 'inactive' : 'active'; await updateDoc(doc(db, 'suppliers', supplierId), { status: newStatus }); updateSupplierStatus(supplierId, newStatus); };
  const handleApprove = async (supplierId) => { await updateDoc(doc(db, 'suppliers', supplierId), { status: 'approved' }); updateSupplierStatus(supplierId, 'approved'); };
  const handleReject = async (supplierId) => { await updateDoc(doc(db, 'suppliers', supplierId), { status: 'rejected' }); updateSupplierStatus(supplierId, 'rejected'); };

  if (isLoading) return <div>Loading suppliers...</div>;

  return (
    <div>
      {/* Filter UI is unchanged */}
      <div className="flex items-center gap-4 mb-4">
        {/* ... search and filter inputs ... */}
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            {/* ... TableHeader ... */}
          </TableHeader>
          <TableBody>
            {/* --- MODIFIED: Map over the paginated list --- */}
            {paginatedSuppliers.map((supplier) => (
              // ... TableRow content is the same ...
              <TableRow key={supplier.id}>
                <TableCell>{supplier.refNo}</TableCell>
                <TableCell>{supplier.companyName}</TableCell>
                <TableCell>{supplier.country}</TableCell>
                <TableCell>{supplier.email}</TableCell>
                <TableCell>
                  <Badge variant={/* ... badge logic ... */ 'default'}>
                    {supplier.status?.replace('_', ' ').toUpperCase() || 'N/A'}
                  </Badge>
                </TableCell>
                <TableCell className="flex gap-2 items-center">
                  {/* ... action buttons ... */}
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/admin/supplier/${supplier.id}`}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* --- STEP 3: Add the pagination controls UI --- */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Showing {Math.min(filteredSuppliers.length, ((currentPage -1) * ITEMS_PER_PAGE) + 1)} to {Math.min(filteredSuppliers.length, currentPage * ITEMS_PER_PAGE)} of {filteredSuppliers.length} suppliers.
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages > 0 ? totalPages : 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SupplierList;
