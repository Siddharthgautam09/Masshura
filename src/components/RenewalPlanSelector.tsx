import React, { useEffect, useState } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../components/firebase';

interface RenewalAmount {
  id: string;
  years: number;
  amount: number;
  label: string;
  isActive: boolean;
}

interface RenewalPlanSelectorProps {
  selectedRenewalPlan: string;
  setSelectedRenewalPlan: (id: string) => void;
}

const RenewalPlanSelector: React.FC<RenewalPlanSelectorProps> = ({ selectedRenewalPlan, setSelectedRenewalPlan }) => {
  const [renewalPlans, setRenewalPlans] = useState<RenewalAmount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRenewalPlans = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, 'settings', 'subscriptions'));
        if (settingsDoc.exists()) {
          const data = settingsDoc.data();
          const activeRenewalPlans = (data.renewalAmounts || []).filter((renewal: RenewalAmount) => renewal.isActive);
          setRenewalPlans(activeRenewalPlans);
        }
      } catch (error) {
        // Handle error
      } finally {
        setLoading(false);
      }
    };
    fetchRenewalPlans();
  }, []);

  if (loading) return <div className="text-slate-400 text-center py-4">Loading renewal plans...</div>;

  return (
    <div className="bg-gradient-to-br from-[#6AAEFF]/10 to-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-[#6AAEFF]/30 mb-4">
      <div className="flex items-center space-x-4 mb-4">
        <div className="p-3 bg-[#6AAEFF] rounded-xl" />
        <h2 className="text-lg font-bold text-white">Select Renewal Plan</h2>
      </div>
      <div className="space-y-4">
        {renewalPlans.map((plan) => (
          <label
            key={plan.id}
            className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
              selectedRenewalPlan === plan.id
                ? 'border-blue-400 bg-blue-500/10'
                : 'border-slate-500 bg-slate-700/30 hover:bg-slate-700/50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                name="renewalPlan"
                value={plan.id}
                checked={selectedRenewalPlan === plan.id}
                onChange={() => setSelectedRenewalPlan(plan.id)}
                className="text-blue-600"
                required
              />
              <div>
                <div className="text-white font-medium">{plan.label}</div>
                <div className="text-slate-400 text-sm">
                  {plan.years} year{plan.years > 1 ? 's' : ''} renewal plan
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-blue-400 font-bold text-lg">₹{plan.amount}</div>
              <div className="text-slate-400 text-xs">
                ₹{Math.round(plan.amount / plan.years)} per year
              </div>
            </div>
          </label>
        ))}
        {renewalPlans.length === 0 && (
          <div className="text-slate-400 text-center py-4">
            No active renewal plans found.
          </div>
        )}
      </div>
    </div>
  );
};

export default RenewalPlanSelector;
