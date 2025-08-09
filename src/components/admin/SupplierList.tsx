// src/components/admin/SupplierList.tsx

import React, { useState, useEffect } from 'react';

// --- Step 1: Import everything you need ---
// Firebase functions for database interaction
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'; 
// Your initialized Firebase instance from `firebase.ts`
import { db } from '../firebase.ts'; 
// Your UI components from shadcn/ui
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const SupplierList = () => {
  // --- Step 2: Set up state to hold your data ---
  // This will start as an empty array and be filled from Firestore
  const [suppliers, setSuppliers] = useState([]);
  // Optional: Add a loading state for a better user experience
  const [isLoading, setIsLoading] = useState(true);

  // --- Step 3: Fetch data from Firestore when the component loads ---
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        // Get a reference to the "suppliers" collection
        const suppliersCollectionRef = collection(db, 'suppliers');
        // Fetch all documents
        const querySnapshot = await getDocs(suppliersCollectionRef);
        // Map over the documents to create a clean array of supplier objects
        const supplierList = querySnapshot.docs.map(doc => ({
          id: doc.id,      // Keep the unique Firestore document ID
          ...doc.data()    // Spread the rest of the data (companyName, email, etc.)
        }));
        // Update the state with the fetched data
        setSuppliers(supplierList);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching is done
      }
    };

    fetchSuppliers();
  }, []); // The empty dependency array `[]` means this runs only once

  // --- Step 4: Create the function to update a supplier's status ---
  const handleStatusChange = async (supplierId, newStatus) => {
    // Get a reference to the specific supplier document by its ID
    const supplierDocRef = doc(db, 'suppliers', supplierId);
    const newStatusString = newStatus ? 'active' : 'inactive';

    try {
      // Update the 'status' field in the Firestore document
      await updateDoc(supplierDocRef, {
        status: newStatusString
      });

      // Update the local state immediately for a responsive UI
      setSuppliers(currentSuppliers =>
        currentSuppliers.map(s =>
          s.id === supplierId ? { ...s, status: newStatusString } : s
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (isLoading) {
    return <div>Loading suppliers...</div>;
  }

  // --- Step 5: Render the table with the real data ---
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ref No</TableHead>
          <TableHead>Company Name</TableHead>
          <TableHead>Country</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {suppliers.map((supplier) => (
          <TableRow key={supplier.id}>
            <TableCell>{supplier.refNo}</TableCell>
            <TableCell>{supplier.companyName}</TableCell>
            <TableCell>{supplier.country}</TableCell>
            <TableCell>{supplier.email}</TableCell>
            <TableCell>
              {/* The Switch component to toggle status */}
              <Switch
                checked={supplier.status === 'active'}
                onCheckedChange={(isChecked) => handleStatusChange(supplier.id, isChecked)}
              />
            </TableCell>
            <TableCell>
              {/* This button can later link to a detailed view page */}
              <Button variant="outline" size="sm">View</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SupplierList;
