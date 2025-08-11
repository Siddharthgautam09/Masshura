// src/pages/admin/LoginPage.tsx

import React, { useState } from 'react';
// --- 1. IMPORT new Firebase functions ---
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../components/firebase'; // Your Firebase auth instance
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  // Email/password authentication handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err) {
      // Show user-friendly error message via toast
      toast({
        title: "Login Failed",
        description: "Invalid email or password.",
        variant: "destructive",
      });
    }
  };

  // Google authentication handler
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    
    try {
      // Trigger Google sign-in popup
      await signInWithPopup(auth, provider);
      navigate('/admin');
    } catch (err) {
      // Show user-friendly error message via toast
      toast({
        title: "Login Failed",
        description: "Failed to log in with Google.",
        variant: "destructive",
      });
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
