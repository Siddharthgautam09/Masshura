import React from 'react';
import SupplierForm from '../components/SupplierForm';
import Footer from '../components/Footer';

const SupplierRegistrationPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="navbar-content-spacing">
        <SupplierForm />
      </div>
      <Footer />
    </div>
  );
};

export default SupplierRegistrationPage;
