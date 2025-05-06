
import React from "react";
import NavigationHeader from "@/components/NavigationHeader";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { Label } from "@/components/ui/label";

const Profile: React.FC = () => {
  const { user, userProfile } = useAppContext();

  if (!user) {
    return (
      <div className="app-container animate-fade-in pb-16">
        <NavigationHeader title="Profile" showBack={true} showHome={true} showProfile={false} />
        <div className="px-4 pt-4 text-center">
          <p className="text-red-500">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="app-container animate-fade-in pb-16">
        <NavigationHeader title="Profile" showBack={true} showHome={true} showProfile={false} />
        <div className="px-4 pt-4 text-center">
          <Loader className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container animate-fade-in pb-16">
      <NavigationHeader title="Profile" showBack={true} showHome={true} showProfile={false} />
      <div className="px-4 pt-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <Label>Display Name</Label>
              <p>{userProfile.displayName || "User"}</p>
            </div>
            <div>
              <Label>Email</Label>
              <p>{userProfile.email || "No email available"}</p>
            </div>
            <div>
              <Label>Joined</Label>
              <p>{userProfile.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : "Unknown"}</p>
            </div>
          </CardContent>
        </Card>
        <Button variant="outline" className="w-full">
          Edit Profile
        </Button>
      </div>
    </div>
  );
};

export default Profile;
