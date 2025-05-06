import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { doc, setDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../firebase";

const Profile: React.FC = () => {
  const { user, userProfile, workouts, unitSystem } = useAppContext();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(userProfile?.displayName || "");
  const [startWeight, setStartWeight] = useState(userProfile?.startWeight?.toString() || "");
  const [currentWeight, setCurrentWeight] = useState(userProfile?.currentWeight?.toString() || "");
  const [goalWeight, setGoalWeight] = useState(userProfile?.goalWeight?.toString() || "");
  const [bio, setBio] = useState(userProfile?.bio || "");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState(userProfile?.profilePictureUrl || "");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || "");
      setStartWeight(userProfile.startWeight?.toString() || "");
      setCurrentWeight(userProfile.currentWeight?.toString() || "");
      setGoalWeight(userProfile.goalWeight?.toString() || "");
      setBio(userProfile.bio || "");
      setProfilePictureUrl(userProfile.profilePictureUrl || "");
    }
  }, [userProfile]);

  const handleSave = async () => {
    if (!user) return;

    setIsEditing(false);
    const userId = user.uid;

    try {
      // Update Firebase Authentication display name
      await updateProfile(user, { displayName });

      // Prepare profile data for Firestore
      const profileData = {
        displayName,
        email: userProfile?.email,
        createdAt: userProfile?.createdAt,
        startWeight: parseFloat(startWeight) || 0,
        currentWeight: parseFloat(currentWeight) || 0,
        goalWeight: parseFloat(goalWeight) || 0,
        bio,
        profilePictureUrl,
      };

      // If a new profile picture was uploaded, upload it to Firebase Storage
      if (profilePicture) {
        setIsUploading(true);
        const storageRef = ref(storage, `users/${userId}/profile-picture`);
        await uploadBytes(storageRef, profilePicture);
        const downloadUrl = await getDownloadURL(storageRef);
        profileData.profilePictureUrl = downloadUrl;
        setProfilePictureUrl(downloadUrl);
        setIsUploading(false);
      }

      // Save updated profile to Firestore
      await setDoc(doc(db, `users/${userId}/profile`, "info"), profileData, { merge: true });

      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error.message);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setDisplayName(userProfile?.displayName || "");
    setStartWeight(userProfile?.startWeight?.toString() || "");
    setCurrentWeight(userProfile?.currentWeight?.toString() || "");
    setGoalWeight(userProfile?.goalWeight?.toString() || "");
    setBio(userProfile?.bio || "");
    setProfilePicture(null);
    setProfilePictureUrl(userProfile?.profilePictureUrl || "");
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  // Calculate total workouts completed
  const totalWorkoutsCompleted = workouts.filter(w => w.completed).length;

  // Calculate weight change since starting
  const weightChange = (parseFloat(currentWeight) || 0) - (parseFloat(startWeight) || 0);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section with Gradient Background */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-8 px-4 text-center">
        <div className="relative inline-block">
          <img
            src={profilePictureUrl || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
          />
          {isEditing && (
            <div className="absolute bottom-0 right-0">
              <label htmlFor="profile-picture-upload">
                <div className="bg-white text-blue-600 rounded-full p-2 cursor-pointer shadow-md hover:bg-gray-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              </label>
              <input
                id="profile-picture-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfilePictureChange}
              />
            </div>
          )}
        </div>
        <h1 className="text-3xl font-bold mt-4">
          {isEditing ? (
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="text-center text-black"
              placeholder="Enter your name"
            />
          ) : (
            displayName || "User"
          )}
        </h1>
        <p className="mt-2 text-lg">
          {isEditing ? (
            <Input
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="text-center text-black"
              placeholder="Tell us about yourself"
            />
          ) : (
            bio || "Tell us about yourself!"
          )}
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto p-4">
        {/* Stats Overview Card */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Your Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Total Workouts Completed</p>
                <p className="text-lg font-bold">{totalWorkoutsCompleted}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Weight Change Since Start</p>
                <p className={`text-lg font-bold ${weightChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {weightChange.toFixed(1)} {unitSystem.bodyWeightUnit}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Progress to Goal</p>
                <p className="text-lg font-bold">
                  {(parseFloat(currentWeight) || 0) - (parseFloat(goalWeight) || 0) >= 0
                    ? `+${((parseFloat(currentWeight) || 0) - (parseFloat(goalWeight) || 0)).toFixed(1)}`
                    : ((parseFloat(currentWeight) || 0) - (parseFloat(goalWeight) || 0)).toFixed(1)}{" "}
                  {unitSystem.bodyWeightUnit}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details Card */}
        <Card className="mb-6 shadow-lg">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold">Profile Details</CardTitle>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="bg-blue-500 hover:bg-blue-600">
                Edit Profile
              </Button>
            ) : (
              <div>
                <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600 mr-2" disabled={isUploading}>
                  {isUploading ? "Uploading..." : "Save"}
                </Button>
                <Button onClick={handleCancel} variant="outline">
                  Cancel
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={userProfile?.email || ""} disabled className="bg-gray-100" />
            </div>
            <div>
              <Label htmlFor="start-weight">Start Weight ({unitSystem.bodyWeightUnit})</Label>
              {isEditing ? (
                <Input
                  id="start-weight"
                  type="number"
                  value={startWeight}
                  onChange={(e) => setStartWeight(e.target.value)}
                  placeholder="Enter your starting weight"
                />
              ) : (
                <p className="text-lg">{startWeight || "Not set"} {unitSystem.bodyWeightUnit}</p>
              )}
            </div>
            <div>
              <Label htmlFor="current-weight">Current Weight ({unitSystem.bodyWeightUnit})</Label>
              {isEditing ? (
                <Input
                  id="current-weight"
                  type="number"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(e.target.value)}
                  placeholder="Enter your current weight"
                />
              ) : (
                <p className="text-lg">{currentWeight || "Not set"} {unitSystem.bodyWeightUnit}</p>
              )}
            </div>
            <div>
              <Label htmlFor="goal-weight">Goal Weight ({unitSystem.bodyWeightUnit})</Label>
              {isEditing ? (
                <Input
                  id="goal-weight"
                  type="number"
                  value={goalWeight}
                  onChange={(e) => setGoalWeight(e.target.value)}
                  placeholder="Enter your goal weight"
                />
              ) : (
                <p className="text-lg">{goalWeight || "Not set"} {unitSystem.bodyWeightUnit}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
