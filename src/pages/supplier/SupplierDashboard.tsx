import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../components/firebase';
import { Button } from '@/components/ui/button';

const SupplierDashboard = () => {
  const [supplier, setSupplier] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const supplierDoc = await getDoc(doc(db, 'suppliers', user.uid));
        if (supplierDoc.exists()) setSupplier(supplierDoc.data());
      } else {
        window.location.href = '/supplier-login';
      }
    });
    return unsubscribe;
  }, []);

  if (!supplier) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome, {supplier.companyName}</h1>
      <p><strong>Email:</strong> {supplier.email}</p>
      <p><strong>Status:</strong> {supplier.status}</p>
      <Button className="mt-4" onClick={() => signOut(auth)}>Logout</Button>
    </div>
  );
};

export default SupplierDashboard;
