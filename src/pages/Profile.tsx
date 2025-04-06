
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProfileView from '@/components/ProfileView';

const Profile = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
          <ProfileView />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
