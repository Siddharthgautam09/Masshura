import React from 'react';
import SupplierList from '../../components/admin/SupplierList'; // We will create this next

const AdminDashboard = () => {
  // These values will eventually come from an API call to your backend
  const totalSupplierRegistrations = 125;
  const pendingUpdates = 15;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Supplier Registrations</h3>
          <p className="text-3xl">{totalSupplierRegistrations}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Pending Updates</h3>
          <p className="text-3xl">{pendingUpdates}</p>
        </div>
      </div>
      
      <h2 className="text-xl font-bold mb-4">Supplier Management</h2>
      <SupplierList />
    </div>
  );
};

export default AdminDashboard;
