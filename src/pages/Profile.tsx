
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Calendar, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import NavigationHeader from '@/components/NavigationHeader';
import { Separator } from '@/components/ui/separator';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  
  // In a real app these would come from a user context/authentication system
  const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    joinDate: "January 2023"
  };
  
  const menuItems = [
    {
      title: "Account Settings",
      icon: <User className="h-4 w-4 mr-3" />,
      action: () => navigate('/settings')
    },
    {
      title: "Preferences",
      icon: <Settings className="h-4 w-4 mr-3" />,
      action: () => navigate('/settings/preferences')
    },
    {
      title: "Goal Setting",
      icon: <Calendar className="h-4 w-4 mr-3" />,
      action: () => navigate('/goals')
    }
  ];
  
  return (
    <div className="app-container animate-fade-in pb-16">
      <NavigationHeader title="Profile" />
      
      <div className="p-4 space-y-6">
        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="h-24 w-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <User className="h-12 w-12 text-muted-foreground" />
            </div>
            
            <h2 className="text-xl font-bold">{userData.name}</h2>
            <p className="text-muted-foreground">{userData.email}</p>
            <p className="text-xs text-muted-foreground mt-1">Member since {userData.joinDate}</p>
            
            <Button className="mt-4" onClick={() => navigate('/settings')}>
              Edit Profile
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">Settings</h3>
            <div className="space-y-1">
              {menuItems.map((item, index) => (
                <React.Fragment key={index}>
                  <div 
                    className="flex items-center justify-between py-2 cursor-pointer hover:bg-secondary/20 rounded-md px-2"
                    onClick={item.action}
                  >
                    <div className="flex items-center">
                      {item.icon}
                      <span>{item.title}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  {index < menuItems.length - 1 && <Separator />}
                </React.Fragment>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
