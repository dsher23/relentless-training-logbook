
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
    <img
      src="/lovable-uploads/cf1d5ff1-7878-480a-830b-da26d921e635.png"
      alt="IronLog"
      className={cn(
        "dark:invert", // Invert colors in dark mode
        sizeClasses[size],
        "w-auto object-contain",
        className
      )}
    />
  );
};

export default Logo;
