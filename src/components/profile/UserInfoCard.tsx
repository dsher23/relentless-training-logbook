
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface UserInfo {
  name: string;
  email: string;
  joinDate: string;
  phone?: string;
  avatarUrl?: string;
}

interface UserInfoCardProps {
  userData: UserInfo;
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({ userData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
          <Avatar className="h-24 w-24">
            {userData.avatarUrl ? (
              <AvatarImage src={userData.avatarUrl} alt={userData.name} />
            ) : (
              <AvatarFallback className="bg-secondary">
                <User className="h-12 w-12" />
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1 space-y-2 text-center sm:text-left">
            <h3 className="text-2xl font-semibold">{userData.name}</h3>
            <p className="text-muted-foreground">{userData.email}</p>
          </div>
        </div>
        
        <div className="grid gap-4 pt-4">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Member Since</p>
              <p>{userData.joinDate}</p>
            </div>
            {userData.phone && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <p>{userData.phone}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInfoCard;
