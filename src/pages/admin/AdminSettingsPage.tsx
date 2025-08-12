// src/pages/admin/AdminSettingsPage.tsx

import React from 'react';
import CategoryManager from '../../components/admin/CategoryManager';
import { Settings, Database, Users, Globe, RefreshCw, TestTube, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../components/firebase';
import { populateDefaultCategories } from '../../utils/populateDefaultCategories';

const AdminSettingsPage = () => {
  const { toast } = useToast();
  
  const handleRefreshPage = () => {
    window.location.reload();
  };

  const testFirebaseConnection = async () => {
    try {
      toast({
        title: "Testing Connection",
        description: "Testing Firebase connection...",
      });
      
      // Test adding a document to test collection
      const testCollection = collection(db, 'test');
      const docRef = await addDoc(testCollection, {
        test: 'connection',
        timestamp: new Date().toISOString()
      });
      
      toast({
        title: "Success!",
        description: `Firebase connection works! Test doc ID: ${docRef.id}`,
      });
    } catch (error: any) {
      console.error('Firebase test error:', error);
      toast({
        title: "Connection Error",
        description: `Firebase error: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handlePopulateDefaults = async () => {
    try {
      toast({
        title: "Populating Categories",
        description: "Adding default categories to the database...",
      });
      
      // Manually add default categories
      const categoriesData = {
        countries: ['United Arab Emirates', 'Saudi Arabia', 'Kuwait', 'Qatar', 'Bahrain', 'Oman'],
        emirates: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'],
        yearsOfOperation: ['1-2 years', '3-5 years', '6-10 years', '11-15 years', '15+ years'],
        businessTypes: ['IT Services', 'Hardware Supplier', 'Software Developer', 'Consulting', 'System Integration'],
        employeeCount: ['1-10', '11-50', '51-100', '101-500', '500+']
      };

      // Add categories to Firebase
      for (const [categoryName, items] of Object.entries(categoriesData)) {
        for (const itemName of items) {
          const itemsCollectionRef = collection(db, 'categories', categoryName, 'items');
          await addDoc(itemsCollectionRef, { name: itemName });
        }
      }
      
      toast({
        title: "Success!",
        description: "Default categories have been populated successfully.",
      });
      
      // Refresh the page to show new data
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      console.error('Error populating defaults:', error);
      toast({
        title: "Error",
        description: `Failed to populate defaults: ${error.message}`,
        variant: "destructive",
      });
    }
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
              Manage supplier registration categories and system configuration
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
            <Button
              onClick={testFirebaseConnection}
              variant="outline"
              className="bg-slate-800/50 border-slate-600 text-white hover:bg-slate-700/50"
            >
              <TestTube className="mr-2 h-4 w-4" />
              Test Connection
            </Button>
            <Button
              onClick={handlePopulateDefaults}
              variant="outline"
              className="bg-blue-600/20 border-blue-500 text-blue-400 hover:bg-blue-600/30"
            >
              <Database className="mr-2 h-4 w-4" />
              Populate Defaults
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
                  <p className="text-slate-300 text-sm">Manage available countries for supplier registration</p>
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
                  <p className="text-slate-300 text-sm">Manage available emirates for supplier location</p>
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
                    <p className="text-slate-400 text-xs">Total number of category types</p>
                  </div>
                  <div className="text-2xl font-bold text-blue-400">5</div>
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
