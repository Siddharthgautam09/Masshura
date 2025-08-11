import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../components/firebase';
import { doc, collection, getDocs, setDoc, deleteDoc, query, where } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const SetPasswordPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const email = params.get('email') || '';
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      // Create Auth user
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      // --- Find and migrate their supplier Firestore doc ---
      // 1. Find the supplier document by email
      const q = query(collection(db, 'suppliers'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const prevDoc = querySnapshot.docs[0];
        // 2. Copy their data into a new doc, named by user.uid
        await setDoc(doc(db, 'suppliers', user.uid), prevDoc.data());
        // 3. Optionally, delete the old doc (to avoid duplicates)
        await deleteDoc(prevDoc.ref);
      }

      // Auto-login
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/supplier-dashboard');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Account already exists. Please log in.');
        navigate(`/supplier-login?email=${email}`);
      } else {
        setError('Error creating account. Please try again.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSetPassword} className="bg-white p-8 shadow-md rounded w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Set Your Password</h2>
        <p className="text-sm mb-4">For: <strong>{email}</strong></p>
        <Label htmlFor="password">New Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mb-4"
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <Button type="submit" className="w-full">Save & Login</Button>
      </form>
    </div>
  );
};

export default SetPasswordPage;
