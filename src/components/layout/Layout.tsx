import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { User } from '@models/user.types';
import { Route } from '@utils/constants';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Route;
  onNavigate: (page: Route) => void;   
  user: User | null;
  onLogout: () => void;
  pageTitle: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  currentPage,
  onNavigate,
  user,
  onLogout,
  pageTitle
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentPage={currentPage}
        onNavigate={onNavigate}
        user={user}
        onLogout={onLogout}
      />
      <div className="flex-1 overflow-auto">
        <Header title={pageTitle} user={user} />
        <main>{children}</main>
      </div>
    </div>
  );
};