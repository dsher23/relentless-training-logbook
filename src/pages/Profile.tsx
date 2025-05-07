
import React, { useState, useEffect } from "react";
import { auth, db, storage } from "../firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { updateProfile as updateFirebaseProfile } from "firebase/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";
import localforage from "localforage";

const Profile: React.FC = () => {
  console.log("Profile.tsx: Rendering Profile component");

  const { user, userProfile } = useAppContext();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState(userProfile?.displayName || "");
  const [bio, setBio] = useState(userProfile?.bio || "");
  const [startWeight, setStartWeight] = useState(userProfile?.startWeight || 0);
  const [currentWeight, setCurrentWeight] = useState(userProfile?.currentWeight || 0);
  const [goalWeight, setGoalWeight] = useState(userProfile?.goalWeight || 0);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load profile picture from localforage on mount
  useEffect(() => {
    const loadProfilePicture = async () => {
      try {
        const storedPicture = await localforage.getItem<string>("profilePicture");
        if (storedPicture) {
          console.log("Profile.tsx: Loaded profile picture from localforage");
          setProfilePicture(storedPicture);
        }
      } catch (error) {
        console.error("Profile.tsx: Error loading profile picture from localforage:", error);
        toast({
          title: "Error",
          description: "Failed to load profile picture.",
          variant: "destructive",
        });
      }
    };
    loadProfilePicture();
  }, [toast]);

  // Update userProfile state when it changes
  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || "");
      setBio(userProfile.bio || "");
      setStartWeight(userProfile.startWeight || 0);
      setCurrentWeight(userProfile.currentWeight || 0);
      setGoalWeight(userProfile.goalWeight || 0);
    }
  }, [userProfile]);

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      // Convert the file to a base64 string
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64String = reader.result as string;
        // Store the base64 string in localforage
        await localforage.setItem("profilePicture", base64String);
        console.log("Profile.tsx: Profile picture saved to localforage");
        setProfilePicture(base64String);
        toast({
          title: "Success",
          description: "Profile picture updated successfully.",
        });
      };
      reader.onerror = () => {
        throw new Error("Failed to read file as base64");
      };
    } catch (error) {
      console.error("Profile.tsx: Error uploading profile picture:", error);
      toast({
        title: "Error",
        description: "Failed to upload profile picture.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update your profile.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Update Firebase Authentication profile
      await updateFirebaseProfile(user, { displayName });

      // Update Firestore user profile
      const userRef = doc(db, `users/${user.uid}/profile/info`);
      await updateDoc(userRef, {
        displayName,
        bio,
        startWeight: Number(startWeight),
        currentWeight: Number(currentWeight),
        goalWeight: Number(goalWeight),
        updatedAt: new Date().toISOString(),
      });

      console.log("Profile.tsx: Profile updated successfully in Firestore");
      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
    } catch (error) {
      console.error("Profile.tsx: Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    console.log("Profile.tsx: No user, rendering nothing");
    return <div>Please log in to view your profile.</div>;
  }

  console.log("Profile.tsx: Rendering profile form - displayName:", displayName, "bio:", bio);

  return (
    <div className="app-container animate-fade-in flex items-center justify-center h-screen px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="profilePicture">Profile Picture</Label>
              {profilePicture && (
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover mb-2"
                />
              )}
              <Input
                id="profilePicture"
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your display name"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Input
                id="bio"
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="startWeight">Starting Weight (kg)</Label>
              <Input
                id="startWeight"
                type="number"
                value={startWeight}
                onChange={(e) => setStartWeight(Number(e.target.value))}
                placeholder="Enter your starting weight"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="currentWeight">Current Weight (kg)</Label>
              <Input
                id="currentWeight"
                type="number"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(Number(e.target.value))}
                placeholder="Enter your current weight"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="goalWeight">Goal Weight (kg)</Label>
              <Input
                id="goalWeight"
                type="number"
                value={goalWeight}
                onChange={(e) => setGoalWeight(Number(e.target.value))}
                placeholder="Enter your goal weight"
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
