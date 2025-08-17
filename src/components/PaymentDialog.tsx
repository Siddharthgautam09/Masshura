// src/components/PaymentDialog.tsx

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../components/firebase';
import emailjs from '@emailjs/browser';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle, XCircle, CreditCard } from 'lucide-react';
import RenewalPlanSelector from './RenewalPlanSelector';

// Initialize Stripe with your test publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  supplierData: any;
}

const PaymentForm = ({ supplierData, totalAmount, onSuccess, onError }: any) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Debug Stripe loading
  useEffect(() => {
    console.log('Stripe loaded:', !!stripe);
    console.log('Elements loaded:', !!elements);
    if (!stripe) {
      console.error('Stripe failed to load. Check your publishable key.');
    }
  }, [stripe, elements]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setIsProcessing(false);
      return;
    }

    try {
      // Create payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: supplierData.companyName,
          email: supplierData.email,
        },
      });

      if (error) {
        onError(error.message);
        setIsProcessing(false);
        return;
      }

      // In a real implementation, you would send this to your backend
      // For now, we'll simulate a successful payment
      await simulatePayment(paymentMethod.id);
      
      // Calculate expiry date based on subscription duration
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + (supplierData.subscriptionDuration || 1));
      
      // Update supplier payment status
      await updateDoc(doc(db, 'suppliers', supplierData.id), {
        paymentStatus: 'completed',
        paymentDate: new Date().toISOString(),
        paymentAmount: totalAmount,
        paymentMethod: 'stripe',
        paymentId: paymentMethod.id,
        subscriptionExpiryDate: expiryDate.toISOString(),
        status: 'active', // Activate the supplier after payment
      });

      // Send success email
      await sendPaymentSuccessEmail();
      
      onSuccess();
    } catch (error) {
      onError('Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const simulatePayment = async (paymentMethodId: string) => {
    // In production, this would be handled by your backend
    return new Promise((resolve) => {
      setTimeout(resolve, 2000); // Simulate processing time
    });
  };

  const sendPaymentSuccessEmail = async () => {
    try {
      const templateParams = {
        supplier_name: supplierData.companyName,
        to_email: supplierData.email,
        payment_amount: `₹${totalAmount}`,
        company_name: supplierData.companyName,
        payment_date: new Date().toLocaleDateString('en-IN'),
        subscription_plan: supplierData.selectedRenewalPlan?.label || 'Standard',
        subscription_duration: `${supplierData.subscriptionDuration || 1} year${(supplierData.subscriptionDuration > 1) ? 's' : ''}`,
        expiry_date: new Date(Date.now() + (supplierData.subscriptionDuration || 1) * 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
        dashboard_link: `${window.location.origin}/supplier-dashboard`,
      };

      // Use your actual service ID, template ID, and public key
      await emailjs.send(
        'service_gcr919g', // Replace with your actual service ID
        'template_6tej786', // Replace with the Template ID you just copied
        templateParams,
        '_r7BfwEM87Padmulp' // Replace with your actual public key
      );
      
      console.log('Payment success email sent successfully');
    } catch (error) {
      console.error('Failed to send payment success email:', error);
    }
  };

    // If Stripe hasn't loaded yet, show loading state
    if (!stripe || !elements) {
      return (
        <div className="space-y-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              <span className="text-slate-300">Loading payment form...</span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <Card className="bg-slate-700/50 border-slate-600">
          <CardContent className="p-6">
            <div className="mb-2">
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Card Information
              </label>
            </div>
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#ffffff',
                    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                    fontSmoothing: 'antialiased',
                    '::placeholder': {
                      color: '#94a3b8',
                    },
                    iconColor: '#94a3b8',
                  },
                  invalid: {
                    color: '#fa755a',
                    iconColor: '#fa755a',
                  },
                },
                hidePostalCode: true,
              }}
            />
          </CardContent>
        </Card>      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 text-base font-semibold"
      >
        {isProcessing ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing Payment...
          </div>
        ) : (
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Pay ₹{totalAmount} and Activate Account
          </div>
        )}
      </Button>
    </form>
  );
};

const PaymentDialog = ({ isOpen, onClose, supplierData }: PaymentDialogProps) => {
  const [paymentStatus, setPaymentStatus] = useState<'form' | 'success' | 'error'>('form');
  const [errorMessage, setErrorMessage] = useState('');
  const [totalAmount, setTotalAmount] = useState(500);
  const [registrationAmount, setRegistrationAmount] = useState(0);
  const [selectedRenewalPlan, setSelectedRenewalPlan] = useState<string>("");
  const [selectedPlanData, setSelectedPlanData] = useState<any>(null);

  useEffect(() => {
    const regAmount = supplierData && supplierData.registrationAmount ? supplierData.registrationAmount : 500;
    setRegistrationAmount(regAmount);
    const planAmount = supplierData.selectedRenewalPlan?.amount || 0;
    setTotalAmount(regAmount + planAmount);
  }, [supplierData]);

  const handlePaymentSuccess = () => {
    setPaymentStatus('success');
  };

  const handlePaymentError = (error: string) => {
    setErrorMessage(error);
    setPaymentStatus('error');
  };

  const handleGoToDashboard = () => {
    window.location.href = '/supplier-dashboard';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-600 text-white max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            Complete Registration Payment
          </DialogTitle>
        </DialogHeader>

        {paymentStatus === 'form' && (
          <div className="space-y-4">
            <p className="text-slate-300 text-center text-sm">
              Your account has been verified and your password has been set. To activate your Maashura Supplier Portal, please complete the one-time registration payment.
            </p>
            {/* Show only the selected plan, no selection allowed */}
            <div className="bg-slate-700/50 p-3 rounded-lg space-y-2">
              <h3 className="font-semibold text-white mb-2">Selected Plan</h3>
              <div className="flex justify-between">
                <span className="text-slate-400">Plan:</span>
                <span className="text-white">{supplierData.selectedRenewalPlan?.label || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Duration:</span>
                <span className="text-white">{supplierData.selectedRenewalPlan?.years || 1} year{supplierData.selectedRenewalPlan?.years > 1 ? 's' : ''}</span>
              </div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg space-y-2">
              <h3 className="font-semibold text-white mb-2">Payment Summary</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Email:</span>
                  <span className="text-white">{supplierData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Company Name:</span>
                  <span className="text-white">{supplierData.companyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Selected Plan:</span>
                  <span className="text-white">{supplierData.selectedRenewalPlan?.label || '-'}</span>
                </div>
                <hr className="border-slate-600 my-2" />
                <div className="flex justify-between">
                  <span className="text-slate-400">Registration Fee:</span>
                  <span className="text-white">₹{registrationAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Subscription ({supplierData.selectedRenewalPlan?.years || 1} year{supplierData.selectedRenewalPlan?.years > 1 ? 's' : ''}):</span>
                  <span className="text-white">₹{supplierData.selectedRenewalPlan?.amount || 0}</span>
                </div>
                <hr className="border-slate-600 my-2" />
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-200">Total Amount:</span>
                  <span className="text-white text-lg">₹{totalAmount}</span>
                </div>
              </div>
            </div>
            <div>
              <Elements stripe={stripePromise}>
                <PaymentForm
                  supplierData={{
                    ...supplierData,
                    selectedRenewalPlan: supplierData.selectedRenewalPlan,
                    subscriptionAmount: supplierData.selectedRenewalPlan?.amount || 0,
                    subscriptionDuration: supplierData.selectedRenewalPlan?.years || 1,
                  }}
                  totalAmount={totalAmount}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </Elements>
            </div>
          </div>
        )}

        {paymentStatus === 'success' && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-slate-600/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-slate-300" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">🎉 Payment Successful!</h3>
              <p className="text-slate-300">Your Maashura Supplier Portal is now active.</p>
            </div>
            <Button
              onClick={handleGoToDashboard}
              className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800"
            >
              Go to Dashboard
            </Button>
          </div>
        )}

        {paymentStatus === 'error' && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-slate-600/20 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="w-10 h-10 text-slate-300" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-200 mb-2">❌ Payment Failed</h3>
              <p className="text-slate-300 mb-2">{errorMessage}</p>
              <p className="text-slate-400 text-sm">
                Please try a different payment method or contact{' '}
                <a href="mailto:support@maashura.com" className="text-slate-300 underline hover:text-white">
                  support@maashura.com
                </a>
              </p>
            </div>
            <Button
              onClick={() => setPaymentStatus('form')}
              variant="outline"
              className="w-full border-slate-500 text-slate-300 hover:bg-slate-700"
            >
              Try Again
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
