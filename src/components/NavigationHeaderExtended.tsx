
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavigationHeaderProps {
  title: string;
  showBack?: boolean;
  showHome?: boolean;
  showProfile?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  title,
  showBack = true,
  showHome = true,
  showProfile = true,
  children,
  className
}) => {
  const navigate = useNavigate();

  return (
    <div className={cn("sticky top-0 z-10 bg-background border-b border-border py-3 px-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              aria-label="Back"
              className="rounded-full"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          
          <h1 className="font-bold text-xl tracking-tight">{title}</h1>
        </div>
        
        <div className="flex gap-2">
          {children}
          
          {showHome && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/dashboard')}
              aria-label="Home"
              className="rounded-full"
            >
              <Home className="h-4 w-4" />
            </Button>
          )}
          
          {showProfile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/profile')}
              aria-label="Profile"
              className="rounded-full"
            >
              <User className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavigationHeader;
