
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ReportsList from '@/components/ReportsList';

const Reports = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Browse Reports</h1>
          <ReportsList />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Reports;
