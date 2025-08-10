// src/pages/admin/SupplierDetailPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../components/firebase';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const SupplierDetailPage = () => {
  const { id } = useParams(); // Gets the supplier's ID from the URL
  const [supplier, setSupplier] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSupplier = async () => {
      if (!id) return;
      try {
        const supplierDocRef = doc(db, 'suppliers', id);
        const docSnap = await getDoc(supplierDocRef);

        if (docSnap.exists()) {
          setSupplier({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching supplier details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSupplier();
  }, [id]);

  if (isLoading) {
    return <div className="container p-4">Loading supplier details...</div>;
  }

  if (!supplier) {
    return <div className="container p-4">Supplier not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Button asChild variant="outline" className="mb-6">
        <Link to="/admin">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Link>
      </Button>

      <h1 className="text-3xl font-bold mb-4">{supplier.companyName}</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Supplier Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><strong>Reference No:</strong> {supplier.refNo || 'N/A'}</div>
          <div><strong>Status:</strong> {supplier.status || 'N/A'}</div>
          <div><strong>Country:</strong> {supplier.country || 'N/A'}</div>
          <div><strong>Email:</strong> {supplier.email || 'N/A'}</div>
          {/* Add any other fields you have in your supplier documents */}
        </div>
      </div>
    </div>
  );
};

export default SupplierDetailPage;
