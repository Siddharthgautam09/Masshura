import React from 'react';
import { User, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  activeSection: 'profile' | 'payment';
  onSectionChange: (section: 'profile' | 'payment') => void;
}

const SupplierSidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  return (
    <aside className="bg-slate-900 text-white w-full md:w-64 min-h-screen flex flex-col py-8 px-4 border-r border-slate-800">
      <div className="mb-8">
        <div className="text-2xl font-bold mb-2">Supplier Dashboard</div>
      </div>
      <div className="flex-1 flex flex-col gap-8">
        {/* Supplier Info Section */}
        <div>
          <div className="uppercase text-xs text-slate-400 mb-2 tracking-widest">Supplier Info</div>
          <Button
            variant={activeSection === 'profile' ? 'default' : 'ghost'}
            className="w-full flex items-center gap-2 mb-2"
            onClick={() => onSectionChange('profile')}
          >
            <User className="w-4 h-4" />
            Profile
          </Button>
        </div>
        {/* Payment Info Section */}
        <div>
          <div className="uppercase text-xs text-slate-400 mb-2 tracking-widest">Payment Info</div>
          <Button
            variant={activeSection === 'payment' ? 'default' : 'ghost'}
            className="w-full flex items-center gap-2"
            onClick={() => onSectionChange('payment')}
          >
            <CreditCard className="w-4 h-4" />
            Payment History
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default SupplierSidebar;
