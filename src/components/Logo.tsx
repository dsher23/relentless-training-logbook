
import React from 'react';
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  textOnly?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className, size = 'md', textOnly = false }) => {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10'
  };

  if (textOnly) {
    return (
      <span className={cn(
        "font-bold text-primary tracking-tight",
        {
          'text-lg': size === 'sm',
          'text-xl': size === 'md',
          'text-2xl': size === 'lg',
        },
        className
      )}>
        IronLog
      </span>
    );
  }

  // TODO: Replace with actual logo image when available
  return (
    <span className={cn(
      "font-bold text-primary tracking-tight flex items-center",
      {
        'text-lg': size === 'sm',
        'text-xl': size === 'md',
        'text-2xl': size === 'lg',
      },
      className
    )}>
      <img 
        src="/lovable-uploads/iron-log-logo.png" 
        alt="IronLog Logo" 
        className={cn(
          "mr-2",
          sizeClasses[size]
        )} 
      />
      IronLog
    </span>
  );
};

export default Logo;
