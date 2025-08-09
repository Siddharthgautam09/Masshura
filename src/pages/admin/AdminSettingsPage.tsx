// src/pages/admin/AdminSettingsPage.tsx

import React from 'react';
import CategoryManager from '../../components/admin/CategoryManager';

const AdminSettingsPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Manage Categories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <CategoryManager
          title="Countries of Operation"
          categoryName="countries" // This MUST match the document ID in Firestore
        />
        <CategoryManager
          title="Years in Operation"
          categoryName="yearsInOperation" // This MUST match the document ID in Firestore
        />
        <CategoryManager
          title="Number of Employees"
          categoryName="employeeCount" // This MUST match the document ID in Firestore
        />
        {/* Add more CategoryManager components for other filters as needed */}
      </div>
    </div>
  );
};

export default AdminSettingsPage;
