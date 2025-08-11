// src/pages/supplier/SupplierDashboard.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../components/firebase'; // Adjust path if needed

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Defines the structure for a supplier object for type safety
interface SupplierData {
  id: string;
  companyName?: string;
  country?: string;
  email?: string;
  status?: string;
  [key: string]: any; // Allows for other properties not explicitly defined
}

const SupplierDashboard = () => {
  const [supplier, setSupplier] = useState<SupplierData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // State for editing mode and form data
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ companyName: '', country: '' });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const supplierDocRef = doc(db, 'suppliers', user.uid);
        const docSnap = await getDoc(supplierDocRef);

        if (docSnap.exists()) {
          const supplierData: SupplierData = { id: docSnap.id, ...docSnap.data() };
          setSupplier(supplierData);
          // Initialize form data when supplier data is fetched
          setFormData({
            companyName: supplierData.companyName || '',
            country: supplierData.country || '',
            // Add other fields you want to be editable here
          });
        } else {
          console.error("Supplier document not found.");
          signOut(auth); // Log out if data is missing
        }
      } else {
        navigate('/supplier-login');
      }
      setIsLoading(false);
    });
    // Cleanup function to prevent memory leaks
    return () => unsubscribe();
  }, [navigate]);

  // Handler for form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handler for saving profile changes
  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplier) return; // Guard clause to ensure supplier exists
    try {
      const supplierDocRef = doc(db, 'suppliers', supplier.id);
      await updateDoc(supplierDocRef, formData);

      // --- THIS IS THE UPDATED LINE ---
      // Update local state to reflect changes instantly using the checked supplier object
      setSupplier({ ...supplier, ...formData });

      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading dashboard...</div>;
  }

  if (!supplier) {
    return null; // The useEffect hook handles redirection
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome, {supplier.companyName}</h1>
        <Button variant="outline" onClick={() => signOut(auth)}>Logout</Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-xl font-semibold">Your Profile</h2>
          {!isEditing && (
            <Button variant="secondary" onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </div>

        {/* --- Conditionally render the form or the display text --- */}
        {isEditing ? (
          <form onSubmit={handleSaveChanges}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" name="companyName" value={formData.companyName} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input id="country" name="country" value={formData.country} onChange={handleInputChange} />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button type="submit">Save Changes</Button>
              <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><strong>Company Name:</strong> {supplier.companyName}</div>
            <div><strong>Country:</strong> {supplier.country}</div>
            <div><strong>Email:</strong> {supplier.email}</div>
            <div><strong>Status:</strong> {supplier.status}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierDashboard;
