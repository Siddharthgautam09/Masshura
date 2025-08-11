import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { auth } from '../../components/firebase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const SupplierLoginPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [email, setEmail] = useState(params.get('email') || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/supplier-dashboard');
    } catch {
      setError('Invalid login credentials.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleLogin} className="bg-white p-8 shadow-md rounded w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Supplier Login</h2>
        <Label>Email</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-4"
        />
        <Label>Password</Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mb-4"
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <Button type="submit" className="w-full">Login</Button>
      </form>
    </div>
  );
};

export default SupplierLoginPage;
