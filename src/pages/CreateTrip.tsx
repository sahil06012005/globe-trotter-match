
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import TripForm from '@/components/trips/TripForm';

const CreateTrip = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 mt-16 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Create a Trip</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <TripForm />
        </div>
      </div>
    </Layout>
  );
};

export default CreateTrip;
