import React, { useState } from 'react';
import { Layout } from './components/layout';
import { HomePage, LoginPage, SignupPage } from '@pages/public';
import { Dashboard } from '@pages/dashboard';
import { WorkOrdersList } from '@pages/workOrders';
import { PreventiveMaintenance } from '@pages/preventiveMaintenance';
import { NotificationsPage } from '@pages/notifications';
import { useAuth } from '@hooks/useAuth';
import { Route, ROUTES } from '@utils/constants';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Route>(ROUTES.HOME);
  const { isAuthenticated, user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', page: ROUTES.DASHBOARD },
    { name: 'Work Orders', page: ROUTES.WORK_ORDERS },
    { name: 'Preventive Maintenance', page: ROUTES.PM },
    { name: 'Notifications', page: ROUTES.NOTIFICATIONS }
  ];

  const handleLogout = () => {
    logout();
    setCurrentPage(ROUTES.HOME);
  };

  const renderPage = () => {
    if (!isAuthenticated) {
      if (currentPage === ROUTES.LOGIN) {
        return <LoginPage onNavigate={setCurrentPage} />;
      }
      if (currentPage === 'signup') { // Add signup route
        return <SignupPage onNavigate={setCurrentPage} />;
      }
      return <HomePage onNavigate={setCurrentPage} />;
    }
    switch (currentPage) {
      case ROUTES.DASHBOARD:
        return <Dashboard />;
      case ROUTES.WORK_ORDERS:
        return <WorkOrdersList />;
      case ROUTES.PM:
        return <PreventiveMaintenance />;
      case ROUTES.NOTIFICATIONS:
        return <NotificationsPage />;
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return renderPage();
  }

  const pageTitle = navigation.find(n => n.page === currentPage)?.name || 'Dashboard';

  return (
    <Layout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      user={user}
      onLogout={handleLogout}
      pageTitle={pageTitle}
    >
      {renderPage()}
    </Layout>
  );
};

const App: React.FC = () => {
  return <AppContent />;
};

export default App;