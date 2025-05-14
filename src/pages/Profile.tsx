
import React from 'react';
import { useFirestore } from '@/context/FirestoreContext';

const Profile = () => {
  const { user } = useFirestore();
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      
      <div className="bg-card rounded-lg p-6 border">
        <div className="flex flex-col items-center md:flex-row md:items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-2xl text-primary font-bold">
            {user?.displayName?.[0] || 'U'}
          </div>
          
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{user?.displayName || 'User'}</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            
            <div className="mt-6 space-y-4">
              <div>
                <h3 className="text-sm font-medium">Email</h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              
              <button className="bg-primary text-white px-4 py-2 rounded-md">Edit Profile</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
