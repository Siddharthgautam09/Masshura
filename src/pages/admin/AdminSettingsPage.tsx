// src/pages/admin/AdminSettingsPage.tsx

import React from 'react';
import CategoryManager from '../../components/admin/CategoryManager';
import { Settings, Database, Users, Globe, RefreshCw, TestTube } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../components/firebase';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Pattern */}
      <div 
        className="fixed inset-0 opacity-5 pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>

      <div className="relative z-10 pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-400/30">
                  <Settings className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Admin Settings</h1>
                  <p className="text-slate-300 mt-1">Manage categories and system configurations</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={testFirebaseConnection}
                  variant="outline"
                  className="bg-green-700/50 border-green-500 text-white hover:bg-green-600 hover:text-white"
                >
                  <TestTube className="h-4 w-4 mr-2" />
                  Test DB
                </Button>
                <Button
                  onClick={handleRefreshPage}
                  variant="outline"
                  className="bg-slate-700/50 border-slate-500 text-white hover:bg-slate-600 hover:text-white"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Settings Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Countries of Operation */}
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-slate-600/30">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-green-500/20 rounded-lg border border-green-400/30">
                  <Globe className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Countries of Operation</h3>
                  <p className="text-slate-300 text-sm">Manage available countries for supplier registration</p>
                </div>
              </div>
              <CategoryManager
                title=""
                categoryName="countries"
              />
            </div>

            {/* Years in Operation */}
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-slate-600/30">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-purple-500/20 rounded-lg border border-purple-400/30">
                  <Database className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Years in Operation</h3>
                  <p className="text-slate-300 text-sm">Configure experience level categories</p>
                </div>
              </div>
              <CategoryManager
                title=""
                categoryName="yearsInOperation"
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
                  <span className="text-white font-bold text-2xl">3</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-700/40 rounded-lg border border-slate-600/30">
                  <div>
                    <span className="text-white font-medium">Database Status</span>
                    <p className="text-slate-400 text-xs">Firebase connection status</p>
                  </div>
                  <span className="text-green-400 font-medium text-sm">Connected</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-700/40 rounded-lg border border-slate-600/30">
                  <div>
                    <span className="text-white font-medium">Last Updated</span>
                    <p className="text-slate-400 text-xs">Most recent data modification</p>
                  </div>
                  <span className="text-slate-300 font-medium text-sm">Just now</span>
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
