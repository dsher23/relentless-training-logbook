
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
        src="/lovable-uploads/f5f1f062-b6f3-43c1-9fd4-6d0e99c7563a.png"
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
