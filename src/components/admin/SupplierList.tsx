// src/components/admin/SupplierList.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'; 
import { db } from '../firebase.ts';
import { Link } from 'react-router-dom';
import { Search, Filter, Eye, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

// Import UI components from shadcn/ui
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const ITEMS_PER_PAGE = 10;

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // State for search, filter, and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // This useEffect fetches ALL suppliers from Firestore
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'suppliers'));
        const supplierList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSuppliers(supplierList);
      } catch (error) {
        toast({ title: "Error", description: "Could not fetch supplier data.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSuppliers();
  }, [toast]);

  // Function to refresh supplier data
  const refreshSuppliers = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'suppliers'));
      const supplierList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSuppliers(supplierList);
      toast({ title: "Success", description: "Supplier data refreshed." });
    } catch (error) {
      toast({ title: "Error", description: "Could not refresh supplier data.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // Memoized logic to filter suppliers based on search and status
  const filteredSuppliers = useMemo(() => {
    return suppliers
      .filter(supplier => {
        const companyName = supplier.companyName?.toLowerCase() || '';
        const email = supplier.email?.toLowerCase() || '';
        const term = searchTerm.toLowerCase();
        return companyName.includes(term) || email.includes(term);
      })
      .filter(supplier => {
        if (statusFilter === 'all') return true;
        return supplier.status === statusFilter;
      });
  }, [suppliers, searchTerm, statusFilter]);

  // Memoized logic to paginate the filtered list
  const paginatedSuppliers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSuppliers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredSuppliers, currentPage]);

  const totalPages = Math.ceil(filteredSuppliers.length / ITEMS_PER_PAGE);

  const updateSupplierStatusInState = (supplierId: string, newStatus: string) => {
    setSuppliers(currentSuppliers =>
      currentSuppliers.map(s => (s.id === supplierId ? { ...s, status: newStatus } : s))
    );
  };
  
  const handleApprove = async (supplierId: string) => {
    await updateDoc(doc(db, 'suppliers', supplierId), { status: 'approved' });
    updateSupplierStatusInState(supplierId, 'approved');
    toast({ title: "Success", description: "Supplier has been approved." });
  };

  const handleReject = async (supplierId: string) => {
    await updateDoc(doc(db, 'suppliers', supplierId), { status: 'rejected' });
    updateSupplierStatusInState(supplierId, 'rejected');
    toast({ title: "Success", description: "Supplier has been rejected.", variant: "destructive" });
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        <span className="ml-3 text-slate-300">Loading suppliers...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-1">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search by company name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-500 text-slate-200 placeholder-slate-400 focus:border-blue-400 focus:ring-blue-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-slate-400 h-4 w-4" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-slate-800/50 border-slate-500 text-slate-200">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all" className="text-slate-200 hover:bg-slate-700">All Statuses</SelectItem>
                <SelectItem value="pending_approval" className="text-slate-200 hover:bg-slate-700">Pending Approval</SelectItem>
                <SelectItem value="approved" className="text-slate-200 hover:bg-slate-700">Approved</SelectItem>
                <SelectItem value="rejected" className="text-slate-200 hover:bg-slate-700">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={refreshSuppliers}
            variant="outline"
            size="sm"
            className="border-slate-500 text-slate-300 hover:bg-slate-700/50 hover:text-slate-200"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <div className="text-sm text-slate-400">
            Showing {filteredSuppliers.length} of {suppliers.length} suppliers
          </div>
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="bg-slate-800/60 rounded-lg border border-slate-600/50 shadow-sm overflow-hidden backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-700/50 border-slate-600/50">
              <TableHead className="font-semibold text-slate-200">Ref No</TableHead>
              <TableHead className="font-semibold text-slate-200">Company Name</TableHead>
              <TableHead className="font-semibold text-slate-200">Country</TableHead>
              <TableHead className="font-semibold text-slate-200">Email</TableHead>
              <TableHead className="font-semibold text-slate-200">Status</TableHead>
              <TableHead className="font-semibold text-slate-200 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedSuppliers.map((supplier, index) => (
              <TableRow key={supplier.id} className="hover:bg-slate-700/30 transition-colors border-slate-600/30">
                <TableCell className="font-medium text-slate-200">
                  {supplier.refNo || `REF-${String(index + 1).padStart(3, '0')}`}
                </TableCell>
                <TableCell className="font-medium text-slate-200">{supplier.companyName}</TableCell>
                <TableCell className="text-slate-300">{supplier.country}</TableCell>
                <TableCell className="text-slate-300">{supplier.email}</TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      supplier.status === 'approved' ? 'default' : 
                      supplier.status === 'pending_approval' ? 'secondary' : 
                      'destructive'
                    }
                    className={
                      supplier.status === 'approved' ? 'bg-green-500/20 text-green-400 border-green-400/30' :
                      supplier.status === 'pending_approval' ? 'bg-orange-500/20 text-orange-400 border-orange-400/30' :
                      'bg-red-500/20 text-red-400 border-red-400/30'
                    }
                  >
                    {supplier.status?.replace('_', ' ').toUpperCase() || 'N/A'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    {supplier.status === 'pending_approval' && (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => handleApprove(supplier.id)}
                          className="bg-green-600/80 hover:bg-green-600 text-white border-green-500"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleReject(supplier.id)}
                          className="bg-red-600/80 hover:bg-red-600 border-red-500"
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    <Button asChild variant="outline" size="sm" className="border-slate-500 text-slate-300 hover:bg-slate-700/50 hover:text-slate-200">
                      <Link to={`/admin/supplier/${supplier.id}`}>
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Empty State */}
        {paginatedSuppliers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-slate-200 mb-2">No suppliers found</h3>
            <p className="text-slate-400">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* --- PAGINATION CONTROLS --- */}
      <div className="flex items-center justify-between mt-4">
        {/* ... Pagination UI code ... */}
      </div>
    </div>
  );
};

export default SupplierList;
