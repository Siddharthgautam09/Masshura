// src/pages/admin/SubscriptionSettings.tsx

import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../components/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Save, Plus, Trash2, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

interface RenewalAmount {
  id: string;
  years: number;
  amount: number;
  label: string;
  isActive: boolean;
}

const SubscriptionSettings = () => {
  const [renewalAmounts, setRenewalAmounts] = useState<RenewalAmount[]>([
    { id: 'renewal_1year', years: 1, amount: 300, label: '1 Year Renewal', isActive: true },
    { id: 'renewal_2year', years: 2, amount: 550, label: '2 Years Renewal', isActive: true },
    { id: 'renewal_3year', years: 3, amount: 800, label: '3 Years Renewal', isActive: true },
    { id: 'renewal_5year', years: 5, amount: 1200, label: '5 Years Renewal', isActive: true },
  ]);
  
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
        if (data.renewalAmounts) {
          setRenewalAmounts(data.renewalAmounts);
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
        renewalAmounts: renewalAmounts,
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

  const updateRenewalAmount = (renewalId: string, field: keyof RenewalAmount, value: any) => {
    setRenewalAmounts(renewals =>
      renewals.map(renewal =>
        renewal.id === renewalId ? { ...renewal, [field]: value } : renewal
      )
    );
  };

  const addNewRenewalAmount = () => {
    const newId = `renewal_${Date.now()}`;
    const newRenewal: RenewalAmount = {
      id: newId,
      years: 1,
      amount: 300,
      label: '1 Year Renewal',
      isActive: true
    };
    setRenewalAmounts([...renewalAmounts, newRenewal]);
  };

  const removeRenewalAmount = (renewalId: string) => {
    if (renewalAmounts.length <= 1) {
      toast({
        title: "Cannot Remove",
        description: "At least one renewal amount must remain active.",
        variant: "destructive"
      });
      return;
    }
    setRenewalAmounts(renewals => renewals.filter(renewal => renewal.id !== renewalId));
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
    <div className="container mx-auto p-6 max-w-4xl pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Renewal Settings</h1>
          <p className="text-slate-400">Manage renewal amounts for different subscription periods</p>
        </div>

        <div className="space-y-6">
          {/* Renewal Amounts */}
          <Card className="bg-slate-800/70 border-slate-600/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Renewal Amounts - Different Years
              </CardTitle>
              <Button
                onClick={addNewRenewalAmount}
                className="bg-purple-600 hover:bg-purple-700 text-white"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Renewal
              </Button>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-slate-300 text-sm mb-4">
                  Set different renewal amounts for different subscription periods. These rates apply when suppliers renew their existing subscriptions.
                </p>
                <div className="bg-slate-900/50 rounded-lg border border-slate-600/30 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-700/50">
                        <th className="text-left p-4 text-slate-200 font-semibold">Sl. No.</th>
                        <th className="text-left p-4 text-slate-200 font-semibold">Renewal Label</th>
                        <th className="text-left p-4 text-slate-200 font-semibold">Years</th>
                        <th className="text-left p-4 text-slate-200 font-semibold">Renewal Amount (₹)</th>
                        <th className="text-left p-4 text-slate-200 font-semibold">Status</th>
                        <th className="text-left p-4 text-slate-200 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {renewalAmounts.map((renewal, index) => (
                        <tr
                          key={renewal.id}
                          className="border-t border-slate-600/30 hover:bg-slate-700/30 transition-colors"
                        >
                          <td className="p-4 text-slate-300 font-medium">{index + 1}</td>
                          <td className="p-4">
                            <Input
                              value={renewal.label}
                              onChange={(e) => updateRenewalAmount(renewal.id, 'label', e.target.value)}
                              className="bg-slate-600/50 border-slate-500 text-white"
                              placeholder="e.g., 1 Year Renewal"
                            />
                          </td>
                          <td className="p-4">
                            <Input
                              type="number"
                              value={renewal.years}
                              onChange={(e) => updateRenewalAmount(renewal.id, 'years', Number(e.target.value))}
                              className="bg-slate-600/50 border-slate-500 text-white"
                              min="1"
                              max="10"
                            />
                          </td>
                          <td className="p-4">
                            <div className="flex items-center">
                              <span className="text-slate-400 mr-1">₹</span>
                              <Input
                                type="number"
                                value={renewal.amount}
                                onChange={(e) => updateRenewalAmount(renewal.id, 'amount', Number(e.target.value))}
                                className="bg-slate-600/50 border-slate-500 text-white"
                                min="0"
                              />
                            </div>
                          </td>
                          <td className="p-4">
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={renewal.isActive}
                                onChange={(e) => updateRenewalAmount(renewal.id, 'isActive', e.target.checked)}
                                className="rounded text-purple-600"
                              />
                              <span className={`text-sm font-medium ${renewal.isActive ? 'text-purple-400' : 'text-red-400'}`}>
                                {renewal.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </label>
                          </td>
                          <td className="p-4">
                            <Button
                              onClick={() => removeRenewalAmount(renewal.id)}
                              variant="destructive"
                              size="sm"
                              className="bg-red-600 hover:bg-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
