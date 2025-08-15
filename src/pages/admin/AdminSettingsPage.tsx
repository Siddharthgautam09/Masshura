// src/pages/admin/AdminSettingsPage.tsx

import React from 'react';
import CategoryManager from '../../components/admin/CategoryManager';
import { Settings, Database, Users, Globe, RefreshCw, Plus, CheckCircle, Phone, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { collection } from 'firebase/firestore';
import { db } from '../../components/firebase';
import { populateDefaultCategories } from '../../utils/populateDefaultCategories';
import { useAllCategories } from '../../hooks/useAdminCategories';
import { Link } from 'react-router-dom';

const AdminSettingsPage = () => {
  const { toast } = useToast();
  const { countries, emirates, yearsInOperation, businessTypes, employeeCount, supplyCategories, countryCodes } = useAllCategories();
  
  // Calculate total number of category types with items
  const activeCategoriesCount = [
    countries.items.length > 0 ? 1 : 0,
    emirates.items.length > 0 ? 1 : 0,
    yearsInOperation.items.length > 0 ? 1 : 0,
    businessTypes.items.length > 0 ? 1 : 0,
    employeeCount.items.length > 0 ? 1 : 0,
    supplyCategories.items.length > 0 ? 1 : 0,
    countryCodes.items.length > 0 ? 1 : 0
  ].reduce((sum, count) => sum + count, 0);
  
  
  const handleRefreshPage = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-20"
      />
      
      {/* Header */}
      <div className="relative pt-20 pb-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-blue-500/20 rounded-2xl border border-blue-400/30">
                <Settings className="h-12 w-12 text-blue-400" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Admin <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Settings</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Manage company registration categories and system configuration
            </p>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-wrap gap-4 justify-center mb-12"
          >
            <Button
              onClick={handleRefreshPage}
              variant="outline"
              className="bg-slate-800/50 border-slate-600 text-white hover:bg-slate-700/50"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Page
            </Button>
          </motion.div>

          {/* Category Management Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Countries */}
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-slate-600/30">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-green-500/20 rounded-lg border border-green-400/30">
                  <Globe className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Countries</h3>
                  <p className="text-slate-300 text-sm">Manage available countries for company registration</p>
                </div>
              </div>
              <CategoryManager
                title=""
                categoryName="countries"
              />
            </div>

            {/* Emirates */}
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-slate-600/30">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-cyan-500/20 rounded-lg border border-cyan-400/30">
                  <Globe className="h-6 w-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">UAE Emirates</h3>
                  <p className="text-slate-300 text-sm">Manage available emirates for company location</p>
                </div>
              </div>
              <CategoryManager
                title=""
                categoryName="emirates"
              />
            </div>

            {/* Years of Operation */}
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-slate-600/30">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-purple-500/20 rounded-lg border border-purple-400/30">
                  <Database className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Years of Operation</h3>
                  <p className="text-slate-300 text-sm">Configure experience level categories</p>
                </div>
              </div>
              <CategoryManager
                title=""
                categoryName="yearsOfOperation"
              />
            </div>

            {/* Business Types */}
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-slate-600/30">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-indigo-500/20 rounded-lg border border-indigo-400/30">
                  <RefreshCw className="h-6 w-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Business Types</h3>
                  <p className="text-slate-300 text-sm">Manage available business type categories</p>
                </div>
              </div>
              <CategoryManager
                title=""
                categoryName="businessTypes"
              />
            </div>

            {/* Number of Employees */}
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-slate-600/30">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-orange-500/20 rounded-lg border border-orange-400/30">
                  <Users className="h-6 w-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Number of Employees</h3>
                  <p className="text-slate-300 text-sm">Set company size categories</p>
                </div>
              </div>
              <CategoryManager
                title=""
                categoryName="employeeCount"
              />
            </div>

            {/* Supply Categories */}
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-slate-600/30">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-emerald-500/20 rounded-lg border border-emerald-400/30">
                  <CheckCircle className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Supply Categories</h3>
                  <p className="text-slate-300 text-sm">Manage available supply categories for companies</p>
                </div>
              </div>
              <CategoryManager
                title=""
                categoryName="supplyCategories"
              />
            </div>

            {/* Country Codes */}
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-slate-600/30">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-pink-500/20 rounded-lg border border-pink-400/30">
                  <Phone className="h-6 w-6 text-pink-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Country Codes</h3>
                  <p className="text-slate-300 text-sm">Manage available country codes for phone numbers</p>
                </div>
              </div>
              <CategoryManager
                title=""
                categoryName="countryCodes"
              />
            </div>

            {/* Subscription Settings */}
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-slate-600/30">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-green-500/20 rounded-lg border border-green-400/30">
                    <CreditCard className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Subscription Settings</h3>
                    <p className="text-slate-300 text-sm">Manage subscription plans and renewal amounts</p>
                  </div>
                </div>
                <Link to="/admin/subscription-settings">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <Settings className="w-4 h-4 mr-2" />
                    Manage Plans
                  </Button>
                </Link>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-slate-700/40 rounded-lg border border-slate-600/30">
                  <div>
                    <span className="text-white font-medium">Renewal Amounts</span>
                    <p className="text-slate-400 text-xs">Different pricing for 1, 2, 3, 5+ year renewals</p>
                  </div>
                  <div className="text-sm text-purple-400 font-medium">
                    Configure →
                  </div>
                </div>
              </div>
            </div>

            {/* System Statistics */}
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-slate-600/30">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-blue-500/20 rounded-lg border border-blue-400/30">
                  <Settings className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">System Statistics</h3>
                  <p className="text-slate-300 text-sm">Overview of system data and configuration</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-slate-700/40 rounded-lg border border-slate-600/30">
                  <div>
                    <span className="text-white font-medium">Active Categories</span>
                    <p className="text-slate-400 text-xs">Total number of category types with data</p>
                  </div>
                  <div className="text-2xl font-bold text-blue-400">{activeCategoriesCount}</div>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-700/40 rounded-lg border border-slate-600/30">
                  <div>
                    <span className="text-white font-medium">Database Status</span>
                    <p className="text-slate-400 text-xs">Firebase connection status</p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span className="text-green-400 font-medium">Connected</span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-700/40 rounded-lg border border-slate-600/30">
                  <div>
                    <span className="text-white font-medium">Last Updated</span>
                    <p className="text-slate-400 text-xs">Most recent category modification</p>
                  </div>
                  <div className="text-sm text-slate-300">
                    {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
