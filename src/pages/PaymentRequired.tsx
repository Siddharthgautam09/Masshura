// src/pages/PaymentRequired.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../components/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, CreditCard, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
 import PaymentDialog from '@/components/PaymentDialog';

interface SupplierData {
  id: string;
  companyName: string;
  email: string;
  paymentStatus?: string;
  selectedSubscriptionPlan?: {
    id: string;
    label: string;
    price: number;
    duration: number;
  };
  subscriptionAmount?: number;
  [key: string]: any;
}

const PaymentRequired = () => {
  const [searchParams] = useSearchParams();
  const [supplierData, setSupplierData] = useState<SupplierData | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  const email = searchParams.get('email');

  useEffect(() => {
    const fetchSupplierData = async (userId: string) => {
      try {
        const supplierDoc = await getDoc(doc(db, 'suppliers', userId));
        if (supplierDoc.exists()) {
          const data = { id: supplierDoc.id, ...supplierDoc.data() } as SupplierData;
          setSupplierData(data);
          
          // If payment is already completed, redirect to dashboard
          if (data.paymentStatus === 'completed') {
            navigate('/supplier-dashboard');
          }
        }
      } catch (error) {
        console.error('Error fetching supplier data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && email) {
        fetchSupplierData(user.uid);
      } else {
        navigate('/supplier-login');
      }
    });

    return () => unsubscribe();
  }, [email, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Progress Bar */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 text-green-400 mr-2" />
              <span className="text-green-400 font-medium">Step 1: Verification</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <div className="flex items-center">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <span className="text-blue-400 font-medium">Step 3: Payment</span>
            </div>
          </div>
        </div>

        <Card className="bg-slate-800/90 border-slate-600/50 shadow-2xl backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-white mb-2">
              Complete Your Registration
            </CardTitle>
            <p className="text-slate-300 text-base">
              Your password has been successfully created for{' '}
              <strong className="text-blue-400">{email}</strong>
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/30">
              <h3 className="font-semibold text-white mb-2">Next Step (Step 3):</h3>
              <p className="text-slate-300 text-sm">
                Complete a small one-time registration payment to finish your sign-up and unlock portal access.
              </p>
            </div>

            {supplierData && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Email:</span>
                  <span className="text-white font-medium">{supplierData.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Company:</span>
                  <span className="text-white font-medium">{supplierData.companyName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Selected Plan:</span>
                  <span className="text-white font-medium">
                    {supplierData.selectedSubscriptionPlan?.label || 'Standard'}
                  </span>
                </div>
              </div>
            )}

            <Button
              onClick={() => setShowPaymentDialog(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 text-base font-semibold"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Proceed to Payment
            </Button>

            <div className="text-center">
              <p className="text-xs text-slate-400">
                Need help? Contact us at{' '}
                <a href="mailto:support@maashura.com" className="text-blue-400 hover:text-blue-300">
                  support@maashura.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-slate-500 text-center mt-4">
          This is a one-time registration fee. You will receive a receipt by email after successful payment.
        </p>
      </motion.div>

      {/* Payment Dialog */}
      {/* TODO: Implement PaymentDialog component */}
      {showPaymentDialog && supplierData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Payment Processing</h3>
            <p className="text-slate-300 mb-4">
              Payment functionality will be implemented here.
            </p>
            <Button onClick={() => setShowPaymentDialog(false)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentRequired;
