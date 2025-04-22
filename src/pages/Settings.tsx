
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { 
  Sun, 
  Moon, 
  Bell, 
  CloudSync, 
  Lock, 
  Info, 
  LogOut,
  Mail
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Settings = () => {
  const { exportData } = useAppContext();
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  const handleExportData = (type: "workouts" | "measurements" | "supplements") => {
    const data = exportData(type);
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ironlog-${type}-export.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast({
      title: "Export Complete",
      description: `Your ${type} data has been exported successfully.`,
    });
  };

  return (
    <div className="container max-w-2xl mx-auto p-4 pb-24">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Theme Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            <h2 className="text-lg font-semibold">Theme</h2>
          </div>
          <Switch 
            checked={isDarkMode}
            onCheckedChange={setIsDarkMode}
            aria-label="Toggle theme"
          />
        </div>
        <Separator className="my-4" />
      </div>

      {/* Notifications Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>
          <Switch 
            checked={notificationsEnabled}
            onCheckedChange={setNotificationsEnabled}
            aria-label="Toggle notifications"
          />
        </div>
        {notificationsEnabled && (
          <div className="space-y-3 mt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Supplement Reminders</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Workout Reminders</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Progress Photo Reminders</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Routine Change Reminders</span>
              <Switch defaultChecked />
            </div>
          </div>
        )}
        <Separator className="my-4" />
      </div>

      {/* Data & Backup Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <CloudSync className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Data & Backup</h2>
        </div>
        <div className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={() => handleExportData("workouts")}
          >
            Export Workout Data
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => handleExportData("measurements")}
          >
            Export Measurements Data
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => handleExportData("supplements")}
          >
            Export Supplement Data
          </Button>
        </div>
        <Separator className="my-4" />
      </div>

      {/* Privacy & Security Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Privacy & Security</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Lock App with Face ID</span>
            <Switch />
          </div>
          <Button variant="outline" className="w-full justify-start text-destructive">
            Clear App Data
          </Button>
        </div>
        <Separator className="my-4" />
      </div>

      {/* App Info Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5" />
          <h2 className="text-lg font-semibold">App Info</h2>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Version 1.0.0</p>
          <Button variant="outline" className="w-full justify-start">
            Rate the App
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Send Feedback
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
