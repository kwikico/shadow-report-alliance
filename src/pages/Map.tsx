
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MapView from '@/components/MapView';

const Map = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Report Map</h1>
          <MapView />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Map;
