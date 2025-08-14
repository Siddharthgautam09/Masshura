// src/pages/admin/SubscriptionSettings.tsx

import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../components/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Save, Plus, Trash2, Settings, IndianRupee } from 'lucide-react';
import { motion } from 'framer-motion';

interface SubscriptionPlan {
  id: string;
  duration: number;
  price: number;
  label: string;
  isActive: boolean;
}

const SubscriptionSettings = () => {
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([
    { id: '1year', duration: 1, price: 500, label: '1 Year', isActive: true },
    { id: '2year', duration: 2, price: 900, label: '2 Years', isActive: true },
    { id: '5year', duration: 5, price: 2000, label: '5 Years', isActive: true },
  ]);
  
  const [registrationAmount, setRegistrationAmount] = useState(500);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubscriptionSettings();
  }, []);

  const fetchSubscriptionSettings = async () => {
    try {
      const settingsDoc = await getDoc(doc(db, 'settings', 'subscriptions'));
      
      if (settingsDoc.exists()) {
        const data = settingsDoc.data();
        if (data.plans) {
          setSubscriptionPlans(data.plans);
        }
        if (data.registrationAmount) {
          setRegistrationAmount(data.registrationAmount);
        }
      }
    } catch (error) {
      console.error('Error fetching subscription settings:', error);
      toast({
        title: "Error",
        description: "Could not fetch subscription settings.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveSubscriptionSettings = async () => {
    setIsSaving(true);
    try {
      const settingsData = {
        plans: subscriptionPlans,
        registrationAmount: registrationAmount,
        lastUpdated: new Date().toISOString(),
        updatedBy: 'admin'
      };

      await setDoc(doc(db, 'settings', 'subscriptions'), settingsData, { merge: true });
      
      toast({
        title: "Settings Saved",
        description: "Subscription settings have been updated successfully."
      });
    } catch (error) {
      console.error('Error saving subscription settings:', error);
      toast({
        title: "Error",
        description: "Could not save subscription settings.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updatePlan = (planId: string, field: keyof SubscriptionPlan, value: any) => {
    setSubscriptionPlans(plans =>
      plans.map(plan =>
        plan.id === planId ? { ...plan, [field]: value } : plan
      )
    );
  };

  const addNewPlan = () => {
    const newId = `plan_${Date.now()}`;
    const newPlan: SubscriptionPlan = {
      id: newId,
      duration: 1,
      price: 500,
      label: '1 Year',
      isActive: true
    };
    setSubscriptionPlans([...subscriptionPlans, newPlan]);
  };

  const removePlan = (planId: string) => {
    if (subscriptionPlans.length <= 1) {
      toast({
        title: "Cannot Remove",
        description: "At least one subscription plan must remain active.",
        variant: "destructive"
      });
      return;
    }
    setSubscriptionPlans(plans => plans.filter(plan => plan.id !== planId));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        <span className="ml-3 text-slate-300">Loading subscription settings...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Subscription Settings</h1>
          <p className="text-slate-400">Manage registration fees and subscription plans for suppliers</p>
        </div>

        <div className="space-y-6">
          {/* Registration Amount Settings */}
          <Card className="bg-slate-800/70 border-slate-600/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <IndianRupee className="w-5 h-5 mr-2" />
                Registration Amount
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-w-sm">
                <Label htmlFor="registrationAmount" className="text-slate-200 mb-2 block">
                  One-time Registration Fee (₹)
                </Label>
                <Input
                  id="registrationAmount"
                  type="number"
                  value={registrationAmount}
                  onChange={(e) => setRegistrationAmount(Number(e.target.value))}
                  className="bg-slate-700/50 border-slate-500 text-white"
                  min="0"
                />
                <p className="text-xs text-slate-400 mt-2">
                  This amount is charged once when a supplier sets their password
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Plans */}
          <Card className="bg-slate-800/70 border-slate-600/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Subscription Plans
              </CardTitle>
              <Button
                onClick={addNewPlan}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Plan
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subscriptionPlans.map((plan, index) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/30"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                      <div>
                        <Label className="text-slate-200 text-sm">Plan Label</Label>
                        <Input
                          value={plan.label}
                          onChange={(e) => updatePlan(plan.id, 'label', e.target.value)}
                          className="bg-slate-600/50 border-slate-500 text-white mt-1"
                          placeholder="e.g., 1 Year"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-slate-200 text-sm">Duration (Years)</Label>
                        <Input
                          type="number"
                          value={plan.duration}
                          onChange={(e) => updatePlan(plan.id, 'duration', Number(e.target.value))}
                          className="bg-slate-600/50 border-slate-500 text-white mt-1"
                          min="1"
                          max="10"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-slate-200 text-sm">Price (₹)</Label>
                        <Input
                          type="number"
                          value={plan.price}
                          onChange={(e) => updatePlan(plan.id, 'price', Number(e.target.value))}
                          className="bg-slate-600/50 border-slate-500 text-white mt-1"
                          min="0"
                        />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={plan.isActive}
                            onChange={(e) => updatePlan(plan.id, 'isActive', e.target.checked)}
                            className="rounded text-blue-600"
                          />
                          <span className="text-slate-200 text-sm">Active</span>
                        </label>
                        
                        <Button
                          onClick={() => removePlan(plan.id)}
                          variant="destructive"
                          size="sm"
                          className="ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-slate-600/30">
                <h4 className="text-white font-medium mb-2">Preview</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {subscriptionPlans
                    .filter(plan => plan.isActive)
                    .map(plan => (
                      <div key={plan.id} className="bg-slate-700/50 p-3 rounded border border-slate-600/50">
                        <div className="text-white font-medium">{plan.label}</div>
                        <div className="text-slate-300 text-sm">{plan.duration} year{plan.duration > 1 ? 's' : ''}</div>
                        <div className="text-green-400 font-bold">₹{plan.price}</div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={saveSubscriptionSettings}
              disabled={isSaving}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SubscriptionSettings;
