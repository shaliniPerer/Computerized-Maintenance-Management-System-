import React from 'react';
import { Menu, X, Wrench, LayoutDashboard, Briefcase, Calendar, Bell, LogOut } from 'lucide-react';
import type { User } from '@models/user.types';
import { Route } from '@utils/constants';


interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentPage: Route;
  onNavigate: (page: Route) => void;
  user: User | null;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  currentPage,
  onNavigate,
  user,
  onLogout
}) => {
  const navigation = [
    { name: 'Dashboard', icon: <LayoutDashboard size={24} />, page: 'dashboard' },
    { name: 'Work Orders', icon: <Briefcase size={24} />, page: 'workorders' },
    { name: 'Preventive Maintenance', icon: <Calendar size={24} />, page: 'pm' },
    { name: 'Notifications', icon: <Bell size={24} />, page: 'notifications' }
  ];

  return (
    <div className={`${isOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300 flex flex-col`}>
      <div className="p-4 flex items-center justify-between border-b border-gray-800">
        {isOpen && (
          <div className="flex items-center gap-2">
            <Wrench size={28} />
            <span className="font-bold text-lg">MaintenancePro</span>
          </div>
        )}
        <button onClick={onToggle} className="text-white hover:text-gray-300">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <nav className="flex-1 py-4">
        {navigation.map(item => (
          <button
            key={item.page}
            onClick={() => onNavigate(item.page as Route)}
            className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition ${
              currentPage === item.page && 'bg-gray-800 border-l-4 border-blue-500'
            }`}
          >
            {item.icon}
            {isOpen && <span>{item.name}</span>}
          </button>
        ))}
      </nav>

      <div className="border-t border-gray-800 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-semibold">
            {user?.name?.[0]}
          </div>
          {isOpen && (
            <div className="flex-1">
              <p className="text-sm font-semibold">{user?.name}</p>
              <p className="text-xs text-gray-400">{user?.role}</p>
            </div>
          )}
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-2 py-2 hover:bg-gray-800 rounded transition"
        >
          <LogOut size={20} />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};