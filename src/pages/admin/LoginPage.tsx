// src/pages/admin/LoginPage.tsx

import React, { useState } from 'react';
// --- 1. IMPORT new Firebase functions ---
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../components/firebase'; // Your Firebase auth instance
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // The email/password login handler remains the same
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err) {
      setError('Failed to log in. Please check your email and password.');
      console.error(err);
    }
  };

  // --- 2. CREATE a new handler for Google Sign-In ---
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider(); // Create a Google Auth provider instance
    setError('');
    try {
      // Trigger the Google sign-in pop-up window
      await signInWithPopup(auth, provider);
      // If successful, Firebase automatically handles the session, so we can navigate
      navigate('/admin');
    } catch (err) {
      setError('Failed to log in with Google.');
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Admin Login</h1>
        
        {/* Email and Password Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full">
            Log In with Email
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        {/* --- 3. ADD the new Google Sign-In button --- */}
        <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
          {/* You can add a Google icon here later */}
          Sign in with Google
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
