
import React from 'react';

const Settings = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      
      <div className="space-y-6">
        <div className="bg-card rounded-lg p-4 border">
          <h2 className="text-lg font-medium mb-4">General Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">App Theme</label>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg p-4 border">
          <h2 className="text-lg font-medium mb-4">Account Settings</h2>
          <button className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md">Sign Out</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
