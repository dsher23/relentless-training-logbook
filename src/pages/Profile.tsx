
import React from "react";
import NavigationHeader from "@/components/NavigationHeader";
import UserInfoCard from "@/components/profile/UserInfoCard";
import SettingsCard from "@/components/profile/SettingsCard";
import { useToast } from "@/hooks/use-toast";

const Profile: React.FC = () => {
  const { toast } = useToast();
  
  // In a real app these would come from a user context/authentication system
  const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    joinDate: "January 2023",
    phone: "+1 234 567 8900",
    avatarUrl: undefined
  };

  const [settings, setSettings] = React.useState({
    darkMode: false,
    restTimer: true,
    units: "kg" as "kg" | "lbs",
    showLastLift: true,
    showMotivation: true
  });

  const handleSettingChange = (
    setting: "darkMode" | "restTimer" | "units" | "showLastLift" | "showMotivation",
    value: boolean | string
  ) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
    toast({
      title: "Settings updated",
      description: "Your preferences have been saved."
    });
  };

  const handleResetData = () => {
    // In a real app, this would clear all user data
    toast({
      title: "Data reset",
      description: "All your data has been reset successfully.",
      variant: "destructive"
    });
  };

  return (
    <div className="app-container animate-fade-in pb-16">
      <NavigationHeader title="Profile" />
      
      <div className="p-4 space-y-6">
        <UserInfoCard userData={userData} />
        <SettingsCard
          settings={settings}
          onSettingChange={handleSettingChange}
          onResetData={handleResetData}
        />
      </div>
    </div>
  );
};

export default Profile;
