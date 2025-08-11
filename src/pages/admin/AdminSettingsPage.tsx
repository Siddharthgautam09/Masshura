// src/pages/admin/AdminSettingsPage.tsx

import React from 'react';
import CategoryManager from '../../components/admin/CategoryManager';
import { Settings, Database, Users, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminSettingsPage = () => {
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
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-400/30">
                <Settings className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Admin Settings</h1>
                <p className="text-slate-300 mt-1">Manage categories and system configurations</p>
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
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Globe className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Countries of Operation</h3>
                  <p className="text-slate-300 text-sm">Manage available countries for supplier registration</p>
                </div>
              </div>
              <CategoryManager
                title=""
                categoryName="countries"
              />
            </div>

            {/* Years in Operation */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Database className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Years in Operation</h3>
                  <p className="text-slate-300 text-sm">Configure experience level categories</p>
                </div>
              </div>
              <CategoryManager
                title=""
                categoryName="yearsInOperation"
              />
            </div>

            {/* Number of Employees */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Users className="h-5 w-5 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Number of Employees</h3>
                  <p className="text-slate-300 text-sm">Set company size categories</p>
                </div>
              </div>
              <CategoryManager
                title=""
                categoryName="employeeCount"
              />
            </div>

            {/* System Stats */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Settings className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">System Statistics</h3>
                  <p className="text-slate-300 text-sm">Overview of system data</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                  <span className="text-slate-300">Active Categories</span>
                  <span className="text-white font-semibold">3</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                  <span className="text-slate-300">Total Items</span>
                  <span className="text-white font-semibold">Loading...</span>
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
