
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ReportForm from '@/components/ReportForm';

const Submit = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <ReportForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Submit;
