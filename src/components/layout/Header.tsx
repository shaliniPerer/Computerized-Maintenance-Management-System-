import React from 'react';
import { Bell } from 'lucide-react';
import { User } from '@models/user.types';

interface HeaderProps {
  title: string;
  user: User | null;
}

export const Header: React.FC<HeaderProps> = ({ title, user }) => {
  return (
    <header className="bg-white shadow-sm px-6 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <div className="flex items-center gap-4">
          <button className="relative">
            <Bell size={24} className="text-gray-600 hover:text-gray-800" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
            {user?.name?.[0]}
          </div>
        </div>
      </div>
    </header>
  );
};