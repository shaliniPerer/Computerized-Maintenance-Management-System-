import React from 'react';

type BadgeColor = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'gray';

interface BadgeProps {
  children: React.ReactNode;
  color?: BadgeColor;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  color = 'gray',
  className = '' 
}) => {
  const colors: Record<BadgeColor, string> = {
    red: 'bg-red-100 text-red-800',
    orange: 'bg-orange-100 text-orange-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    gray: 'bg-gray-100 text-gray-800'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[color]} ${className}`}>
      {children}
    </span>
  );
};