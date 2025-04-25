
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Sun, 
  Moon, 
  Bell, 
  Cloud, 
  Lock, 
  Info, 
  Ruler
} from 'lucide-react';
import { toast } from 'sonner';
import NavigationHeader from '@/components/NavigationHeader';

const Settings = () => {
  const { exportData, unitSystem = { bodyWeightUnit: 'kg', bodyMeasurementUnit: 'cm', liftingWeightUnit: 'kg' }, updateUnitSystem } = useAppContext();
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
    toast.success(`Your ${type} data has been exported successfully.`);
  };

  return (
    <div className="container max-w-2xl mx-auto p-4 pb-24">
      <NavigationHeader title="Settings" showBack showHome />
      
      {/* Unit System Section */}
      <div className="mb-6 mt-4">
        <div className="flex items-center gap-2 mb-4">
          <Ruler className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Unit System</h2>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Body Weight Unit</label>
            <Select 
              value={unitSystem.bodyWeightUnit}
              onValueChange={(value) => updateUnitSystem({ bodyWeightUnit: value as 'kg' | 'lbs' | 'stone' })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">Kilograms (kg)</SelectItem>
                <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                <SelectItem value="stone">Stone (st)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Body Measurement Unit</label>
            <Select 
              value={unitSystem.bodyMeasurementUnit}
              onValueChange={(value) => updateUnitSystem({ bodyMeasurementUnit: value as 'cm' | 'in' })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cm">Centimeters (cm)</SelectItem>
                <SelectItem value="in">Inches (in)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Lifting Weight Unit</label>
            <Select 
              value={unitSystem.liftingWeightUnit}
              onValueChange={(value) => updateUnitSystem({ liftingWeightUnit: value as 'kg' | 'lbs' })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">Kilograms (kg)</SelectItem>
                <SelectItem value="lbs">Pounds (lbs)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Separator className="my-4" />
      </div>

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
          <Cloud className="w-5 h-5" />
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
