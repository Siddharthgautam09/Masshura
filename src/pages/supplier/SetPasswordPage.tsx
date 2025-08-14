import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../components/firebase';
import { doc, collection, getDocs, setDoc, deleteDoc, query, where } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Shield, ArrowLeft } from 'lucide-react';

const SetPasswordPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const email = params.get('email') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  // Password validation
  const validatePassword = (pwd: string) => {
    const minLength = pwd.length >= 8;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    
    return {
      minLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial,
      isValid: minLength && hasUpper && hasLower && hasNumber && hasSpecial
    };
  };

  const passwordValidation = validatePassword(password);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate inputs
    if (!passwordValidation.isValid) {
      setError('Password does not meet security requirements');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!email) {
      setError('Email is required');
      return;
    }

    setIsLoading(true);

    try {
      toast({
        title: "Creating Account",
        description: "Setting up your supplier account...",
      });

      // Create Auth user with better error handling
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      // Find and migrate their supplier Firestore doc
      const q = query(collection(db, 'suppliers'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const prevDoc = querySnapshot.docs[0];
        const supplierData = {
          ...prevDoc.data(),
          authUid: user.uid,
          accountCreatedAt: new Date().toISOString(),
          status: 'active'
        };
        
        // Copy their data into a new doc, named by user.uid
        await setDoc(doc(db, 'suppliers', user.uid), supplierData);
        
        // Delete the old doc to avoid duplicates
        await deleteDoc(prevDoc.ref);
      } else {
        // Create new supplier document if none exists
        await setDoc(doc(db, 'suppliers', user.uid), {
          email: email,
          authUid: user.uid,
          accountCreatedAt: new Date().toISOString(),
          status: 'active'
        });
      }

      // Auto-login
      await signInWithEmailAndPassword(auth, email, password);

      toast({
        title: "Account Created!",
        description: "Redirecting to payment setup...",
      });

      // Redirect to payment page after successful password creation
      navigate(`/payment-required?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      console.error('Password setup error:', err);
      
      // Handle specific Firebase auth errors
      let errorMessage = 'Error creating account. Please try again.';
      
      switch (err.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Account already exists. Redirecting to login...';
          toast({
            title: "Account Exists",
            description: "Redirecting to login page...",
          });
          setTimeout(() => navigate(`/supplier-login?email=${email}`), 2000);
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Please choose a stronger password.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address format.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/Password authentication is not enabled. Please contact support.';
          toast({
            title: "Authentication Disabled",
            description: "Email/Password sign-up is not enabled in Firebase. Please enable it in Firebase Console > Authentication > Sign-in method > Email/Password.",
            variant: "destructive",
          });
          break;
        default:
          errorMessage = `Setup failed: ${err.message}`;
      }
      
      setError(errorMessage);
      
      toast({
        title: "Setup Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-20"
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="bg-slate-800/60 backdrop-blur-sm border-slate-600/30 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-blue-500/20 rounded-2xl border border-blue-400/30">
                <Shield className="h-8 w-8 text-blue-400" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white mb-2">
              Set Your Password
            </CardTitle>
            <p className="text-slate-300 text-sm">
              Complete your supplier account setup for
            </p>
            <p className="text-blue-400 font-semibold mt-1">{email}</p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSetPassword} className="space-y-6">
              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300 font-medium">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="bg-slate-700/60 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-400" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Password Requirements */}
              {password && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-400 font-medium">Password Requirements:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className={`flex items-center space-x-1 ${passwordValidation.minLength ? 'text-green-400' : 'text-slate-400'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${passwordValidation.minLength ? 'bg-green-400' : 'bg-slate-500'}`} />
                      <span>8+ characters</span>
                    </div>
                    <div className={`flex items-center space-x-1 ${passwordValidation.hasUpper ? 'text-green-400' : 'text-slate-400'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${passwordValidation.hasUpper ? 'bg-green-400' : 'bg-slate-500'}`} />
                      <span>Uppercase</span>
                    </div>
                    <div className={`flex items-center space-x-1 ${passwordValidation.hasLower ? 'text-green-400' : 'text-slate-400'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${passwordValidation.hasLower ? 'bg-green-400' : 'bg-slate-500'}`} />
                      <span>Lowercase</span>
                    </div>
                    <div className={`flex items-center space-x-1 ${passwordValidation.hasNumber ? 'text-green-400' : 'text-slate-400'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${passwordValidation.hasNumber ? 'bg-green-400' : 'bg-slate-500'}`} />
                      <span>Number</span>
                    </div>
                    <div className={`flex items-center space-x-1 col-span-2 ${passwordValidation.hasSpecial ? 'text-green-400' : 'text-slate-400'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${passwordValidation.hasSpecial ? 'bg-green-400' : 'bg-slate-500'}`} />
                      <span>Special character (!@#$%^&*)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-300 font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm your password"
                    className="bg-slate-700/60 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-400" />
                    )}
                  </Button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-red-400 text-xs">Passwords do not match</p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg space-y-3">
                  <p className="text-red-400 text-sm font-medium">{error}</p>
                  {error.includes('operation-not-allowed') && (
                    <div className="text-xs text-red-300 space-y-2">
                      <p className="font-medium">To fix this issue:</p>
                      <ol className="list-decimal list-inside space-y-1 text-red-300/80">
                        <li>Go to <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="underline">Firebase Console</a></li>
                        <li>Select your project: <code className="bg-red-500/20 px-1 rounded">maashura-admin</code></li>
                        <li>Navigate to: <code className="bg-red-500/20 px-1 rounded">Authentication → Sign-in method</code></li>
                        <li>Enable: <code className="bg-red-500/20 px-1 rounded">Email/Password</code> provider</li>
                        <li>Save and try again</li>
                      </ol>
                    </div>
                  )}
                </div>
              )}

              {/* Development Mode Alternative */}
              {error.includes('operation-not-allowed') && (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-yellow-400 text-sm font-medium mb-3">Development Mode:</p>
                  <Button
                    type="button"
                    onClick={() => {
                      // Skip Firebase Auth and go directly to dashboard for development
                      toast({
                        title: "Development Mode",
                        description: "Skipping authentication for development...",
                      });
                      navigate('/supplier-dashboard');
                    }}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 rounded-lg"
                  >
                    Continue to Dashboard (Dev Mode)
                  </Button>
                  <p className="text-yellow-300/70 text-xs mt-2">
                    ⚠️ This bypasses authentication and should only be used for development
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!passwordValidation.isValid || password !== confirmPassword || isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Lock className="h-4 w-4" />
                    <span>Save & Login</span>
                  </div>
                )}
              </Button>
            </form>

            {/* Back to Login */}
            <div className="text-center pt-4 border-t border-slate-600/30">
              <Button
                variant="ghost"
                onClick={() => navigate('/supplier-login')}
                className="text-slate-400 hover:text-white hover:bg-slate-700/50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SetPasswordPage;
